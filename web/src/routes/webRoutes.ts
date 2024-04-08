import { RouteRecordRaw } from 'vue-router';

import HomePage from '../pages/HomePage.vue';
import TemplateSingle from '../pages/TemplateSingle.vue';

const webRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: HomePage,
    },
    {
        path: '/template/:id',
        name: 'template',
        component: TemplateSingle,
    },
];

export default webRoutes;
