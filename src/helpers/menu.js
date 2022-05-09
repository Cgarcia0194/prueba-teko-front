export default () => {
    const menu = [
        {
            path: "/",
            name: "Index",
            redirect: '/login'
        },
        {
            path: "/login",
            name: "Login",
            component: () => import('@/views/Login.vue')
        },
        {
            path: "/inicio",
            name: "Inicio",
            meta: {
                requiresAuth: true
            },
            component: () => import('@/views/Inicio.vue')
        },
        {
            path: "/:catchAll(.*)",
            component: () => import('@/views/E404.vue')
        }
    ];

    return { menu };
}