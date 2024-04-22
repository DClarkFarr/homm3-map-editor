import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';

import { createRouter, createWebHistory } from 'vue-router';
import webRoutes from './routes/webRoutes';
import { createPinia } from 'pinia';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
    components,
    directives,
});

const router = createRouter({
    routes: webRoutes,
    history: createWebHistory(),
});

const pinia = createPinia();

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(vuetify);

app.mount('#app');
