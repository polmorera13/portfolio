import type { Translated } from "../types";
import type { PageKey } from "../routes";

// Textos de las páginas de caso que no están en el panel. Los resultados
// (cifras, gráfica, cita, aviso) salen del caso del panel (/api/cases), tal cual.
export type CaseSlug = "masterd" | "dogfy" | "reactiva" | "agencia";

/** Una etapa / línea de trabajo de "Qué hicimos" (con su color). */
export interface CaseStage {
  color: string;
  title: Translated;
  /** Sin texto, las etapas se muestran como etiquetas. */
  text?: Translated;
  bullets?: Translated[];
  after?: Translated;
}

/** Caso largo: reto, qué hicimos por etapas, cómo trabajamos y cifras. */
export interface CaseStory {
  challenge: Translated[];
  challengeBullets?: Translated[];
  didIntro?: Translated;
  stages: CaseStage[];
  how: { title: Translated; text: Translated }[];
  figures: { label: Translated; value: Translated }[];
}

export interface CaseDetail {
  slug: CaseSlug;
  page: PageKey;
  brandName: string; // para encontrar el caso del panel
  /** id del caso en el panel: si existe se busca por id (se puede renombrar la marca sin romper el enlace). */
  caseId?: string;
  /** Nombre a mostrar en lugar del de la marca (casos anónimos), por idioma. */
  displayName?: Translated;
  /** Texto breve para la tarjeta de la portada (en lugar de la descripción larga del caso). */
  cardSummary?: Translated;
  /** Vídeos de la tarjeta de la portada, en orden (si no, todos los del caso). La página del caso los enseña todos. */
  cardVideos?: string[];
  /** Gráfica solo para la tarjeta de la portada. */
  cardChart?: { title: Translated; bars: { label: Translated; value: number; display: string }[]; note: Translated };
  sector: Translated;
  need: Translated;
  did: Translated;
  story?: CaseStory;
  metaTitle: Translated;
  metaDescription: Translated;
}

export const CASE_DETAILS: CaseDetail[] = [
  {
    slug: "masterd",
    page: "case-masterd",
    brandName: "MasterD",
    cardSummary: { es: "Objetivo: conversión.", en: "Goal: conversion.", ca: "Objectiu: conversió." },
    sector: {
      es: "Formación (acceso a Mossos d'Esquadra)",
      en: "Training (Mossos d'Esquadra police entrance exam)",
      ca: "Formació (accés a Mossos d'Esquadra)",
    },
    need: {
      es: "Captar leads para una academia que acompaña a las personas que se presentan a las oposiciones de Mossos d'Esquadra.",
      en: "To capture leads for an academy that supports people sitting the Mossos d'Esquadra police entrance exams.",
      ca: "Captar leads per a una acadèmia que acompanya les persones que es presenten a les oposicions de Mossos d'Esquadra.",
    },
    did: {
      es: "Una serie de creatividades UGC para TikTok Ads que tenían que cumplir unas condiciones: muy cortas, muy rápidas y muy directas. En tres meses, la principal sumó 390 conversiones y la versión adaptada a las políticas de TikTok, 29.",
      en: "A series of UGC creatives for TikTok Ads that had to meet a few conditions: very short, very fast and very direct. Over three months, the main one reached 390 conversions and the version adapted to TikTok's policies, 29.",
      ca: "Una sèrie de creativitats UGC per a TikTok Ads que havien de complir unes condicions: molt curtes, molt ràpides i molt directes. En tres mesos, la principal va sumar 390 conversions i la versió adaptada a les polítiques de TikTok, 29.",
    },
    metaTitle: {
      es: "Caso MasterD: 390 conversiones en TikTok Ads · Pol Morera",
      en: "MasterD case study: 390 TikTok Ads conversions · Pol Morera",
      ca: "Cas MasterD: 390 conversions a TikTok Ads · Pol Morera",
    },
    metaDescription: {
      es: "Una creatividad UGC para la campaña de MasterD en TikTok Ads: 390 conversiones a 4,09 € por conversión, según los datos de TikTok Ads.",
      en: "A UGC creative for MasterD's TikTok Ads campaign: 390 conversions at €4.09 per conversion, according to TikTok Ads data.",
      ca: "Una creativitat UGC per a la campanya de MasterD a TikTok Ads: 390 conversions a 4,09 € per conversió, segons les dades de TikTok Ads.",
    },
  },
  {
    slug: "dogfy",
    page: "case-dogfy",
    brandName: "Dogfy Diet",
    cardSummary: { es: "Objetivo: conversión.", en: "Goal: conversion.", ca: "Objectiu: conversió." },
    // Referencia: WordStream y LocaliQ, Facebook Ads Benchmarks 2025 (campañas de captación, todos los sectores: 7,72 %)
    cardChart: {
      title: { es: "Tasa de conversión", en: "Conversion rate", ca: "Taxa de conversió" },
      bars: [
        { label: { es: "Mis vídeos para Dogfy Diet", en: "My videos for Dogfy Diet", ca: "Els meus vídeos per a Dogfy Diet" }, value: 15, display: "15 %" },
        { label: { es: "Media de los anuncios de captación en Meta", en: "Average for Meta lead ads", ca: "Mitjana dels anuncis de captació a Meta" }, value: 7.72, display: "7,72 %" },
      ],
      note: {
        es: "Media: campañas de captación en Facebook, todos los sectores (WordStream y LocaliQ, 2025).",
        en: "Average: Facebook lead campaigns across all industries (WordStream and LocaliQ, 2025).",
        ca: "Mitjana: campanyes de captació a Facebook, tots els sectors (WordStream i LocaliQ, 2025).",
      },
    },
    sector: { es: "Comida para perros", en: "Dog food", ca: "Menjar per a gossos" },
    need: {
      es: "Contenido rápido y dinámico para sus anuncios durante todo el año.",
      en: "Fast, dynamic content for their ads all year round.",
      ca: "Contingut ràpid i dinàmic per als seus anuncis durant tot l'any.",
    },
    did: {
      es: "Muchas piezas a lo largo del año, con una introducción dinámica y el mensaje claro en los primeros segundos.",
      en: "Many pieces throughout the year, with a dynamic opening and a clear message in the first seconds.",
      ca: "Moltes peces al llarg de l'any, amb una introducció dinàmica i el missatge clar en els primers segons.",
    },
    story: {
      challenge: [
        {
          es: "Con Dogfy Diet llevamos dos años trabajando juntos y creamos contenido a lo largo de todo el año.",
          en: "We've been working with Dogfy Diet for two years, creating content all year round.",
          ca: "Amb Dogfy Diet fa dos anys que treballem junts i creem contingut al llarg de tot l'any.",
        },
        {
          es: "Tuvimos que jugar con el producto y vincularlo a todos los momentos del año, con piezas rápidas y dinámicas que lo muestran en uso.",
          en: "We had to play with the product and tie it to every moment of the year, with fast, dynamic pieces that show it in use.",
          ca: "Vam haver de jugar amb el producte i vincular-lo a tots els moments de l'any, amb peces ràpides i dinàmiques que el mostren en ús.",
        },
      ],
      didIntro: {
        es: "Contenidos para todas las etapas comerciales del año: desde Black Friday y Navidad hasta primavera, verano y contenido corporativo.",
        en: "Content for every commercial moment of the year: from Black Friday and Christmas to spring, summer and corporate content.",
        ca: "Continguts per a totes les etapes comercials de l'any: des del Black Friday i Nadal fins a la primavera, l'estiu i contingut corporatiu.",
      },
      stages: [],
      how: [
        {
          title: { es: "Una introducción dinámica", en: "A dynamic opening", ca: "Una introducció dinàmica" },
          text: {
            es: "Los primeros segundos tienen que enganchar: la introducción, lo más dinámica posible.",
            en: "The first seconds have to hook: the opening is as dynamic as possible.",
            ca: "Els primers segons han d'enganxar: la introducció, tan dinàmica com sigui possible.",
          },
        },
        {
          title: { es: "El mensaje, desde el principio", en: "The message, right from the start", ca: "El missatge, des del principi" },
          text: {
            es: "El mensaje tiene que quedar claro en los primeros segundos.",
            en: "The message has to be clear within the first seconds.",
            ca: "El missatge ha de quedar clar en els primers segons.",
          },
        },
        {
          title: { es: "El producto en uso", en: "The product in use", ca: "El producte en ús" },
          text: {
            es: "Mostramos el producto en uso, manteniendo la estética de la marca.",
            en: "We show the product in use while keeping the brand's look and feel.",
            ca: "Mostrem el producte en ús, mantenint l'estètica de la marca.",
          },
        },
      ],
      figures: [
        { label: { es: "Relación", en: "Relationship", ca: "Relació" }, value: { es: "2 años y sigue activa", en: "2 years and still going", ca: "2 anys i continua activa" } },
        { label: { es: "Tasa de conversión de los leads", en: "Lead conversion rate", ca: "Taxa de conversió dels leads" }, value: { es: "15 %", en: "15%", ca: "15 %" } },
        { label: { es: "CTR medio de los anuncios", en: "Average ad CTR", ca: "CTR mitjà dels anuncis" }, value: { es: "0,50 %", en: "0.50%", ca: "0,50 %" } },
        {
          label: { es: "Momentos del año", en: "Moments of the year", ca: "Moments de l'any" },
          value: { es: "Black Friday, Navidad, primavera y verano", en: "Black Friday, Christmas, spring and summer", ca: "Black Friday, Nadal, primavera i estiu" },
        },
      ],
    },
    metaTitle: {
      es: "Caso Dogfy Diet: 15 % de conversión · Pol Morera",
      en: "Dogfy Diet case study: 15% lead conversion · Pol Morera",
      ca: "Cas Dogfy Diet: 15 % de conversió · Pol Morera",
    },
    metaDescription: {
      es: "Dos años creando vídeos para los anuncios de Dogfy Diet en cada momento del año: leads con un 15 % de conversión y un CTR medio del 0,50 %.",
      en: "Two years creating videos for Dogfy Diet's ads for every moment of the year: leads converting at 15% and a 0.50% average CTR.",
      ca: "Dos anys creant vídeos per als anuncis de Dogfy Diet en cada moment de l'any: leads amb un 15 % de conversió i un CTR mitjà del 0,50 %.",
    },
  },
  {
    slug: "reactiva",
    page: "case-reactiva",
    brandName: "Reactiva Online",
    // Portada: dos corporativos arriba y los anuncios verticales debajo
    cardVideos: [
      "reactiva-vsl-terminado-v3-compressed-web.mp4",
      "reactiva-vsl-google-ads-web.mp4",
      "reactiva-remarketing-diagnostico-web.mp4",
      "reactiva-hogar-04-web.mp4",
      "hogar-05-casoreal-f1-inviertepanel-9x16-compressed-web.mp4",
    ],
    caseId: "reactiva-online",
    sector: { es: "Agencia de marketing digital", en: "Digital marketing agency", ca: "Agència de màrqueting digital" },
    need: {
      es: "Vídeo para todo su sistema de captación, con volumen para testear en Meta Ads y Google Ads.",
      en: "Video for their whole acquisition system, with enough volume to test on Meta Ads and Google Ads.",
      ca: "Vídeo per a tot el seu sistema de captació, amb volum per testejar a Meta Ads i Google Ads.",
    },
    did: {
      es: "Vídeo para 6 etapas de su embudo: del anuncio en frío al onboarding del cliente.",
      en: "Video for 6 stages of their funnel: from the cold ad to client onboarding.",
      ca: "Vídeo per a 6 etapes del seu embut: de l'anunci en fred a l'onboarding del client.",
    },
    story: {
      challenge: [
        {
          es: "Reactiva Online es una agencia especializada en publicidad online. Necesitaba vídeo para todo su sistema de captación: atraer a empresarios que no la conocían, convencer a los que ya mostraban interés, preparar la llamada de venta y acompañar al cliente una vez dentro.",
          en: "Reactiva Online is an agency specialised in online advertising. It needed video for its whole acquisition system: attracting business owners who didn't know it, convincing those already showing interest, preparing the sales call and supporting clients once they had signed.",
          ca: "Reactiva Online és una agència especialitzada en publicitat en línia. Necessitava vídeo per a tot el seu sistema de captació: atreure empresaris que no la coneixien, convèncer els que ja mostraven interès, preparar la trucada de venda i acompanyar el client un cop a dins.",
        },
        {
          es: "Todo eso con un requisito: tener volumen suficiente de creatividades para testear en Meta Ads y Google Ads, y poder reaccionar rápido cuando los datos pedían un cambio de enfoque.",
          en: "All of it with one requirement: enough creatives to test on Meta Ads and Google Ads, and the ability to react quickly when the data called for a change of approach.",
          ca: "Tot això amb un requisit: tenir prou volum de creativitats per testejar a Meta Ads i Google Ads, i poder reaccionar ràpid quan les dades demanaven un canvi d'enfocament.",
        },
      ],
      didIntro: {
        es: "Empezamos renovando los vídeos de su web. En 15 meses nos convertimos en su equipo de producción de vídeo para cada fase del embudo:",
        en: "We started by renewing the videos on their website. Over 15 months we became their video production team for every stage of the funnel:",
        ca: "Vam començar renovant els vídeos del seu web. En 15 mesos ens vam convertir en el seu equip de producció de vídeo per a cada fase de l'embut:",
      },
      stages: [
        {
          color: "#3B82F6",
          title: { es: "Anuncios de captación en frío", en: "Cold acquisition ads", ca: "Anuncis de captació en fred" },
          text: {
            es: "Seis tandas de anuncios para Meta y Google, grabadas de forma modular: varios ganchos, duraciones y formatos. De un solo rodaje de 3 anuncios salieron 54 versiones para testear.",
            en: "Six rounds of ads for Meta and Google, filmed modularly: several hooks, lengths and formats. A single shoot of 3 ads produced 54 versions to test.",
            ca: "Sis tandes d'anuncis per a Meta i Google, gravades de forma modular: diversos ganxos, durades i formats. D'un sol rodatge de 3 anuncis en van sortir 54 versions per testejar.",
          },
        },
        {
          color: "#22C55E",
          title: { es: "Vídeo corporativo para la web", en: "Corporate video for the website", ca: "Vídeo corporatiu per al web" },
          text: {
            es: "El vídeo principal de la home y uno para cada servicio. También los vídeos web de uno de sus clientes, en marca blanca.",
            en: "The main homepage video and one for each service. Also the website videos for one of their clients, white-label.",
            ca: "El vídeo principal de la home i un per a cada servei. També els vídeos web d'un dels seus clients, en marca blanca.",
          },
        },
        {
          color: "#EAB308",
          title: { es: "Vídeo corporativo VSL", en: "Corporate VSL video", ca: "Vídeo corporatiu VSL" },
          text: {
            es: "Varias Video Sales Letters: largas, mini VSL de 90 segundos y versiones para Google y para Meta.",
            en: "Several Video Sales Letters: long ones, 90-second mini VSLs and versions for Google and for Meta.",
            ca: "Diverses Video Sales Letters: llargues, mini VSL de 90 segons i versions per a Google i per a Meta.",
          },
        },
        {
          color: "#EF4444",
          title: { es: "Anuncios de remarketing", en: "Remarketing ads", ca: "Anuncis de remàrqueting" },
          text: {
            es: "Grabados en croma para Google Display y Meta, para quien ya conoce la marca y aún no ha dado el paso.",
            en: "Filmed on green screen for Google Display and Meta, for people who already know the brand but haven't taken the step yet.",
            ca: "Gravats en croma per a Google Display i Meta, per a qui ja coneix la marca i encara no ha fet el pas.",
          },
        },
        {
          color: "#A855F7",
          title: { es: "Onboarding", en: "Onboarding", ca: "Onboarding" },
          text: {
            es: "El vídeo de bienvenida de Reactiva360, su producto nuevo: una guía en 8 bloques para los primeros pasos de cada cliente.",
            en: "The welcome video for Reactiva360, their new product: an 8-part guide for each client's first steps.",
            ca: "El vídeo de benvinguda de Reactiva360, el seu producte nou: una guia en 8 blocs per als primers passos de cada client.",
          },
        },
        {
          color: "#14B8A6",
          title: { es: "Contenido orgánico para redes sociales", en: "Organic content for social media", ca: "Contingut orgànic per a xarxes socials" },
          text: {
            es: "Contenido para Instagram y Facebook, desde carruseles e imágenes estáticas hasta contenido orgánico en vídeo, para generar comunidad y confianza en la marca.",
            en: "Content for Instagram and Facebook, from carousels and static images to organic video, to build community and trust in the brand.",
            ca: "Contingut per a Instagram i Facebook, des de carrusels i imatges estàtiques fins a contingut orgànic en vídeo, per generar comunitat i confiança en la marca.",
          },
        },
      ],
      how: [
        {
          title: { es: "Del guion a la entrega final", en: "From script to final delivery", ca: "Del guió al lliurament final" },
          text: {
            es: "Adaptación de guiones, producción, grabación en estudio, croma y exteriores, edición básica o premium, y versionado.",
            en: "Script adaptation, production, filming in the studio, on green screen and outdoors, basic or premium editing, and versioning.",
            ca: "Adaptació de guions, producció, gravació en estudi, croma i exteriors, edició bàsica o prèmium, i versionat.",
          },
        },
        {
          title: { es: "Velocidad cuando hace falta", en: "Speed when it counts", ca: "Velocitat quan cal" },
          text: {
            es: "Cuando los primeros ángulos de Meta Ads no tenían tracción, entregamos un bloque nuevo de 9 creatividades en 5 días.",
            en: "When the first Meta Ads angles weren't getting traction, we delivered a new batch of 9 creatives in 5 days.",
            ca: "Quan els primers angles de Meta Ads no tenien tracció, vam lliurar un bloc nou de 9 creativitats en 5 dies.",
          },
        },
        {
          title: { es: "Material que sigue rindiendo", en: "Footage that keeps paying off", ca: "Material que continua rendint" },
          text: {
            es: "Al grabar de forma modular, el cliente puede seguir sacando combinaciones de hooks y cuerpos sin volver a rodar.",
            en: "Because we film modularly, the client can keep creating new combinations of hooks and bodies without reshooting.",
            ca: "Com que gravem de forma modular, el client pot continuar traient combinacions de hooks i cossos sense tornar a rodar.",
          },
        },
      ],
      figures: [
        { label: { es: "Proyectos", en: "Projects", ca: "Projectes" }, value: { es: "11", en: "11", ca: "11" } },
        { label: { es: "Entregables finales", en: "Final deliverables", ca: "Lliurables finals" }, value: { es: "+190", en: "190+", ca: "+190" } },
        {
          label: { es: "Etapas del embudo cubiertas", en: "Funnel stages covered", ca: "Etapes de l'embut cobertes" },
          value: {
            es: "6 (captación en frío, web, VSL, remarketing, onboarding y orgánico)",
            en: "6 (cold acquisition, website, VSL, remarketing, onboarding and organic)",
            ca: "6 (captació en fred, web, VSL, remàrqueting, onboarding i orgànic)",
          },
        },
        { label: { es: "Formatos", en: "Formats", ca: "Formats" }, value: { es: "9:16 · 4:5 · 1:1 · 16:9", en: "9:16 · 4:5 · 1:1 · 16:9", ca: "9:16 · 4:5 · 1:1 · 16:9" } },
        { label: { es: "Relación", en: "Relationship", ca: "Relació" }, value: { es: "15 meses y sigue activa", en: "15 months and still going", ca: "15 mesos i continua activa" } },
      ],
    },
    metaTitle: {
      es: "Caso Reactiva Online: vídeo para todo el embudo · Pol Morera",
      en: "Reactiva Online case study: full-funnel video · Pol Morera",
      ca: "Cas Reactiva Online: vídeo per a tot l'embut · Pol Morera",
    },
    metaDescription: {
      es: "Vídeo para cada etapa del embudo de Reactiva Online: anuncios, vídeo corporativo, VSL, remarketing, onboarding y redes. Más de 190 entregables en 15 meses.",
      en: "Video for every stage of Reactiva Online's funnel: ads, corporate video, VSLs, remarketing, onboarding and social. 190+ deliverables in 15 months.",
      ca: "Vídeo per a cada etapa de l'embut de Reactiva Online: anuncis, vídeo corporatiu, VSL, remàrqueting, onboarding i xarxes. Més de 190 lliurables en 15 mesos.",
    },
  },
  {
    // Apple Tree: no se nombra a las personas de la agencia ni a las marcas de sus clientes.
    slug: "agencia",
    page: "case-agency",
    brandName: "Apple Tree",
    caseId: "agencia-b-corp",
    sector: { es: "Agencia de comunicación (B Corp)", en: "Communications agency (B Corp)", ca: "Agència de comunicació (B Corp)" },
    need: {
      es: "Un creador de confianza para el contenido mensual de grandes marcas y vídeos para ganar nuevos clientes.",
      en: "A trusted creator for big brands' monthly content, plus videos to win new clients.",
      ca: "Un creador de confiança per al contingut mensual de grans marques i vídeos per guanyar clients nous.",
    },
    did: {
      es: "Más de 220 vídeos en 2 años y 7 meses: corporativos, dinámicos, a cámara y entrevistas en la calle.",
      en: "220+ videos in 2 years and 7 months: corporate, dynamic, to-camera and street interviews.",
      ca: "Més de 220 vídeos en 2 anys i 7 mesos: corporatius, dinàmics, a càmera i entrevistes al carrer.",
    },
    story: {
      challenge: [
        {
          es: "Apple Tree es una agencia de comunicación B Corp y uno de mis clientes más antiguos: llevamos 2 años y 7 meses trabajando juntos. Gestiona la comunicación en redes de grandes marcas del sector medioambiental, energético y de movilidad, y necesitaba un creador capaz de:",
          en: "Apple Tree is a B Corp communications agency and one of my longest-standing clients: we've been working together for 2 years and 7 months. It runs social media communication for big brands in the environmental, energy and mobility sectors, and needed a creator able to:",
          ca: "Apple Tree és una agència de comunicació B Corp i un dels meus clients més antics: fa 2 anys i 7 mesos que treballem junts. Gestiona la comunicació a xarxes de grans marques del sector mediambiental, energètic i de mobilitat, i necessitava un creador capaç de:",
        },
      ],
      challengeBullets: [
        {
          es: "Producir cada mes contenido con cara y voz para varias marcas a la vez, cada una con su tono.",
          en: "Produce on-camera content every month for several brands at once, each with its own tone.",
          ca: "Produir cada mes contingut amb cara i veu per a diverses marques alhora, cadascuna amb el seu to.",
        },
        {
          es: "Adaptarse a sus herramientas, calendarios y plazos, también a los urgentes.",
          en: "Adapt to their tools, calendars and deadlines, including the urgent ones.",
          ca: "Adaptar-se a les seves eines, calendaris i terminis, també als urgents.",
        },
        {
          es: "Darle munición para ganar nuevos clientes: vídeos para incluir en sus presentaciones y propuestas.",
          en: "Give them ammunition to win new clients: videos to include in their pitches and proposals.",
          ca: "Donar-li munició per guanyar clients nous: vídeos per incloure en les seves presentacions i propostes.",
        },
      ],
      didIntro: {
        es: "En este tiempo hemos hecho vídeos de todo tipo: corporativos, dinámicos, hablando a cámara y entrevistas en la calle.",
        en: "Over this time we've made all kinds of videos: corporate, dynamic, talking to camera and street interviews.",
        ca: "En aquest temps hem fet vídeos de tota mena: corporatius, dinàmics, parlant a càmera i entrevistes al carrer.",
      },
      stages: [
        {
          color: "#A855F7",
          title: {
            es: "Vídeos corporativos",
            en: "Corporate videos",
            ca: "Vídeos corporatius",
          },
          text: {
            es: "Cuando la agencia presenta una propuesta a una marca nueva, un vídeo real vale más que cualquier diapositiva. Producimos piezas a medida para que Apple Tree las incluyera en sus presentaciones a marcas de energía, movilidad, alimentación y otros sectores. Muchas se entregaron en menos de 48 horas.",
            en: "When the agency pitches a new brand, a real video is worth more than any slide. We produced bespoke pieces for Apple Tree to include in its pitches to brands in energy, mobility, food and other sectors. Many were delivered in under 48 hours.",
            ca: "Quan l'agència presenta una proposta a una marca nova, un vídeo real val més que qualsevol diapositiva. Vam produir peces a mida perquè Apple Tree les inclogués a les seves presentacions a marques d'energia, mobilitat, alimentació i altres sectors. Moltes es van lliurar en menys de 48 hores.",
          },
        },
        {
          color: "#22C55E",
          title: { es: "Contenido orgánico recurrente para grandes marcas", en: "Recurring organic content for big brands", ca: "Contingut orgànic recurrent per a grans marques" },
          text: {
            es: "Producción mensual para tres cuentas, cada una con su enfoque:",
            en: "Monthly production for three accounts, each with its own focus:",
            ca: "Producció mensual per a tres comptes, cadascun amb el seu enfocament:",
          },
          bullets: [
            {
              es: "Divulgación medioambiental: contenido a cámara sobre reciclaje, sostenibilidad y actualidad, más efemérides y especiales (Navidad, jornadas de rodaje con proyectos de la marca).",
              en: "Environmental outreach: on-camera content about recycling, sustainability and current affairs, plus key dates and specials (Christmas, shoot days with the brand's projects).",
              ca: "Divulgació mediambiental: contingut a càmera sobre reciclatge, sostenibilitat i actualitat, més efemèrides i especials (Nadal, jornades de rodatge amb projectes de la marca).",
            },
            {
              es: "Climatización y eficiencia energética: vídeos que explican de forma sencilla temas técnicos y dan consejos prácticos.",
              en: "Heating, cooling and energy efficiency: videos that explain technical topics simply and give practical tips.",
              ca: "Climatització i eficiència energètica: vídeos que expliquen de manera senzilla temes tècnics i donen consells pràctics.",
            },
            {
              es: "Movilidad eléctrica: contenido lifestyle para TikTok e Instagram que conecta la marca con el día a día y con la ciudad.",
              en: "Electric mobility: lifestyle content for TikTok and Instagram that connects the brand with everyday life and the city.",
              ca: "Mobilitat elèctrica: contingut lifestyle per a TikTok i Instagram que connecta la marca amb el dia a dia i amb la ciutat.",
            },
          ],
          after: {
            es: "El objetivo de este contenido es generar awareness, comunidad y conexión con la audiencia de cada marca.",
            en: "The goal of this content is to build awareness, community and connection with each brand's audience.",
            ca: "L'objectiu d'aquest contingut és generar awareness, comunitat i connexió amb l'audiència de cada marca.",
          },
        },
        {
          color: "#3B82F6",
          title: { es: "Alcance masivo", en: "Massive reach", ca: "Abast massiu" },
          text: {
            es: "Algunas piezas han superado el millón de visualizaciones con un solo vídeo. Varias contaron con apoyo de paid media, que ampliaba el alcance de un contenido que ya conectaba de forma orgánica.",
            en: "Some pieces have passed one million views with a single video. Several were backed by paid media, which extended the reach of content that was already connecting organically.",
            ca: "Algunes peces han superat el milió de visualitzacions amb un sol vídeo. Diverses van comptar amb suport de paid media, que ampliava l'abast d'un contingut que ja connectava de forma orgànica.",
          },
        },
        {
          color: "#EAB308",
          title: { es: "Campañas puntuales", en: "One-off campaigns", ca: "Campanyes puntuals" },
          text: {
            es: "Vídeos UGC para otras marcas de la cartera de la agencia, con contrato y objetivos propios.",
            en: "UGC videos for other brands in the agency's portfolio, each with its own contract and goals.",
            ca: "Vídeos UGC per a altres marques de la cartera de l'agència, amb contracte i objectius propis.",
          },
        },
      ],
      how: [
        {
          title: { es: "Como parte del equipo de la agencia", en: "As part of the agency's team", ca: "Com a part de l'equip de l'agència" },
          text: {
            es: "Recibimos los briefs y hacemos las aprobaciones en su gestor de proyectos (Asana), y seguimos el calendario de contenidos que aprueba cada cliente.",
            en: "We receive briefs and handle approvals in their project management tool (Asana), and follow the content calendar each client approves.",
            ca: "Rebem els briefs i fem les aprovacions al seu gestor de projectes (Asana), i seguim el calendari de continguts que aprova cada client.",
          },
        },
        {
          title: { es: "Ideas propias", en: "Our own ideas", ca: "Idees pròpies" },
          text: {
            es: "No solo ejecutamos. Proponemos conceptos y formatos que la agencia presenta a la marca, y les damos portadas y acabado homogéneo para que el perfil se vea coherente.",
            en: "We don't just execute. We propose concepts and formats that the agency presents to the brand, and give them consistent covers and finishing so the profile looks cohesive.",
            ca: "No només executem. Proposem conceptes i formats que l'agència presenta a la marca, i els donem portades i un acabat homogeni perquè el perfil es vegi coherent.",
          },
        },
        {
          title: { es: "Plazos de agencia", en: "Agency deadlines", ca: "Terminis d'agència" },
          text: {
            es: "Nuestro primer vídeo para la cuenta se pidió y se entregó el mismo día para publicarse a la mañana siguiente.",
            en: "Our first video for the account was requested and delivered on the same day, to be published the next morning.",
            ca: "El nostre primer vídeo per al compte es va demanar i lliurar el mateix dia per publicar-se l'endemà al matí.",
          },
        },
      ],
      figures: [
        { label: { es: "Vídeos producidos", en: "Videos produced", ca: "Vídeos produïts" }, value: { es: "+220", en: "220+", ca: "+220" } },
        { label: { es: "Marcas en producción mensual", en: "Brands in monthly production", ca: "Marques en producció mensual" }, value: { es: "3", en: "3", ca: "3" } },
        { label: { es: "Marcas en propuestas y campañas puntuales", en: "Brands in pitches and one-off campaigns", ca: "Marques en propostes i campanyes puntuals" }, value: { es: "+10", en: "10+", ca: "+10" } },
        { label: { es: "Alcance", en: "Reach", ca: "Abast" }, value: { es: "Varias piezas con más de 1 millón de visualizaciones", en: "Several pieces with over 1 million views", ca: "Diverses peces amb més d'1 milió de visualitzacions" } },
        {
          label: { es: "Tipos de vídeo", en: "Types of video", ca: "Tipus de vídeo" },
          value: { es: "Corporativos, dinámicos, a cámara y entrevistas en la calle", en: "Corporate, dynamic, to-camera and street interviews", ca: "Corporatius, dinàmics, a càmera i entrevistes al carrer" },
        },
        { label: { es: "Relación", en: "Relationship", ca: "Relació" }, value: { es: "2 años y 7 meses (desde marzo de 2024) y sigue activa", en: "2 years and 7 months (since March 2024) and still going", ca: "2 anys i 7 mesos (des de març de 2024) i continua activa" } },
      ],
    },
    metaTitle: {
      es: "Caso Apple Tree: vídeo para grandes marcas · Pol Morera",
      en: "Apple Tree case study: video for big brands · Pol Morera",
      ca: "Cas Apple Tree: vídeo per a grans marques · Pol Morera",
    },
    metaDescription: {
      es: "Más de 220 vídeos en 31 meses para las grandes marcas de Apple Tree, agencia B Corp: corporativos, dinámicos, a cámara y entrevistas en la calle.",
      en: "220+ videos in 31 months for the big brands of Apple Tree, a B Corp agency: corporate, dynamic, to-camera and street interviews.",
      ca: "Més de 220 vídeos en 31 mesos per a les grans marques d'Apple Tree, agència B Corp: corporatius, dinàmics, a càmera i entrevistes al carrer.",
    },
  },
];

export const caseDetailBySlug = (slug: CaseSlug) => CASE_DETAILS.find((c) => c.slug === slug)!;
export const caseDetailByBrand = (brand: string) => CASE_DETAILS.find((c) => c.brandName.toLowerCase() === brand.trim().toLowerCase());

/** Ficha de un caso del panel: por id si la tiene, si no por el nombre de la marca. */
export const caseDetailFor = (c: { id: string; brandName: string }) =>
  CASE_DETAILS.find((d) => d.caseId === c.id) ?? caseDetailByBrand(c.brandName);

/** Nombre a mostrar de un caso (el anónimo, si lo tiene). */
export const caseName = (c: { id: string; brandName: string }, lang: string) => {
  const d = caseDetailFor(c);
  return d?.displayName ? d.displayName[lang as keyof Translated] ?? d.displayName.es : c.brandName;
};
