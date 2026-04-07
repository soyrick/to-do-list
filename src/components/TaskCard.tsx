"use client";

import { useState } from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string, currentCompleted: boolean) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export default function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async () => {
    if (isToggling || isDeleting) return;
    setIsToggling(true);
    try {
      await onToggle(task.id, task.completed);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl p-3 sm:p-4 transition-all duration-300 ${
        task.completed 
          ? "bg-white/40 opacity-70" 
          : "bg-white/70 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-0.5"
      } backdrop-blur-sm border border-white/50`}
    >
      {/* Gradient accent on hover for pending tasks */}
      {!task.completed && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-violet-500/0 to-cyan-500/0 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      )}
      
      <div className="flex items-center gap-2 sm:gap-4 relative z-10">
        {/* Custom checkbox */}
        <button
          onClick={handleToggle}
          disabled={isToggling || isDeleting}
          className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
            task.completed
              ? "bg-gradient-to-r from-green-400 to-emerald-500 border-transparent scale-110"
              : "border-gray-300 hover:border-blue-500 hover:scale-110 bg-white/50"
          } ${isToggling ? 'opacity-50 cursor-wait' : ''}`}
        >
          {isToggling ? (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : task.completed ? (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300 group-hover:bg-blue-400 transition-colors" />
          )}
        </button>

        {/* Task title */}
        <span 
          className={`flex-1 text-sm sm:text-base font-medium transition-all duration-300 truncate ${
            task.completed 
              ? "text-gray-400 line-through decoration-2 decoration-gray-300" 
              : "text-gray-700 group-hover:text-gray-900"
          }`}
        >
          {task.title}
        </span>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`p-1.5 sm:p-2.5 rounded-xl transition-all duration-300 flex-shrink-0 ${
            task.completed
              ? "text-gray-400 hover:text-red-500 hover:bg-red-50"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50 hover:scale-110"
          } ${isDeleting ? 'opacity-50 cursor-wait' : ''}`}
        >
          {isDeleting ? (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Progress indicator for pending tasks */}
      {!task.completed && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ width: '100%' }} />
      )}
    </div>
  );
}