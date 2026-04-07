/**
 * Página principal de tareas (protegida).
 * 
 * Esta página solo es accesible si el usuario tiene sesión activa.
 * Muestra:
 * - Lista de tareas del usuario actual
 * - Formulario para agregar nuevas tareas
 * - Botón para cerrar sesión
 * - Separación visual entre tareas pendientes y completadas
 * 
 * Diseño moderno con gradientes y estilo juvenil.
 */
import { createServerClient } from "@supabase/ssr";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { toggleTaskCompleted, deleteTaskById } from "@/components/task-actions";
import { redirect } from "next/navigation";

export default async function TasksPage() {
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

  // Verificar sesión
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--login-bg)' }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full blur-3xl bg-gradient-to-r from-blue-500 to-violet-500" />
          <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full blur-3xl bg-gradient-to-r from-cyan-500 to-blue-500" />
        </div>
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center mb-4 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm">
            <span className="text-4xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sesión requerida</h2>
          <p className="text-gray-600">Debes iniciar sesión para ver tus tareas.</p>
        </div>
      </div>
    );
  }

  // Obtener tareas del usuario actual
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  // Separar tareas pendientes y completadas
  const pendingTasks = tasks?.filter(task => !task.completed) || [];
  const completedTasks = tasks?.filter(task => task.completed) || [];

  // Cerrar sesión
  async function signOut() {
    "use server";
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
    await supabase.auth.signOut();
    revalidatePath("/tasks");
    redirect("/login");
  }

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--login-bg)' }}>
      {/* Fondo decorativo animado */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl bg-gradient-to-r from-blue-500/30 to-violet-500/30 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl bg-gradient-to-r from-cyan-500/30 to-blue-500/30 animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full blur-3xl bg-gradient-to-r from-violet-500/20 to-purple-500/20" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="max-w-2xl mx-auto relative z-10 px-4 sm:px-0">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-xl sm:text-2xl">✨</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent">
                Mis Tareas
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Organiza tu día</p>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full sm:w-auto group relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium text-sm shadow-lg shadow-red-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Salir</span>
                <span className="sm:hidden">Salir</span>
              </span>
            </button>
          </form>
        </div>

        {/* Stats badges */}
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">{pendingTasks.length} pendientes</span>
          </div>
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">{completedTasks.length} completadas</span>
          </div>
        </div>

        {/* Formulario para agregar tareas */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-0.5 sm:p-1 shadow-xl shadow-black/5 border border-white/50">
          <TaskForm />
        </div>

        {/* Mensaje si no hay tareas */}
        {tasks?.length === 0 && (
          <div className="mt-10 sm:mt-12 text-center py-8 sm:py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 mb-3 sm:mb-4">
              <span className="text-3xl sm:text-5xl">🎯</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">¡Empieza a organizar tu día!</h3>
            <p className="text-sm sm:text-base text-gray-500">Agrega tu primera tarea arriba</p>
          </div>
        )}

        {/* Sección de tareas pendientes */}
        {pendingTasks.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gray-700 flex items-center gap-2 sm:gap-3">
              <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-100 text-blue-600 text-sm font-bold">
                {pendingTasks.length}
              </span>
              <span className="bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent">Por hacer</span>
              <span className="ml-auto text-xs text-gray-400 font-normal hidden sm:block">Toca para completar</span>
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {pendingTasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TaskCard 
                    task={task} 
                    onToggle={toggleTaskCompleted}
                    onDelete={deleteTaskById}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sección de tareas completadas */}
        {completedTasks.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gray-700 flex items-center gap-2 sm:gap-3">
              <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-green-100 text-green-600 text-sm font-bold">
                {completedTasks.length}
              </span>
              <span className="bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent">Hechas</span>
              <span className="ml-auto text-xs text-gray-400 font-normal hidden sm:block">¡Buen trabajo!</span>
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {completedTasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TaskCard 
                    task={task} 
                    onToggle={toggleTaskCompleted}
                    onDelete={deleteTaskById}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}