"use client";

import { useState, useRef } from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

interface TaskFormProps {
  onSubmit?: () => void;
}

/**
 * Componente TaskForm - Formulario para agregar nuevas tareas.
 * Diseño moderno con gradientes y estilo juvenil.
 */
export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const { createTask } = await import("@/components/task-actions");
      await createTask(formData);
      formRef.current?.reset();
      onSubmit?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 p-3 sm:p-4"
    >
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <span className="text-lg sm:text-xl">📝</span>
        </div>
        <input
          type="text"
          name="title"
          placeholder="¿Qué necesitas hacer?"
          disabled={isSubmitting}
          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 text-gray-700 placeholder-gray-400 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-base"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isSubmitting ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <>
              <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span className="sm:hidden">+</span>
              <span className="hidden sm:inline">Agregar</span>
            </>
          )}
        </span>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>
    </form>
  );
}