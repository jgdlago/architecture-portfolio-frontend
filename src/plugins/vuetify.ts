/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// Define custom themes
const myLightTheme = {
  dark: false,
  colors: {
    background: '#FAF3E0',   // Beige Claro
    surface: '#E5DAC8',      // Creme
    primary: '#4A4A4A',      // Cinza Escuro
    secondary: '#C5A880',    // Dourado Claro
    border: '#BFA387',       // Marrom Claro
    action: '#8D6E63',       // Marrom Rosado
    error: '#D32F2F',        // Vermelho Escuro
    success: '#388E3C',      // Verde Escuro
    warning: '#FFA000',      // Laranja
    text: '#4A4A4A',         // Cinza Escuro
  }
}

const myDarkTheme = {
  dark: true,
  colors: {
    background: '#2C2C2C',   // Preto Suave
    surface: '#3D3D3D',      // Cinza Escuro
    primary: '#E5E5E5',      // Cinza Claro
    secondary: '#A67C52',    // Dourado Escuro
    border: '#5A5A5A',       // Cinza Médio
    action: '#8D6E63',       // Marrom Rosado
    error: '#D32F2F',        // Vermelho Escuro
    success: '#388E3C',      // Verde Escuro
    warning: '#FFA000',      // Laranja
    text: '#E5E5E5',         // Cinza Claro
  }
}

// Create Vuetify instance
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: myLightTheme,
      dark: myDarkTheme,
    },
  },
})
