# 📝 To-Do App

Una aplicación de gestión de tareas minimalista y elegante, construida con las tecnologías más modernas del ecosistema frontend.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwind-css)

---

## ✨ Características

- 🔐 **Autenticación segura** — Inicio de sesión y registro con Supabase Auth
- 📱 **Diseño responsivo** — Funciona perfectamente en cualquier dispositivo (celular, tablet, desktop)
- 🌙 **Modo oscuro/claro** — Theme adaptativo que respeta la preferencia del sistema
- ⚡ **Server Actions** — Acciones del servidor optimizadas para mejor rendimiento
- 🎨 **UI moderna** — Interfaz limpia con Tailwind CSS con gradientes y animaciones
- ✅ **Validaciones claras** — Mensajes de error fáciles de entender
- ⏳ **Estados de carga** — Spinners y feedback visual durante las operaciones

---

## 🛠️ Tecnologías

| Tecnología | Propósito |
|------------|-----------|
| **Next.js 16** | Framework React con App Router |
| **React 19** | Biblioteca de interfaces de usuario |
| **Supabase** | Backend as a Service (Auth + Base de datos) |
| **Tailwind CSS 4** | Framework de estilos utility-first |
| **TypeScript** | Tipado estático para mayor seguridad |

---

## 🚀 Cómo empezar

### Requisitos previos

- Node.js 18 o superior
- npm, yarn, pnpm o bun
- Una cuenta de Supabase (gratuita)

### Instalación

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd todo-app

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env.local con:
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📁 Estructura del Proyecto

```
src/
├── app/                      # App Router de Next.js
│   ├── login/               # Página de inicio de sesión
│   ├── register/            # Página de registro
│   ├── tasks/               # Página de tareas (protegida)
│   ├── forgot-password/    # Recuperar contraseña
│   ├── reset-password/      # Establecer nueva contraseña
│   ├── layout.tsx          # Layout raíz
│   └── page.tsx            # Página principal (redirect)
├── components/              # Componentes React
│   ├── ui/                 # Componentes base
│   ├── AuthForm.tsx        # Formulario de autenticación
│   ├── TaskForm.tsx        # Formulario de tareas
│   ├── TaskCard.tsx        # Tarjeta de tarea individual
│   ├── ThemeProvider.tsx   # Proveedor de temas
│   └── ThemeToggle.tsx     # Botón de cambio de tema
└── lib/                     # Utilidades y configuración
    ├── supabase.ts         # Cliente de Supabase (navegador)
    ├── supabase-server.ts  # Cliente de Supabase (servidor)
    ├── auth-actions.ts     # Server Actions de autenticación
    └── utils.ts            # Funciones utilitarias
```

---

## 🎯 Cómo usar la app

1. **Registrarse** — Crear una cuenta con email y contraseña
2. **Iniciar sesión** — Acceder a la aplicación
3. **Agregar tareas** — Escribir el título y presionar "Agregar"
4. **Completar tareas** — Tocar el checkbox
5. **Eliminar tareas** — Tocar el botón de eliminar
6. **Cambiar tema** — Tocar el ícono de sol/luna
7. **Cerrar sesión** — Tocar el botón "Salir"

---

##Licencia

MIT License - Uso libre, podés modificar y distribuir este proyecto como quieras.

---

## 🤝 Contributing

¡Las contribuciones son bienvenidas! Si Encontrás un bug o querés agregar una función, no dudes en abrir un issue o un pull request.

---

## 📞 Contacto

Si tenés alguna duda o sugerencia, podés escribirme o abrir un issue en el repositorio.

¡Gracias por usar mi app! 🎉