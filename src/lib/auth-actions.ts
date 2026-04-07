"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Crea un cliente de Supabase para Server Actions que maneja cookies correctamente.
 */
async function createSupabaseClient() {
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
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Ignorar errores de cookies en Server Actions
          }
        },
      },
    }
  );
}

/**
 * Crea una nueva tarea.
 */
export async function createTask(title: string) {
  if (!title.trim()) return;

  const supabase = await createSupabaseClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  await supabase.from("tasks").insert({
    user_id: session.user.id,
    title: title.trim(),
    completed: false,
  });

  revalidatePath("/tasks");
}

/**
 * Inicia sesión con email y contraseña.
 */
export async function login(email: string, password: string) {
  const supabase = await createSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/tasks");
}

/**
 * Registra un nuevo usuario con email y contraseña.
 */
export async function register(
  email: string, 
  password: string,
  firstName?: string,
  lastName?: string,
  phone?: string
) {
  const supabase = await createSupabaseClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName || "",
        last_name: lastName || "",
        phone: phone || "",
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    message: "Revisá tu email para confirmar tu cuenta" 
  };
}

/**
 * Cierra la sesión del usuario actual.
 */
export async function logout() {
  const supabase = await createSupabaseClient();

  await supabase.auth.signOut();
  
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Solicita recuperación de contraseña.
 * 
 * IMPORTANTE: Por seguridad, Supabase no revela si un email existe o no.
 * Siempre retornamos éxito para evitar enumeração de emails.
 */
export async function requestPasswordReset(email: string) {
  const supabase = await createSupabaseClient();

  // Intentamos el reset - Supabase no revela si el email existe o no por seguridad
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  });

  // Siempre retornamos éxito para no revelar si el email existe
  // El usuario recibirá el email solo si está registrado
  if (error) {
    console.error("Password reset error:", error.message);
  }

  return { 
    success: true, 
    message: "El enlace de recuperación fue enviado a tu correo" 
  };
}

/**
 * Restablece la contraseña del usuario.
 */
export async function resetPassword(newPassword: string) {
  const supabase = await createSupabaseClient();

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { success: false, error: "Sesión inválida. Por favor solicitá un nuevo enlace." };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  
  return { 
    success: true, 
    message: "Contraseña actualizada correctamente" 
  };
}