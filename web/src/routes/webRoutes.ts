import { RouteRecordRaw } from "vue-router";

import HomePage from "../pages/HomePage.vue";

const webRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: HomePage, 
    }
] 

export default webRoutes;