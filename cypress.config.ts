/*import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});*/
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000', // URL вашего приложения
    setupNodeEvents(on, config) {
      // Здесь можно добавить плагины
    },
  }
})
