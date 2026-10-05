import type { ComponentType } from "react";

/**
 * Página en su propio archivo de JavaScript, que se puede cargar antes de pintar.
 * - En el navegador, main.tsx carga la de la URL antes de hidratar, así que se pinta
 *   sin esperas ni saltos (el HTML prerenderizado ya está en pantalla).
 * - Al prerenderizar se cargan todas antes de empezar (preloadAll).
 * - Si se pidiera una sin cargar, "suspende" hasta que llegue (Suspense de App).
 */
export function preloadable<P extends object>(loader: () => Promise<{ default: ComponentType<P> }>) {
  let Comp: ComponentType<P> | null = null;
  let promise: Promise<void> | null = null;
  const load = () => (promise ??= loader().then((m) => { Comp = m.default; }));
  function Page(props: P) {
    if (!Comp) throw load();
    const C = Comp;
    return <C {...props} />;
  }
  return Object.assign(Page, { load });
}
