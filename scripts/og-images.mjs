// Imágenes para compartir (1200×630, JPG ≤ 200 KB) de cada página y cada idioma.
// satori (diseño → SVG, con la fuente Poppins) + resvg en WebAssembly (SVG → píxeles)
// + jpeg-js (píxeles → JPG). Todo en JavaScript/WebAssembly: no necesita nada
// instalado en el servidor donde se construye la web.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import satori from "satori";
import { Resvg, initWasm } from "@resvg/resvg-wasm";
import jpeg from "jpeg-js";

const require = createRequire(import.meta.url);
const MEDIA = "https://media.polmorera.es";
const COLORS = { navy: "#0D1B2A", blue: "#4A90D9", steel: "#8AAFCC", white: "#F4F6F9" };

let ready = null;
async function init() {
  if (ready) return ready;
  ready = (async () => {
    await initWasm(fs.readFileSync(require.resolve("@resvg/resvg-wasm/index_bg.wasm")));
    const dir = path.dirname(require.resolve("@fontsource/poppins/package.json")) + "/files/";
    const fonts = [];
    for (const weight of [500, 600, 700, 800]) {
      for (const sub of ["latin", "latin-ext"]) {
        fonts.push({ name: "Poppins", data: fs.readFileSync(`${dir}poppins-${sub}-${weight}-normal.woff`), weight, style: "normal" });
      }
    }
    return { fonts };
  })();
  return ready;
}

const imageCache = new Map();
async function imageDataUri(src, distDir) {
  const key = src.kind + ":" + src.path;
  if (imageCache.has(key)) return imageCache.get(key);
  let buf, type = "image/jpeg";
  try {
    if (src.kind === "public") {
      buf = fs.readFileSync(path.join(distDir, src.path));
    } else {
      const res = await fetch(`${MEDIA}/${src.path}`, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(String(res.status));
      buf = Buffer.from(await res.arrayBuffer());
      type = res.headers.get("content-type") || type;
    }
  } catch (e) {
    console.warn(`  ! imagen ${key}: ${e.message} (se usa la foto de Pol)`);
    buf = fs.readFileSync(path.join(distDir, "pol-morera.jpg"));
  }
  const uri = `data:${type};base64,${buf.toString("base64")}`;
  imageCache.set(key, uri);
  return uri;
}

const h = (type, style, children) => ({ type, props: { style, children } });

function layout({ eyebrow, title, figure }, image) {
  return h("div", { width: 1200, height: 630, display: "flex", background: COLORS.navy, fontFamily: "Poppins" }, [
    h("div", { width: 732, height: 630, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 56px 56px 64px" }, [
      // Antetítulo en una sola línea: si es largo, letra algo más pequeña
      h("div", { display: "flex", fontSize: eyebrow.length > 36 ? 17 : 21, fontWeight: 600, color: COLORS.steel, letterSpacing: eyebrow.length > 36 ? 2 : 2.5, textTransform: "uppercase" }, eyebrow),
      h("div", { display: "flex", flexDirection: "column", gap: 14 }, [
        ...(figure ? [h("div", { display: "flex", fontSize: figure.length > 22 ? 58 : 72, fontWeight: 800, color: COLORS.blue, lineHeight: 1.05, letterSpacing: -1 }, figure)] : []),
        h("div", { display: "flex", fontSize: figure ? 44 : title.length > 30 ? 56 : 64, fontWeight: 700, color: COLORS.white, lineHeight: 1.1, letterSpacing: -0.5 }, title),
      ]),
      h("div", { display: "flex", alignItems: "center", gap: 14 }, [
        h("div", { display: "flex", width: 40, height: 6, borderRadius: 3, background: COLORS.blue }, []),
        h("div", { display: "flex", fontSize: 26, fontWeight: 600, color: COLORS.white }, "polmorera.es"),
      ]),
    ]),
    h("div", { display: "flex", width: 468, height: 630, position: "relative" }, [
      { type: "img", props: { src: image, width: 468, height: 630, style: { width: 468, height: 630, objectFit: "cover" } } },
      h("div", { position: "absolute", left: 0, top: 0, width: 120, height: 630, display: "flex", backgroundImage: `linear-gradient(to right, ${COLORS.navy}, rgba(13,27,42,0))` }, []),
    ]),
  ]);
}

/** Genera una imagen y devuelve su tamaño en bytes. */
export async function renderOgImage({ text, source, outFile, distDir }) {
  const { fonts } = await init();
  const image = await imageDataUri(source, distDir);
  const svg = await satori(layout(text, image), { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render();
  let quality = 82, out;
  do {
    out = jpeg.encode({ data: png.pixels, width: png.width, height: png.height }, quality).data;
    quality -= 8;
  } while (out.length > 200 * 1024 && quality > 40);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, out);
  return out.length;
}
