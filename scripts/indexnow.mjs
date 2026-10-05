// Avisa a los buscadores que usan IndexNow (Bing, Yandex, Seznam…) de las URL de la web.
// Uso, después de publicar:  node scripts/indexnow.mjs            (todas las del sitemap)
//                            node scripts/indexnow.mjs /casos/ /en/ (solo esas)
// La clave está en public/efb016caefa88e8c137ed376b45c8d55.txt (se publica en https://polmorera.es/efb016caefa88e8c137ed376b45c8d55.txt).
const KEY = "efb016caefa88e8c137ed376b45c8d55";
const HOST = "polmorera.es";
let urls = process.argv.slice(2).map((p) => `https://${HOST}${p}`);
if (!urls.length) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} · ${urls.length} URL`);
