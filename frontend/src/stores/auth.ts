// src/stores/auth.ts
import authService from '@/services/authService';
import type { User } from '@/types';
import { Role } from '@/types';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    // Initialize user from localStorage if available
    const storedUser = localStorage.getItem('current_user');
    const initialUser = storedUser ? JSON.parse(storedUser) : null;
    const user = ref<User | null>(initialUser);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const router = useRouter();

    const isAuthenticated = computed(() => {
        return !!user.value;
    });

    const hasRole = computed(() => (role: Role) => {
        console.log('Checking role in store:', role);
        console.log('User roles in store:', user.value?.roles);
        return user.value?.roles.includes(role) ?? false;
    });

    const isAdmin = computed(() => {
        console.log('Checking ADMIN role');
        return hasRole.value(Role.ADMIN);
    });

    const isWorker = computed(() => {
        console.log('Checking WORKER role');
        return hasRole.value(Role.WORKER);
    });

    const isVerifier = computed(() => {
        console.log('Checking VERIFIER role');
        return hasRole.value(Role.VERIFIER);
    });

    async function login() {
        loading.value = true;
        error.value = null;

        try {
            await authService.login();
            // The page will redirect to Authentik, so we don't update the user here
        } catch (err: any) {
            error.value = 'Failed to initiate login';
            throw error.value;
        } finally {
            loading.value = false;
        }
    }

    async function logout() {
        loading.value = true;
        try {
            await authService.logout();
            user.value = null;
            router.push('/login');
        } catch (err: any) {
            error.value = 'Failed to logout';
            console.error('Logout error:', err);
        } finally {
            loading.value = false;
        }
    }

    // Function to update user after successful authentication
    function setUser(newUser: User | null) {
        console.log('Setting user in store:', newUser);
        user.value = newUser;
        if (!newUser) {
            // If user is cleared, redirect to login
            router.push('/login');
        }
    }

    // Watch for authentication state changes
    watch(() => authService.getCurrentUser(), (newUser) => {
        if (newUser) {
            setUser(newUser);
        } else {
            // If authService returns null, try to get from localStorage
            const storedUser = localStorage.getItem('current_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        }
    });

    return {
        user,
        loading,
        error,
        isAuthenticated,
        hasRole,
        isAdmin,
        isWorker,
        isVerifier,
        login,
        logout,
        setUser
    };
});
