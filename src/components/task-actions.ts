"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@supabase/ssr";

export async function createTask(formData: FormData) {
  const cookieStore = await import("next/headers").then(m => m.cookies());
  
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

  const title = formData.get("title") as string;
  if (!title.trim()) return;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  await supabase.from("tasks").insert({
    user_id: session.user.id,
    title: title.trim(),
    completed: false,
  });

  revalidatePath("/tasks");
}

export async function toggleTaskCompleted(taskId: string, currentCompleted: boolean) {
  const cookieStore = await import("next/headers").then(m => m.cookies());
  
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

  await supabase
    .from("tasks")
    .update({ completed: !currentCompleted })
    .eq("id", taskId);

  revalidatePath("/tasks");
}

export async function deleteTaskById(taskId: string) {
  const cookieStore = await import("next/headers").then(m => m.cookies());
  
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

  await supabase.from("tasks").delete().eq("id", taskId);
  revalidatePath("/tasks");
}