import type { Locale } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Textos de /politica-privacidad y /aviso-legal (ES · EN · CAT).
//
// Datos del aviso legal: mientras NIF o dirección estén vacíos, esa línea no se
// muestra. Rellénalos aquí cuando quieras publicarlos.
// ─────────────────────────────────────────────────────────────────────────────
export const LEGAL_OWNER = {
  name: "Pol Morera de Frutos",
  nif: "",
  address: "",
  email: "hello@polmorera.es",
};

export type LegalSection = { heading?: string; paragraphs: string[] };
export type LegalDoc = { title: string; updated?: string; sections: LegalSection[] };

const EMAIL = LEGAL_OWNER.email;

export const privacyPolicy: Record<Locale, LegalDoc> = {
  es: {
    title: "Política de privacidad",
    updated: "Última actualización: 2 de octubre de 2026",
    sections: [
      {
        heading: "1. Quién trata tus datos",
        paragraphs: [
          "Pol Morera de Frutos, creador de contenido UGC y productor audiovisual, titular de polmorera.es.",
          `Email de contacto: ${EMAIL}`,
        ],
      },
      {
        heading: "2. Qué datos recojo y para qué",
        paragraphs: [
          "Cuando me escribes desde el formulario de contacto, recojo tu nombre y empresa, tu email, la web o el Instagram de tu negocio si me lo das, y el mensaje que me envías. Los uso solo para responderte, prepararte una propuesta o enviarte el documento que me pidas. No los uso para enviarte publicidad.",
          "Si me escribes por WhatsApp, uso tu número y tus mensajes solo para responderte. Ten en cuenta que WhatsApp es un servicio de Meta.",
          "La base legal es tu consentimiento, que me das al enviar el formulario.",
        ],
      },
      {
        heading: "3. Cuánto tiempo los guardo",
        paragraphs: [
          "Los guardo mientras atiendo tu consulta. Si después trabajamos juntos, los conservo el tiempo que marque la ley. Si no volvemos a estar en contacto, los borro como máximo a los 12 meses.",
        ],
      },
      {
        heading: "4. Con quién los comparto",
        paragraphs: [
          "No cedo tus datos a nadie, salvo que la ley me obligue. El proveedor de alojamiento de la web, el servicio que gestiona el formulario y WhatsApp (si me escribes por ahí) pueden acceder a ellos solo para prestar su servicio.",
        ],
      },
      {
        heading: "5. Tus derechos",
        paragraphs: [
          `Puedes pedirme en cualquier momento acceder a tus datos, corregirlos, borrarlos, oponerte a que los use, limitar su uso o llevártelos a otro servicio. También puedes retirar tu consentimiento. Solo tienes que escribirme a ${EMAIL}.`,
          "Si crees que no he atendido bien tu petición, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).",
        ],
      },
      {
        heading: "6. Cookies",
        paragraphs: [
          "Esta web solo usa las cookies técnicas necesarias para funcionar. No uso cookies de análisis ni de publicidad.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    updated: "Last updated: 2 October 2026",
    sections: [
      {
        heading: "1. Who handles your data",
        paragraphs: [
          "Pol Morera de Frutos, UGC content creator and video producer, owner of polmorera.es.",
          `Contact email: ${EMAIL}`,
        ],
      },
      {
        heading: "2. What data I collect and why",
        paragraphs: [
          "When you write to me through the contact form, I collect your name and company, your email, your business website or Instagram if you give it to me, and the message you send me. I only use them to reply to you, prepare a proposal for you or send you the document you ask for. I don't use them to send you advertising.",
          "If you message me on WhatsApp, I only use your number and your messages to reply to you. Please note that WhatsApp is a Meta service.",
          "The legal basis is your consent, which you give me when you send the form.",
        ],
      },
      {
        heading: "3. How long I keep it",
        paragraphs: [
          "I keep it while I deal with your enquiry. If we then work together, I keep it for as long as the law requires. If we don't get back in touch, I delete it after 12 months at the latest.",
        ],
      },
      {
        heading: "4. Who I share it with",
        paragraphs: [
          "I don't share your data with anyone, unless the law requires me to. The website's hosting provider, the service that handles the form and WhatsApp (if you message me there) may access it only to provide their service.",
        ],
      },
      {
        heading: "5. Your rights",
        paragraphs: [
          `You can ask me at any time to access your data, correct it, delete it, object to its use, restrict its use or take it to another service. You can also withdraw your consent. Just write to me at ${EMAIL}.`,
          "If you think I haven't handled your request properly, you can file a complaint with the Spanish Data Protection Agency (www.aepd.es).",
        ],
      },
      {
        heading: "6. Cookies",
        paragraphs: [
          "This website only uses the technical cookies it needs to work. I don't use analytics or advertising cookies.",
        ],
      },
    ],
  },
  ca: {
    title: "Política de privacitat",
    updated: "Última actualització: 2 d'octubre de 2026",
    sections: [
      {
        heading: "1. Qui tracta les teves dades",
        paragraphs: [
          "Pol Morera de Frutos, creador de contingut UGC i productor audiovisual, titular de polmorera.es.",
          `Email de contacte: ${EMAIL}`,
        ],
      },
      {
        heading: "2. Quines dades recullo i per a què",
        paragraphs: [
          "Quan m'escrius des del formulari de contacte, recullo el teu nom i empresa, el teu email, la web o l'Instagram del teu negoci si me'l dones, i el missatge que m'envies. Només els faig servir per respondre't, preparar-te una proposta o enviar-te el document que em demanis. No els faig servir per enviar-te publicitat.",
          "Si m'escrius per WhatsApp, faig servir el teu número i els teus missatges només per respondre't. Tingues en compte que WhatsApp és un servei de Meta.",
          "La base legal és el teu consentiment, que em dones en enviar el formulari.",
        ],
      },
      {
        heading: "3. Quant de temps les guardo",
        paragraphs: [
          "Les guardo mentre atenc la teva consulta. Si després treballem junts, les conservo el temps que marqui la llei. Si no tornem a estar en contacte, les esborro com a màxim als 12 mesos.",
        ],
      },
      {
        heading: "4. Amb qui les comparteixo",
        paragraphs: [
          "No cedeixo les teves dades a ningú, tret que la llei m'hi obligui. El proveïdor d'allotjament de la web, el servei que gestiona el formulari i WhatsApp (si m'escrius per allà) hi poden accedir només per prestar el seu servei.",
        ],
      },
      {
        heading: "5. Els teus drets",
        paragraphs: [
          `Pots demanar-me en qualsevol moment accedir a les teves dades, corregir-les, esborrar-les, oposar-te que les faci servir, limitar-ne l'ús o endur-te-les a un altre servei. També pots retirar el teu consentiment. Només m'has d'escriure a ${EMAIL}.`,
          "Si creus que no he atès bé la teva petició, pots reclamar davant l'Agència Espanyola de Protecció de Dades (www.aepd.es).",
        ],
      },
      {
        heading: "6. Galetes",
        paragraphs: [
          "Aquesta web només fa servir les galetes tècniques necessàries per funcionar. No faig servir galetes d'anàlisi ni de publicitat.",
        ],
      },
    ],
  },
};

const ownerLines = (labels: { owner: string; nif: string; address: string; activity: string }, activity: string) =>
  [
    `${labels.owner}: ${LEGAL_OWNER.name}`,
    LEGAL_OWNER.nif && `${labels.nif}: ${LEGAL_OWNER.nif}`,
    LEGAL_OWNER.address && `${labels.address}: ${LEGAL_OWNER.address}`,
    `Email: ${EMAIL}`,
    `${labels.activity}: ${activity}`,
  ].filter(Boolean) as string[];

export const legalNotice: Record<Locale, LegalDoc> = {
  es: {
    title: "Aviso legal",
    sections: [
      {
        paragraphs: ownerLines(
          { owner: "Titular", nif: "NIF", address: "Dirección", activity: "Actividad" },
          "creación de contenido UGC y producción audiovisual."
        ),
      },
      {
        paragraphs: [
          "Los textos, vídeos e imágenes de esta web son de Pol Morera o de las marcas para las que se han producido, y se muestran con fines de portfolio. No se pueden reproducir sin permiso.",
        ],
      },
    ],
  },
  en: {
    title: "Legal notice",
    sections: [
      {
        paragraphs: ownerLines(
          { owner: "Owner", nif: "Tax ID (NIF)", address: "Address", activity: "Activity" },
          "UGC content creation and video production."
        ),
      },
      {
        paragraphs: [
          "The texts, videos and images on this website belong to Pol Morera or to the brands they were produced for, and are shown for portfolio purposes. They may not be reproduced without permission.",
        ],
      },
    ],
  },
  ca: {
    title: "Avís legal",
    sections: [
      {
        paragraphs: ownerLines(
          { owner: "Titular", nif: "NIF", address: "Adreça", activity: "Activitat" },
          "creació de contingut UGC i producció audiovisual."
        ),
      },
      {
        paragraphs: [
          "Els textos, vídeos i imatges d'aquesta web són d'en Pol Morera o de les marques per a les quals s'han produït, i es mostren amb finalitats de portfolio. No es poden reproduir sense permís.",
        ],
      },
    ],
  },
};
