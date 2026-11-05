/* Revisió d'una proposta (textos en català). Revisión de una propuesta de cliente (polmorera.es/<slug>/).
   Guarda las respuestas en la API propia: POST /api/propuestas/<slug>/leer y /responder,
   protegidas por la clave del enlace (?k=...). La configuración (slug y apiBase) está en config.js. */
(function () {
  var CFG = window.PROPUESTA_CONFIG || {};
  // Los vídeos salen de la página: cada bloque .review[data-video] (v1, v2, v3…)
  var VIDEOS = Array.prototype.map.call(document.querySelectorAll('.review[data-video]'), function (el) { return el.dataset.video; });
  var S = { review: {}, needs: {}, comments: {}, key: null, ready: false, readonly: true };
  var pending = {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function note(t) { var n = $('#rp-note'); if (n) n.textContent = t; }
  function setControls(on) {
    $$('.review .btn[data-act="ok"], .review .btn[data-act="changes"], .need .opt').forEach(function (b) { b.disabled = !on; });
  }
  function fmtDate(iso) {
    try { return new Intl.DateTimeFormat('ca-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)); }
    catch (e) { return ''; }
  }
  function stLabel(st, short) {
    if (st === 'ok') return 'Aprovat';
    if (st === 'changes') return short ? 'Canvis' : 'Canvis demanats';
    return short ? 'Pendent' : 'Pendent de revisar';
  }
  function getKey() {
    var k = null;
    try { k = new URLSearchParams(location.search).get('k'); } catch (e) {}
    try {
      if (k) sessionStorage.setItem('prop-k-' + CFG.slug, k);
      else k = sessionStorage.getItem('prop-k-' + CFG.slug);
    } catch (e) {}
    return k;
  }
  function getName() {
    var el = $('#rv-name');
    return el ? el.value.trim().slice(0, 80) : '';
  }

  async function rpc(fn, body) {
    var url = String(CFG.apiBase).replace(/\/$/, '') + '/api/propuestas/' + encodeURIComponent(CFG.slug) + '/' + fn;
    var r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', body: JSON.stringify(body) });
    var txt = await r.text();
    if (!r.ok) { var err = new Error(txt || ('HTTP ' + r.status)); err.status = r.status; throw err; }
    return txt ? JSON.parse(txt) : null;
  }

  function render() {
    var okCount = 0;
    VIDEOS.forEach(function (v) {
      var r = S.review[v];
      var st = (r && r.estado) || 'pending';
      if (st === 'ok') okCount++;
      var box = $('#review-' + v);
      if (!box) return;
      var chip = $('.rv-chip', box);
      chip.dataset.state = st;
      chip.textContent = stLabel(st, false);
      $('.rv-who', box).textContent = (r && r.estado) ? ((r.autor || 'Algú de l\'equip') + ' · ' + fmtDate(r.updated_at)) : '';
      var nt = $('.rv-note', box);
      // Todos los comentarios del vídeo (quién y qué), en el orden en que llegaron
      var cs = S.comments[v] || [];
      var cbox = $('.rv-comments', box);
      if (cs.length && cbox) {
        nt.hidden = true; nt.textContent = '';
        var ul = $('ul', cbox); ul.textContent = '';
        cs.forEach(function (c) {
          var li = document.createElement('li'), b = document.createElement('b');
          b.textContent = (c.autor || 'Algú de l\'equip') + ':';
          li.appendChild(b); li.appendChild(document.createTextNode(c.nota));
          ul.appendChild(li);
        });
        cbox.hidden = false;
      } else {
        if (cbox) cbox.hidden = true;
        if (st === 'changes' && r.nota) { nt.hidden = false; nt.textContent = '«' + r.nota + '»'; } else { nt.hidden = true; nt.textContent = ''; }
      }
      $$('.btn[data-act="ok"], .btn[data-act="changes"]', box).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.act === st)); });
      var hc = $('.rp-chip[data-video="' + v + '"]');
      if (hc) { hc.dataset.state = st; $('.rp-st', hc).textContent = stLabel(st, true); }
    });
    var total = VIDEOS.length;
    $('#rp-status').textContent = okCount === total ? (total === 1 ? 'El vídeo està aprovat' : 'Tots els vídeos estan aprovats') : (okCount + ' de ' + total + ' vídeos aprovats');
    var sum = $('[data-sum]');
    if (sum) sum.textContent = okCount + ' de ' + total + ' aprovats';
    var g = $('.need[data-need="guiones"]');
    if (g) g.classList.toggle('done', okCount === total);
    $$('.need[data-need]').forEach(function (el) {
      var k = el.dataset.need;
      if (k === 'guiones') return;
      var n = S.needs[k];
      var val = n && n.estado;
      $$('.opt', el).forEach(function (b) { b.setAttribute('aria-pressed', String(!!val && b.dataset.val === val)); });
      var w = $('.nd-who', el);
      if (w) w.textContent = val ? (val + ' · ' + (n.autor || 'Algú de l\'equip') + ' · ' + fmtDate(n.updated_at)) : '';
      el.classList.toggle('done', !!val);
    });
  }

  async function load() {
    if (!S.key) return;
    var rows = await rpc('leer', { p_key: S.key });
    var rev = {}, nds = {}, cms = {};
    (rows || []).forEach(function (r) {
      if (r.tipo === 'review') rev[r.clave] = r;
      else if (r.tipo === 'comment') (cms[r.clave] = cms[r.clave] || []).push(r);
      else nds[r.clave] = r;
    });
    S.review = rev; S.needs = nds; S.comments = cms;
    render();
  }

  async function write(tipo, clave, estado, nota, msgEl) {
    if (S.readonly) return false;
    var name = getName();
    if (!name) {
      if (msgEl) msgEl.textContent = 'Escriu el teu nom a dalt, a «Revisió», abans de respondre.';
      var inp = $('#rv-name'); if (inp) inp.focus();
      return false;
    }
    var id = tipo + ':' + clave;
    if (pending[id]) return false;
    pending[id] = true;
    try {
      await rpc('responder', { p_key: S.key, p_tipo: tipo, p_clave: clave, p_estado: estado, p_nota: nota || '', p_autor: name });
      if (msgEl) msgEl.textContent = 'Desat. En Pol ja ho veu.';
      await load();
      return true;
    } catch (e) {
      if (msgEl) msgEl.textContent = (e.status === 400 || e.status === 401 || e.status === 403)
        ? 'No s\'ha desat: aquest enllaç no permet respondre. Demana a en Pol l\'enllaç de revisió.'
        : 'Ara mateix no s\'ha pogut desar. Torna-hi d\'aquí a uns segons.';
      return false;
    } finally {
      pending[id] = false;
    }
  }

  function wire() {
    var nameEl = $('#rv-name');
    if (nameEl) {
      try { nameEl.value = localStorage.getItem('prop-nombre') || ''; } catch (e) {}
      nameEl.addEventListener('change', function () { try { localStorage.setItem('prop-nombre', getName()); } catch (e) {} });
    }
    VIDEOS.forEach(function (v) {
      var box = $('#review-' + v);
      if (!box) return;
      var form = $('#form-' + v);
      var msg = $('.rv-msg', box);
      $('#btn-ok-' + v).addEventListener('click', function () {
        var cur = S.review[v] && S.review[v].estado;
        form.hidden = true;
        write('review', v, cur === 'ok' ? null : 'ok', '', msg);
      });
      $('#btn-ch-' + v).addEventListener('click', function () {
        form.hidden = !form.hidden;
        if (!form.hidden) {
          var ta = $('#note-' + v);
          ta.focus();
        }
      });
      $('#cancel-' + v).addEventListener('click', function () { form.hidden = true; });
      form.addEventListener('submit', async function (ev) {
        ev.preventDefault();
        var ta = $('#note-' + v);
        var txt = (ta.value || '').trim().slice(0, 1000);
        if (!txt) { msg.textContent = 'Escriu què canviaries abans d\'enviar.'; ta.focus(); return; }
        var ok = await write('review', v, 'changes', txt, msg);
        if (ok) { form.hidden = true; ta.value = ''; }
      });
    });
    $$('.need[data-need]').forEach(function (el) {
      var k = el.dataset.need;
      $$('.opt', el).forEach(function (b) {
        b.addEventListener('click', function () {
          var cur = S.needs[k] && S.needs[k].estado;
          write('need', k, cur === b.dataset.val ? null : b.dataset.val, '', $('.nd-who', el));
        });
      });
    });
  }

  async function init() {
    wire();
    setControls(false);
    if (!CFG.apiBase || !CFG.slug) {
      note('Falta configurar la connexió de les respostes (config.js).');
      return;
    }
    S.key = getKey();
    if (!S.key) {
      note('Per aprovar o demanar canvis, obre l\'enllaç de revisió que t\'ha enviat en Pol.');
      return;
    }
    try {
      await load();
      S.readonly = false;
      setControls(true);
      note('Aprova o demana canvis a cada vídeo. Es desa al moment i en Pol ho veu.');
    } catch (e) {
      note(e.status === 400 || e.status === 401 || e.status === 403
        ? 'Aquest enllaç no és vàlid per respondre. Demana a en Pol l\'enllaç de revisió.'
        : 'Ara mateix no es poden carregar les respostes. Prova-ho d\'aquí a un moment.');
      return;
    }
    setInterval(function () {
      if (document.visibilityState === 'visible') load().catch(function () {});
    }, 30000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
