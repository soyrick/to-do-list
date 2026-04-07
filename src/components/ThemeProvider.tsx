"use client";

import { useEffect, useState } from "react";

/**
 * Provider que inicializa el tema desde localStorage o preferencia del sistema.
 * Debe envolver toda la aplicación para que el tema esté disponible desde el primer render.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Solo ejecutar en cliente
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    setMounted(true);
  }, []);

  // Evitar flash de contenido incorrecto
  if (!mounted) {
    return (
      <div style={{ visibility: "hidden" }}>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}