export type LogoItem = {
  name: string;
  file: string;
  scale?: number;
  /** Medidas reales del archivo (evitan saltos al cargar). */
  width?: number;
  height?: number;
};

export const logos: LogoItem[] = [
  { name: "Daikin",           file: "/logos/logo-def-5.webp", width: 238, height: 192 },
  { name: "Wallapop",         file: "/logos/wallapoplogo.webp", width: 495, height: 192 },
  { name: "Qonto",            file: "/logos/logo-web-1.webp", width: 238, height: 192 },
  { name: "Scalable Capital", file: "/logos/logo-web-12.webp", width: 238, height: 192 },
  { name: "Bezoya",           file: "/logos/logobezoya.webp", width: 238, height: 192 },
  { name: "Securitas Direct", file: "/logos/logo-web-4.webp", width: 238, height: 192 },
  { name: "Yoigo",            file: "/logos/logo-web-3.webp", width: 238, height: 192 },
  { name: "Just Eat",         file: "/logos/logojusteat.webp", width: 238, height: 192 },
  { name: "Revolut",          file: "/logos/logo-web-11.webp", width: 238, height: 192 },
  { name: "Zscaler",          file: "/logos/logo-def-4.webp", width: 238, height: 192 },
  { name: "Ecoembes",         file: "/logos/ecoembes_384x136.png", scale: 0.78, width: 768, height: 272 },
  { name: "Dogfy Diet",       file: "/logos/logo-web-13.webp", width: 238, height: 192 },
  { name: "Natural Elements", file: "/logos/logo-def-3.webp", width: 238, height: 192 },
  { name: "Pato",             file: "/logos/logo.webp", width: 180, height: 192 },
  { name: "Kit Digital",      file: "/logos/logo-def-1.webp", width: 238, height: 192 },
  { name: "SkyShowtime",      file: "/logos/logoskyshowtime.svg", width: 2000, height: 467 },
  { name: "Reactiva Online",  file: "/logos/logo-def-2.webp", width: 238, height: 192 },
  { name: "Gillette",         file: "/logos/logo-def-10.webp", width: 238, height: 192 },
  { name: "Iberdrola",        file: "/logos/logo-def-6.webp", width: 238, height: 192 },
  { name: "Moeve",            file: "/logos/logo-def-7.webp", width: 238, height: 192 },
  { name: "QuéComparo.es",    file: "/logos/logo-def-8.webp", width: 238, height: 192 },
  { name: "IFEMA Madrid",     file: "/logos/logo-def-9.webp", width: 238, height: 192 },
  { name: "Curaprox",         file: "/logos/logo-def-11.webp", width: 238, height: 192 },
  { name: "Bitnovo",          file: "/logos/logo-def-12.webp", width: 238, height: 192 },
  { name: "sepiia",           file: "/logos/logo-def-13.webp", width: 238, height: 192 },
  { name: "Marvel Snap",      file: "/logos/logo-def-15.webp", width: 238, height: 192 },
  { name: "Kymco",            file: "/logos/logo-def-18.webp", width: 238, height: 192 },
  { name: "Reverso",          file: "/logos/logo-def-19.webp", width: 238, height: 192 },
  { name: "Wala",             file: "/logos/logo-def-16.webp", width: 238, height: 192 },
  { name: "Pascual",          file: "/logos/logo-1.webp", width: 416, height: 192 },
];
