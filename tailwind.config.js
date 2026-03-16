/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#f0ebff',
                    100: '#e3d8ff',
                    500: '#6c3ef4',
                    600: '#5b34d6',
                    700: '#4f46e5',
                },
                app: {
                    bg: '#f7f8fc',
                    panel: '#ffffff',
                    line: '#e7eaf3',
                    ink: '#0f172a',
                    muted: '#667085',
                },
            },
        },
    },
    plugins: [],
};
