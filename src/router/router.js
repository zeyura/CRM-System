import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        meta: {layout: 'main', auth: true}, // auth -  надо залогиниться
        component: () => import('../views/Home.vue')
    },
    {
        path: '/login',
        name: 'Login',
        meta: {layout: 'empty'},
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        meta: {layout: 'empty'},
        component: () => import('../views/Register.vue')
    },
    {
        path: '/categories',
        name: 'Categories',
        meta: {layout: 'main', auth: true},
        component: () => import('../views/Categories.vue')
    },
    {
        path: '/detail-record',
        name: 'DetailRecord',
        meta: {layout: 'main', auth: true},
        component: () => import('../views/DetailRecord.vue')
    },
    {
        path: '/history',
        name: 'History',
        meta: {layout: 'main', auth: true},
        component: () => import('../views/History.vue')
    },
    {
        path: '/planning',
        name: 'Planning',
        meta: {layout: 'main', auth: true},
        component: () => import('../views/Planning.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        meta: {layout: 'main', auth: true},
        component: () => import('../views/Profile.vue')
    },
    {
        path: '/record',
        name: 'Record',
        meta: {layout: 'main', auth: true},
        component: () => import('../views/Record.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

// перед каждым переходом по роутам проверяем
// а залогинен ли юзверь и нужна ли аутентификация тое логин  вообще
// если что то посылаем его на стр логина  чтоб вошел для начала )
router.beforeEach((to,from,next) => {
    const currentUser = firebase.auth().currentUser;
    const requireAuth = to.matched.some(record => record.meta.auth);

    if(!currentUser && requireAuth) {
        next('/login?message=login')
    } else {
        next()
    }
});

export default router
