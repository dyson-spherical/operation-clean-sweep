import authService from '@/services/authService';
import { Role } from '@/types';
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

// Use lazy loading for route components to improve performance
// This also helps with verbatimModuleSyntax as it uses dynamic imports
const routes: RouteRecordRaw[] = [
    {
        path: '/callback',
        name: 'OidcCallback',
        component: () => import('@/views/OidcCallback.vue'),
        meta: { requiresAuth: false, title: 'Authenticating...' }
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
        meta: { requiresAuth: true, title: 'Home' }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        meta: { requiresAuth: false, title: 'Login' }
    },
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: () => import('@/views/AdminDashboard.vue'),
        meta: {
            requiresAuth: true,
            requiredRole: Role.ADMIN,
            title: 'Admin Dashboard'
        }
    },
    {
        path: '/worker',
        name: 'WorkerDashboard',
        component: () => import('@/views/WorkerDashboard.vue'),
        meta: {
            requiresAuth: true,
            requiredRole: Role.WORKER,
            title: 'Worker Dashboard'
        }
    },
    {
        path: '/verifier',
        name: 'VerifierDashboard',
        component: () => import('@/views/VerifierDashboard.vue'),
        meta: {
            requiresAuth: true,
            requiredRole: Role.VERIFIER,
            title: 'Verifier Dashboard'
        }
    },
    {
        path: '/navigator',
        name: "Navigator",
        meta: {
            requiresAuth: true,
            title: "Navigator"
        },
        component: () => import('@/views/Navigator.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue'),
        meta: {
            requiresAuth: true,
            title: 'Profile'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
        meta: { title: 'Page Not Found' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, _from, next) => {
    // Update document title
    document.title = `${to.meta.title as string || 'Chore Management'} - Family Chores`;

    // Skip auth check for callback route
    if (to.name === 'OidcCallback') {
        next();
        return;
    }

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth as boolean);
    const requiredRole = to.meta.requiredRole as Role | undefined;

    if (!requiresAuth) {
        next();
        return;
    }

    if (!(await authService.isAuthenticated())) {
        // Store the intended destination for after login
        const loginPath = { name: 'Login', query: { redirect: to.fullPath } };
        next(loginPath);
        return;
    }

    if (requiredRole && !authService.hasRole(requiredRole)) {
        next({ name: 'Home' });
        return;
    }

    next();
});

export default router;
