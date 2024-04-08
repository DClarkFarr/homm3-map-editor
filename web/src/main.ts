import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';

import { createRouter, createWebHistory } from 'vue-router';
import webRoutes from './routes/webRoutes';
import { createPinia } from 'pinia';

const router = createRouter({
    routes: webRoutes,
    history: createWebHistory(),
});

const pinia = createPinia();

const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount('#app');
