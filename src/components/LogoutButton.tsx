/**
 * Componente LogoutButton - Botón para cerrar sesión.
 * 
 * Este componente:
 * - Muestra un botón para cerrar sesión
 * - Llama a la Server Action logout al hacer click
 * - Redirige a /login después de cerrar sesión
 * 
 * Usar este componente en cualquier página donde quieras
 * permitir al usuario cerrar su sesión.
 */
"use client";

import { logout } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  async function handleLogout() {
    await logout();
  }

  return (
    <Button 
      variant="destructive" 
      onClick={handleLogout}
    >
      Cerrar Sesión
    </Button>
  );
}