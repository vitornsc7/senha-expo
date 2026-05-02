/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './App.{js,jsx,ts,tsx}',
        './index.{js,jsx,ts,tsx}',
        './pages/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#5c9285',
                    dark: '#4a7a6f',
                    light: '#eef5f3',
                    text: '#274740',
                    muted: '#6d7f79',
                },
            },
        },
    },
    plugins: [],
};
