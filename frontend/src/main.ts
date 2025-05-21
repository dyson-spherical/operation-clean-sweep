import App from '@/App.vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import './assets/styles/main.css';
import router from './router';

// Create the app instance
const app = createApp(App);

// Install plugins
app.use(createPinia());
app.use(router);

// Mount the app
app.mount('#app');
