import type { TFunction } from "i18next";
import type { Locale, Translated } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Sector de cada marca, para la etiqueta "tipo · sector" de las tarjetas de
// vídeo (portfolio y portada). La clave es el nombre de la marca tal como está
// en el gestor de vídeos, en minúsculas. Si una marca no está aquí, la tarjeta
// muestra solo el tipo ("Anuncio", "Redes"…).
//
// Pendientes de sector: El Método Rico, MiniBatt, Reactiva Online, Murwal,
// Creator Studio.
// ─────────────────────────────────────────────────────────────────────────────
export const SECTORS: Record<string, Translated> = {
  "verisure": { es: "Alarmas", en: "Home security", ca: "Alarmes" },
  "yoigo": { es: "Telefonía", en: "Telecoms", ca: "Telefonia" },
  "rastreator": { es: "Comparador de seguros", en: "Insurance comparison", ca: "Comparador d'assegurances" },
  "dogfy diet": { es: "Comida para perros", en: "Dog food", ca: "Menjar per a gossos" },
  "petroprix": { es: "Gasolineras", en: "Petrol stations", ca: "Benzineres" },
  "estool": { es: "Software para gestorías", en: "Software for accounting firms", ca: "Programari per a gestories" },
  "axa": { es: "Seguros", en: "Insurance", ca: "Assegurances" },
  "bezoya": { es: "Agua mineral", en: "Mineral water", ca: "Aigua mineral" },
  "ecoembes": { es: "Reciclaje", en: "Recycling", ca: "Reciclatge" },
  "yadea": { es: "Motos eléctricas", en: "Electric scooters", ca: "Motos elèctriques" },
  "sepiia": { es: "Ropa", en: "Clothing", ca: "Roba" },
  "rcx software": { es: "Software", en: "Software", ca: "Programari" },
  "wala": { es: "Tiendas de deporte", en: "Sports shops", ca: "Botigues d'esport" },
  "rioja": { es: "Vino", en: "Wine", ca: "Vi" },
  "flashled": { es: "Seguridad vial", en: "Road safety", ca: "Seguretat viària" },
};

const TYPE_KEY: Record<string, string> = {
  ads: "work.type_ads",
  organic: "work.type_organic",
  corporate: "work.type_corporate",
  street: "work.type_street",
};

/** "Anuncio · Alarmas", o solo "Anuncio" si la marca no tiene sector. */
export function videoLabel(category: string, brand: string | null | undefined, lang: string, t: TFunction): string | null {
  const typeKey = TYPE_KEY[category];
  const type = typeKey ? t(typeKey) : null;
  const sector = brand ? SECTORS[brand.trim().toLowerCase()] : undefined;
  const sectorText = sector ? sector[(lang as Locale) in sector ? (lang as Locale) : "es"] : null;
  if (type && sectorText) return `${type} · ${sectorText}`;
  return type ?? sectorText;
}
