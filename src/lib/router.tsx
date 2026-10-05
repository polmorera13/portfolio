import { Children, createContext, isValidElement, useContext, useEffect, useMemo, type ReactElement, type ReactNode } from "react";
import { withBase } from "./paths";

// ─────────────────────────────────────────────────────────────────────────────
// Router mínimo (sustituye a react-router, ~25 KB menos de JavaScript).
// La web navega siempre con enlaces normales (recarga la página), así que solo
// hace falta elegir qué pintar según la URL, en el navegador y al prerenderizar.
// Rutas exactas (la barra final da igual) y "*" para el 404.
// ─────────────────────────────────────────────────────────────────────────────
const PathContext = createContext<string>("/");

const norm = (p: string) => (p.endsWith("/") ? p : p + "/");
const strip = (pathname: string, basename: string) => {
  const b = basename.replace(/\/$/, "");
  return (b && pathname.startsWith(b) ? pathname.slice(b.length) : pathname) || "/";
};

export function BrowserRouter({ basename = "/", children }: { basename?: string; children?: ReactNode }) {
  const path = useMemo(() => strip(window.location.pathname, basename), [basename]);
  return <PathContext.Provider value={path}>{children}</PathContext.Provider>;
}

export function StaticRouter({ location, basename = "/", children }: { location: string; basename?: string; children?: ReactNode }) {
  return <PathContext.Provider value={strip(location.split(/[?#]/)[0], basename)}>{children}</PathContext.Provider>;
}

interface RouteProps { path: string; element: ReactNode }
/** Solo describe una ruta; la pinta <Routes>. */
export function Route(_props: RouteProps): null { return null; }

export function Routes({ children }: { children?: ReactNode }) {
  const path = norm(useContext(PathContext));
  let fallback: ReactNode = null;
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue;
    const { path: p, element } = (child as ReactElement<RouteProps>).props;
    if (p === "*") { fallback = element; continue; }
    if (norm(p) === path) return <>{element}</>;
  }
  return <>{fallback}</>;
}

// Siempre la misma función (el panel la usa como dependencia de efectos)
const navigateTo = (to: string, opts?: { replace?: boolean }) => {
  // Las páginas acaban en barra (/login/): así no hay redirección intermedia
  const withSlash = /[?#]|\.[a-z0-9]+$|\/$/i.test(to) ? to : to + "/";
  const url = withBase(withSlash);
  if (opts?.replace) window.location.replace(url);
  else window.location.assign(url);
};

/** Ir a otra ruta de la web (recarga la página). */
export function useNavigate() {
  return navigateTo;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const navigate = useNavigate();
  useEffect(() => navigate(to, { replace }), [to, replace]);
  return null;
}
