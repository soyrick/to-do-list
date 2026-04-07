/**
 * Página de registro de usuario.
 * 
 * Renderiza el formulario de autenticación en modo "register".
 * Diseño adaptativo que soporta modo oscuro y claro.
 */
import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 relative overflow-hidden" style={{ backgroundColor: 'var(--login-bg)' }}>
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30 pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-24 sm:w-32 h-24 sm:h-32 rounded-full blur-2xl sm:blur-3xl bg-gradient-to-r from-blue-500 to-violet-500" />
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-28 sm:w-40 h-28 sm:h-40 rounded-full blur-2xl sm:blur-3xl bg-gradient-to-r from-cyan-500 to-blue-500" />
      </div>
      
      <div className="w-full max-w-sm space-y-6 sm:space-y-8 relative z-10">
        {/* Logo/Título mejorado */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <div className="relative">
              <span className="text-4xl sm:text-5xl">📝</span>
              <span className="absolute -top-1 -right-1 text-sm sm:text-lg animate-pulse">✨</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
            To-Do App
          </h1>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg" style={{ color: 'var(--login-text-muted)' }}>
            Crea tu cuenta y empezá a gestionar tareas
          </p>
        </div>
        
        <AuthForm mode="register" />
      </div>
    </div>
  );
}