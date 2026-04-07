"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
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
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;

    // Validaciones del lado del cliente
    if (!email) {
      setError("El correo electrónico es requerido");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("El correo electrónico es inválido");
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (mode === "register") {
      const confirmPassword = formData.get("confirmPassword") as string;
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        setLoading(false);
        return;
      }
    }

    try {
      let result;
      if (mode === "login") {
        result = await login(email, password);
        // Si retorna { success: false }, mostrar error
        if (result && 'success' in result && !result.success) {
          setError(result.error || "El correo o la contraseña son incorrectos");
        }
        // Si no hay error, el login hizo redirect automáticamente
      } else {
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const phone = formData.get("phone") as string;
        
        const result = await register(email, password, firstName, lastName, phone);
        if (!result.success) {
          setError(result.error || "Error al registrar");
        } else {
          setSuccessMessage(result.message || "Registro exitoso");
          setTimeout(() => router.push("/login"), 2000);
        }
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
    <div 
      className="rounded-xl p-5 sm:p-6 shadow-xl"
      style={{ 
        backgroundColor: 'var(--login-card-bg)', 
        borderColor: 'var(--login-card-border)',
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      <h2 className="mb-1 text-xl sm:text-2xl font-bold" style={{ color: 'var(--login-text)' }}>
        {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
      </h2>
      <p className="mb-4 sm:mb-6 text-sm" style={{ color: 'var(--login-text-muted)' }}>
        {mode === "login" 
          ? "Ingresa tu email y contraseña para acceder" 
          : "Completa los datos para registrarte"}
      </p>
      
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

        {mode === "register" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" style={{ color: 'var(--login-text-muted)' }}>Nombre</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Juan"
                  required
                  disabled={loading}
                  style={{ 
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--login-card-border)',
                    color: 'var(--login-text)'
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" style={{ color: 'var(--login-text-muted)' }}>Apellido</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Pérez"
                  required
                  disabled={loading}
                  style={{ 
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--login-card-border)',
                    color: 'var(--login-text)'
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" style={{ color: 'var(--login-text-muted)' }}>Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+54 11 1234 5678"
                required
                disabled={loading}
                style={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--login-card-border)',
                  color: 'var(--login-text)'
                }}
              />
            </div>
          </>
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

        <div className="space-y-2">
          <Label htmlFor="password" style={{ color: 'var(--login-text-muted)' }}>Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
            disabled={loading}
            style={{ 
              backgroundColor: 'var(--background)',
              borderColor: 'var(--login-card-border)',
              color: 'var(--login-text)'
            }}
            className="focus:border-primary focus:ring-primary"
          />
        </div>

        {mode === "register" && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" style={{ color: 'var(--login-text-muted)' }}>Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              disabled={loading}
              style={{ 
                backgroundColor: 'var(--background)',
                borderColor: 'var(--login-card-border)',
                color: 'var(--login-text)'
              }}
              className="focus:border-primary focus:ring-primary"
            />
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full text-white" 
          style={{ backgroundColor: 'var(--primary)' }}
          disabled={loading}
        >
          {loading 
            ? (mode === "login" ? "Iniciando sesión..." : "Registrando...") 
            : (mode === "login" ? "Iniciar Sesión" : "Registrarse")}
        </Button>
      </form>
      
      <p className="mt-5 sm:mt-6 text-center text-sm" style={{ color: 'var(--login-text-muted)' }}>
        {mode === "login" ? (
          <>
            ¿No tienes cuenta?{" "}
            <a href="/register" className="hover:underline" style={{ color: 'var(--primary)' }}>
              Regístrate
            </a>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="hover:underline" style={{ color: 'var(--primary)' }}>
              Inicia sesión
            </a>
          </>
        )}
      </p>

      {mode === "login" && (
        <p className="mt-2 sm:mt-3 text-center text-sm" style={{ color: 'var(--login-text-muted)' }}>
          ¿Olvidaste tu contraseña?{" "}
          <a href="/forgot-password" className="hover:underline" style={{ color: 'var(--primary)' }}>
            Recuperar
          </a>
        </p>
      )}
    </div>
  );
}