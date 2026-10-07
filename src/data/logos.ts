export type LogoItem = {
  name: string;
  file: string;
  /** Ajuste fino del tamaño (1 = el que le toca por su forma; los que son un bloque de color, algo menos). */
  scale?: number;
  /** Medidas reales del archivo (sin márgenes): dan la forma del logo y evitan saltos al cargar. */
  width: number;
  height: number;
};

// Muro de logos: marcas con las que he trabajado. Los archivos están recortados
// (sin márgenes) y sin fondo; el tamaño en pantalla lo calcula LogoMarquee según
// la forma de cada logo, para que todos pesen parecido a la vista.
export const logos: LogoItem[] = [
  { name: "Revolut", file: "/logos/revolut.webp", width: 360, height: 84 },
  { name: "AXA", file: "/logos/axa.webp", width: 116, height: 116, scale: 0.82 },
  { name: "Verisure", file: "/logos/verisure.webp", width: 269, height: 116 },
  { name: "Gillette", file: "/logos/gillette.webp", width: 360, height: 91 },
  { name: "Iberdrola", file: "/logos/iberdrola.webp", width: 100, height: 116 },
  { name: "Yoigo", file: "/logos/yoigo.webp", width: 360, height: 114 },
  { name: "Just Eat", file: "/logos/justeat.webp", width: 117, height: 116 },
  { name: "Daikin", file: "/logos/daikin.webp", width: 360, height: 77 },
  { name: "Rastreator", file: "/logos/rastreator.webp", width: 360, height: 48 },
  { name: "Wallapop", file: "/logos/wallapop.webp", width: 360, height: 94 },
  { name: "Qonto", file: "/logos/qonto.webp", width: 360, height: 109 },
  { name: "Ecoembes", file: "/logos/ecoembes.webp", width: 360, height: 90 },
  { name: "Too Good To Go", file: "/logos/toogoodtogo.webp", width: 149, height: 116 },
  { name: "Moeve", file: "/logos/moeve.webp", width: 360, height: 68 },
  { name: "Ironhack", file: "/logos/ironhack.webp", width: 108, height: 116, scale: 0.9 },
  { name: "MasterD", file: "/logos/masterd.webp", width: 360, height: 40 },
  { name: "Bezoya", file: "/logos/bezoya.webp", width: 193, height: 116 },
  { name: "Yadea", file: "/logos/yadea.webp", width: 360, height: 97 },
  { name: "Scalable Capital", file: "/logos/scalable.webp", width: 360, height: 113 },
  { name: "Rioja", file: "/logos/rioja.webp", width: 360, height: 92 },
  { name: "Pascual", file: "/logos/pascual.webp", width: 245, height: 116, scale: 0.9 },
  { name: "Dogfy Diet", file: "/logos/dogfy.webp", width: 157, height: 116, scale: 0.85 },
  { name: "SkyShowtime", file: "/logos/skyshowtime-2.webp", width: 360, height: 83, scale: 1.15 },
  { name: "Marvel Snap", file: "/logos/marvelsnap.webp", width: 360, height: 77 },
  { name: "Bitnovo", file: "/logos/bitnovo.webp", width: 360, height: 110 },
  { name: "Breathe Right", file: "/logos/breatheright.webp", width: 228, height: 116 },
  { name: "Zscaler", file: "/logos/zscaler.webp", width: 255, height: 116 },
  { name: "Kymco", file: "/logos/kymco.webp", width: 145, height: 116 },
  { name: "IFEMA Madrid", file: "/logos/ifema.webp", width: 169, height: 116 },
  { name: "Curaprox", file: "/logos/curaprox.webp", width: 360, height: 89, scale: 0.9 },
  { name: "Reverso", file: "/logos/reverso.webp", width: 360, height: 87 },
  { name: "sepiia", file: "/logos/sepiia.webp", width: 165, height: 116 },
  { name: "Reactiva Online", file: "/logos/reactiva.webp", width: 137, height: 116 },
  { name: "Natural Elements", file: "/logos/naturalelements.webp", width: 321, height: 116 },
  { name: "Pato", file: "/logos/pato.webp", width: 108, height: 116 },
  { name: "Kit Digital", file: "/logos/kitdigital.webp", width: 360, height: 103 },
  { name: "QuéComparo.es", file: "/logos/quecomparo.webp", width: 306, height: 116, scale: 0.9 },
  { name: "Wala", file: "/logos/wala.webp", width: 116, height: 116, scale: 0.85 },
  { name: "Roamless", file: "/logos/roamless.webp", width: 360, height: 63 },
  { name: "Murwal", file: "/logos/murwal.webp", width: 360, height: 58 },
  { name: "Nordy", file: "/logos/nordy.webp", width: 360, height: 104 },
  { name: "NorthPlanner", file: "/logos/northplanner.webp", width: 360, height: 41 },
  { name: "Equito", file: "/logos/equito.webp", width: 360, height: 84 },
  { name: "Lo Reclamamos", file: "/logos/loreclamamos.webp", width: 360, height: 96 },
  { name: "Reclamamos tu Indemnización", file: "/logos/reclamamostuindemnizacion.webp", width: 360, height: 63, scale: 1.15 },
  { name: "Workerpark", file: "/logos/workerpark.webp", width: 360, height: 57 },
  { name: "Letrame", file: "/logos/letrame.webp", width: 360, height: 116 },
];
