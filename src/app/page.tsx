/**
 * Página principal de la aplicación.
 * 
 * Esta página actúa como redirect:
 * - Si el usuario NO tiene sesión activa → redirige a /login
 * - Si el usuario SÍ tiene sesión activa → redirige a /tasks
 * 
 * La verificación de sesión se hace del lado del servidor
 * usando Supabase Auth en un Server Component.
 */
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Ignorar errores de cookies
          }
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  redirect("/tasks");
}