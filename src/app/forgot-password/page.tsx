/**
 * Página de recuperación de contraseña.
 * 
 * Flujo:
 * 1. Usuario ingresa su email
 * 2. Sistema verifica si el email existe
 * 3. Si existe, envía un enlace de recuperación
 * 4. Si no existe, muestra mensaje de error
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    try {
      const result = await requestPasswordReset(email);
      
      if (!result.success) {
        setError(result.error || "Error al solicitar recuperación");
      } else {
        setSuccessMessage(result.message || "Revisa tu correo electrónico");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
        setError(err.message || "Ocurrió un error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 relative overflow-hidden" style={{ backgroundColor: 'var(--login-bg)' }}>
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30 pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-24 sm:w-32 h-24 sm:h-32 rounded-full blur-2xl sm:blur-3xl bg-gradient-to-r from-blue-500 to-violet-500" />
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-28 sm:w-40 h-28 sm:h-40 rounded-full blur-2xl sm:blur-3xl bg-gradient-to-r from-cyan-500 to-blue-500" />
      </div>
      
      <div className="w-full max-w-sm space-y-6 sm:space-y-8 relative z-10">
        {/* Logo/Título */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <span className="text-4xl sm:text-5xl">🔐</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
            Recuperar Contraseña
          </h1>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg" style={{ color: 'var(--login-text-muted)' }}>
            Ingresá tu email para recibir un enlace de recuperación
          </p>
        </div>

        <div 
          className="rounded-xl p-5 sm:p-6 shadow-xl"
          style={{ 
            backgroundColor: 'var(--login-card-bg)', 
            borderColor: 'var(--login-card-border)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div 
                className="rounded-md p-3 text-sm border"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                  color: '#ef4444',
                  borderColor: 'rgba(239, 68, 68, 0.3)'
                }}
              >
                {error}
              </div>
            )}
            
            {successMessage && (
              <div 
                className="rounded-md p-3 text-sm border"
                style={{ 
                  backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                  color: '#22c55e',
                  borderColor: 'rgba(34, 197, 94, 0.3)'
                }}
              >
                {successMessage}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: 'var(--login-text-muted)' }}>Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                disabled={loading}
                style={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--login-card-border)',
                  color: 'var(--login-text)'
                }}
                className="focus:border-primary focus:ring-primary"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full text-white" 
              style={{ backgroundColor: 'var(--primary)' }}
              disabled={loading || !!successMessage}
            >
              {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
            </Button>
          </form>
          
          <p className="mt-5 sm:mt-6 text-center text-sm" style={{ color: 'var(--login-text-muted)' }}>
            <a href="/login" className="hover:underline" style={{ color: 'var(--primary)' }}>
              ← Volver al Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}