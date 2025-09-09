/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores del sistema según DEVELOPMENT-RULES
        priority: {
          baja: '#4CAF50',
          media: '#FF9800',
          alta: '#FF5722',
          critica: '#F44336'
        },
        status: {
          nuevo: '#6B7280',
          asignado: '#3B82F6',
          proceso: '#F59E0B',
          pendiente: '#8B5CF6',
          resuelto: '#10B981',
          cerrado: '#4B5563',
          reabierto: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
