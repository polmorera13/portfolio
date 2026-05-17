# Pol Morera — Portfolio web

## Arrancar el proyecto

```bash
npm install
npm run dev
```

## Estructura de carpetas

```
src/
  components/   Header
  sections/     Hero, LogoMarquee, Results, Problem, Services,
                Process, Portfolio, Differentiation, CTASection,
                Testimonials, FAQ, Contact, Footer
  locales/      es.json · en.json · ca.json  (todo el copy)
  data/         portfolio.ts · testimonials.ts · faq.ts · logos.ts · services.ts
  types/        index.ts  (Project, Testimonial, FAQItem, Service, Locale, Translated)
  hooks/        useRotatingHeadline.ts · useLanguage.ts
  lib/          i18n.ts · motion.ts
```

---

## Cómo reemplazar contenido real

### Vídeo del hero (reel)

En `src/sections/Hero.tsx`, busca el comentario `// TODO: Replace this placeholder...`.
Reemplaza el `<div>` placeholder por:

```tsx
<video
  src="/videos/reel-2025.mp4"
  autoPlay
  muted
  loop
  playsInline
  className="absolute inset-0 w-full h-full object-cover rounded-xl"
/>
```

Coloca el archivo en `/public/videos/reel-2025.mp4`.

---

### Logos de marcas

1. Coloca los SVG reales en `/public/logos/`
2. Edita `src/data/logos.ts`

Para usar SVGs externos cambia la estructura a imágenes:

```ts
// En LogoMarquee.tsx, en lugar de <svg>, usar:
<img src={`/logos/${logo.name.toLowerCase().replace(' ', '-')}.svg`} alt={logo.name} />
```

---

### Portfolio: añadir un proyecto

En `src/data/portfolio.ts`, añade un objeto al array `projects`:

```ts
{
  id: "marca-tipo-1",
  brand: "Nombre de la marca",
  category: "ads",          // ads | organic | corporate | apps | food | services
  type: { es: "UGC vertical", en: "Vertical UGC", ca: "UGC vertical" },
  objective: { es: "Descripción", en: "Description", ca: "Descripció" },
  format: { es: "9:16 · 30s", en: "9:16 · 30s", ca: "9:16 · 30s" },
  thumbnail: "/portfolio/marca-tipo-1.jpg",  // coloca la imagen en /public/portfolio/
  videoUrl: "/portfolio/marca-tipo-1.mp4",   // opcional, para hover preview
}
```

Los thumbnails van en `/public/portfolio/`. Ratio recomendado: 4:5 (800×1000px).

---

### Testimonios reales

Edita `src/data/testimonials.ts`. Cada entrada:

```ts
{
  id: "t1",
  quote: { es: "...", en: "...", ca: "..." },
  author: "Nombre Apellido",
  role: { es: "Cargo", en: "Role", ca: "Càrrec" },
  brand: "Nombre empresa",
  avatar: "/avatars/nombre.jpg",  // opcional, coloca en /public/avatars/
}
```

---

### Cambiar el copy

Todo el texto de la web está en `src/locales/`:
- `es.json` — español (por defecto)
- `en.json` — inglés
- `ca.json` — catalán

Edita el archivo del idioma correspondiente. Las claves son las mismas en los tres archivos.

---

### Añadir un idioma adicional

1. Crea `src/locales/fr.json` (copia `es.json` y traduce)
2. En `src/lib/i18n.ts`, importa y registra el nuevo locale:
   ```ts
   import fr from "../locales/fr.json";
   // en resources:
   fr: { translation: fr }
   ```
3. En `src/components/Header.tsx`, añade `{ code: "fr", label: "FR" }` al array `LANGS`
4. En `src/types/index.ts`, añade `"fr"` al tipo `Locale`

---

### Conectar el formulario de contacto

En `src/sections/Contact.tsx`, busca el comentario `// TODO: Connect to backend`.
Reemplaza el `console.log` con la llamada a tu servicio:

**Resend / Formspree:**
```ts
await fetch("https://formspree.io/f/TU_ID", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(form),
});
```

**Supabase Edge Function:**
```ts
const { data } = await supabase.functions.invoke("send-contact", { body: form });
```
