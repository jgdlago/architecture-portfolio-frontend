/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Alterna o tema escuro com a classe 'dark'
  theme: {
    extend: {
      colors: {
        light: {
          background: '#F5F5F5', // Cor de fundo branco 'off-white'
          text: '#6D4C41',       // Texto principal marrom claro
          contrastGold: '#F5C67C', // Contraste dourado claro
          contrastLightBrown: '#8E735B', // Contraste marrom claro
          accent: '#9E8B74',     // Detalhes e acentos marrom médio
        },
        dark: {
          background: '#121212', // Cor de fundo preto ou cinza muito escuro
          text: '#E0E0E0',       // Texto principal branco ou cinza claro
          contrastDarkGold: '#8B6D3B', // Contraste dourado escuro
          contrastBrown: '#5D3A1E', // Contraste marrom profundo
          accent: '#BCAAA4',     // Detalhes e acentos dourado médio
        },
      },
    },
  },
  plugins: [],
}
