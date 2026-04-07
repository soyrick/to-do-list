/**
 * Cliente de Supabase para el navegador (Client Components).
 * 
 * Este archivo crea una instancia del cliente de Supabase
 * que se usa en componentes del cliente (useClient).
 * 
 * Usa las variables de entorno:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * 
 * El anon key es seguro，因为它 se expose públicamente en el cliente.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
