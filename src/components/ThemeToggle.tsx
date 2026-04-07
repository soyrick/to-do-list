"use client";

import { useState, useEffect } from "react";

/**
 * Botón para cambiar entre modo oscuro y modo claro.
 * Lee el tema actual del atributo data-theme del documento.
 * Persiste la preferencia en localStorage.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Leer tema actual del documento
    const currentTheme = document.documentElement.getAttribute("data-theme") as "light" | "dark";
    setTheme(currentTheme || "dark");
    setMounted(true);
  }, []);

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  }

  if (!mounted) {
    return null; // No renderizar hasta que Monte para evitar flash
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 rounded-full p-2 sm:p-3 shadow-lg transition-all hover:scale-110 active:scale-95"
      style={{ 
        backgroundColor: isDark ? '#334155' : '#e2e8f0',
        color: isDark ? '#f1f5f9' : '#0f172a'
      }}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? (
        // Icono sol (modo claro)
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2"/>
          <path d="M12 20v2"/>
          <path d="m4.93 4.93 1.41 1.41"/>
          <path d="m17.66 17.66 1.41 1.41"/>
          <path d="M2 12h2"/>
          <path d="M20 12h2"/>
          <path d="m6.34 17.66-1.41 1.41"/>
          <path d="m19.07 4.93-1.41 1.41"/>
        </svg>
      ) : (
        // Icono luna (modo oscuro)
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      )}
    </button>
  );
}