/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue';
// Composables
import { createApp } from 'vue';
// Plugins
import { registerPlugins } from '@/plugins';
// 
// import 'vuetify/styles'
// import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'

// const vuetify = createVuetify({
//   components,
//   directives,
// })
// 
const app = createApp(App)

registerPlugins(app)
// app.use(vuetify).mount('#app');
app.mount('#app')
