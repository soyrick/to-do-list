/**
 * Middleware de autenticación.
 * 
 * Este middleware protege las rutas privadas:
 * - Si el usuario NO tiene sesión y trata de acceder a /tasks,
 *   lo redirige a /login
 * - Permite acceso libre a /login y /register
 * 
 * Se ejecuta antes de cada request y verifica la sesión
 * usando las cookies de Supabase Auth.
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Obtener sesión actual
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Rutas públicas (sin protección)
  const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  
  // Rutas protegidas (requieren sesión)
  const protectedRoutes = ["/tasks"];

  // Si no hay sesión y trata de acceder a ruta protegida
  if (!session && protectedRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Si hay sesión y trata de acceder a login/register/forgot-password/reset-password
  if (session && publicRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/tasks";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
