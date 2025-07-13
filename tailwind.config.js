/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#1E40AF', // blue-800
        'primary-50': '#EFF6FF', // blue-50
        'primary-100': '#DBEAFE', // blue-100
        'primary-200': '#BFDBFE', // blue-200
        'primary-500': '#3B82F6', // blue-500
        'primary-600': '#2563EB', // blue-600
        'primary-700': '#1D4ED8', // blue-700
        'primary-foreground': '#FFFFFF', // white

        // Secondary Colors
        'secondary': '#6366F1', // indigo-500
        'secondary-50': '#EEF2FF', // indigo-50
        'secondary-100': '#E0E7FF', // indigo-100
        'secondary-200': '#C7D2FE', // indigo-200
        'secondary-500': '#6366F1', // indigo-500
        'secondary-600': '#4F46E5', // indigo-600
        'secondary-700': '#4338CA', // indigo-700
        'secondary-foreground': '#FFFFFF', // white

        // Accent Colors
        'accent': '#F59E0B', // amber-500
        'accent-50': '#FFFBEB', // amber-50
        'accent-100': '#FEF3C7', // amber-100
        'accent-200': '#FDE68A', // amber-200
        'accent-500': '#F59E0B', // amber-500
        'accent-600': '#D97706', // amber-600
        'accent-700': '#B45309', // amber-700
        'accent-foreground': '#FFFFFF', // white

        // Background Colors
        'background': '#FAFBFC', // gray-50
        'surface': '#FFFFFF', // white
        'surface-50': '#F9FAFB', // gray-50
        'surface-100': '#F3F4F6', // gray-100
        'surface-200': '#E5E7EB', // gray-200

        // Text Colors
        'text-primary': '#1F2937', // gray-800
        'text-secondary': '#6B7280', // gray-500
        'text-muted': '#9CA3AF', // gray-400
        'text-inverse': '#FFFFFF', // white

        // Status Colors
        'success': '#10B981', // emerald-500
        'success-50': '#ECFDF5', // emerald-50
        'success-100': '#D1FAE5', // emerald-100
        'success-200': '#A7F3D0', // emerald-200
        'success-500': '#10B981', // emerald-500
        'success-600': '#059669', // emerald-600
        'success-700': '#047857', // emerald-700
        'success-foreground': '#FFFFFF', // white

        'warning': '#F59E0B', // amber-500
        'warning-50': '#FFFBEB', // amber-50
        'warning-100': '#FEF3C7', // amber-100
        'warning-200': '#FDE68A', // amber-200
        'warning-500': '#F59E0B', // amber-500
        'warning-600': '#D97706', // amber-600
        'warning-700': '#B45309', // amber-700
        'warning-foreground': '#FFFFFF', // white

        'error': '#EF4444', // red-500
        'error-50': '#FEF2F2', // red-50
        'error-100': '#FEE2E2', // red-100
        'error-200': '#FECACA', // red-200
        'error-500': '#EF4444', // red-500
        'error-600': '#DC2626', // red-600
        'error-700': '#B91C1C', // red-700
        'error-foreground': '#FFFFFF', // white

        // Border Colors
        'border': '#E5E7EB', // gray-200
        'border-light': '#F3F4F6', // gray-100
        'border-dark': '#D1D5DB', // gray-300
      },
      fontFamily: {
        'heading': ['Roboto Mono', 'Fira Code', 'JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
        'body': ['Roboto', 'system-ui', 'sans-serif'],
        'caption': ['Roboto', 'system-ui', 'sans-serif'],
        'mono': ['Fira Code', 'JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'heading-xl': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '600' }], // 36px
        'heading-lg': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '600' }], // 30px
        'heading-md': ['1.5rem', { lineHeight: '2rem', fontWeight: '500' }], // 24px
        'heading-sm': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '500' }], // 20px
        'body-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }], // 18px
        'body-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }], // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }], // 14px
        'caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }], // 12px
        'data': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }], // 14px
      },
      boxShadow: {
        'educational': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'educational-md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'educational-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
      },
      transitionTimingFunction: {
        'educational': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'educational-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      spacing: {
        '18': '4.5rem', // 72px
        '88': '22rem', // 352px
      },
      zIndex: {
        'header': '100',
        'control-panel': '90',
        'tooltip': '150',
        'overlay': '200',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}