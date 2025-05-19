/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores base adaptados del diseño original
        background: {
          DEFAULT: '#FFFFFF',  // --bg-primary (light)
          dark: '#1E1E2E',     // --bg-primary (dark)
        },
        text: {
          DEFAULT: '#333333',     // --text-primary (light)
          secondary: '#666666',   // --text-secondary (light)
          dark: '#E2E8F0',        // --text-primary (dark)
          'dark-secondary': '#A0AEC0', // --text-secondary (dark)
          sidebar: '#FFFFFF',     // --text-sidebar
        },
        sidebar: {
          DEFAULT: '#4054E8',     // --bg-sidebar (light)
          active: '#5A6BEA',      // --bg-sidebar-active (light)
          dark: '#3245D6',        // --bg-sidebar (dark)
          'dark-active': '#4A57D6', // --bg-sidebar-active (dark)
        },
        border: {
          DEFAULT: '#eaeaea',
          sidebar: 'rgba(255, 255, 255, 0.1)', // --border-color
          dark: '#2D3748',
        },
        hover: {
          sidebar: 'rgba(255, 255, 255, 0.1)', // --hover-color
        },
        notification: {
          badge: '#e74c3c', // Color del badge de notificación
        },
        // Mantenemos los colores corporativos originales para compatibilidad
        primary: {
          DEFAULT: '#1D3B7A',      // Azul corporativo
          light: '#4169E1',        // Azul más claro
          dark: '#13264D',         // Azul profundo
        },
        success: {
          DEFAULT: '#28A745',
          light: '#A6EBC9',
          dark: '#218838',
        },
        warning: {
          DEFAULT: '#FFA500',
          light: '#FFE8B3',
          dark: '#CC8400',
        },
        danger: {
          DEFAULT: '#DC3545',
          light: '#F8D7DA',
          dark: '#C92A2A',
        },
        info: {
          DEFAULT: '#0070F3',
          light: '#EAF0FF',
          dark: '#005BB5',
        },
        secondary: {
          DEFAULT: '#E9E9E9',
          light: '#F0F0F0',
          dark: '#333333',
        },
      },
      spacing: {
        '4.5': '1.125rem',  // Espaciado personalizado
        '18': '4.5rem',     // Mantenemos los originales
        '72': '18rem',
        '80': '20rem',
        '250': '250px',     // Ancho del sidebar expandido
        '70': '70px',       // Ancho del sidebar colapsado
      },
      width: {
        'sidebar': '250px',      // Ancho del sidebar expandido
        'sidebar-collapsed': '70px', // Ancho del sidebar colapsado
      },
      height: {
        'header': '70px',        // Altura del header
        'header-breadcrumbs': '40px',  // Altura de breadcrumbs
      },
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
        'height': 'height',
        'colors': 'background-color, border-color, color, fill, stroke',
        'opacity': 'opacity',
        'transform': 'transform',
      },
      transitionDuration: {
        '300': '300ms',  // --transition-speed
      },
      boxShadow: {
        'sidebar': '2px 0 5px rgba(0, 0, 0, 0.1)',
        'header': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'dropdown': '0 5px 15px rgba(0, 0, 0, 0.1)',
        'subtle': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'deep': '0 4px 10px rgba(0, 0, 0, 0.2)',
        't-md': '0 -4px 6px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'sidebar-logo': '8px',
        'menu-item': '8px',
        'xl': '1.25rem',
        '2xl': '1.5rem',
      },
      opacity: {
        '0': '0',
        '85': '0.85',  // Para el texto del sidebar
      },
      zIndex: {
        '15': '15',  // Header z-index
        '20': '20',  // Sidebar z-index
        '25': '25',  // Submenu z-index
        '30': '30',  // Collapse button z-index
        '100': '100', // Dropdown menu z-index
      },
      fontFamily: {
        sans: ['"Inter"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};