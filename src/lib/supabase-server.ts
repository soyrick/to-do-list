/**
 * Cliente de Supabase para el servidor (Server Components).
 * 
 * Este archivo crea una instancia del cliente de Supabase
 * que se usa en componentes del servidor y Server Actions.
 * 
 * Maneja automáticamente las cookies para mantener la sesión.
 * 
 * Usa las variables de entorno:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * 
 * El parámetro cookies debe recibir las cookies del request actual
 * para poder validar y mantener la sesión del usuario.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // La función setAll se llama durante Server Components,
            // pero puede fallar si se llama desde un componente de cliente
            // o en una API route que ya envió la respuesta
          }
        },
      },
    }
  );
}
