// src/stores/auth.ts
import authService from '@/services/authService';
import type { User } from '@/types';
import { Role } from '@/types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(authService.getCurrentUser());
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);

    const isAuthenticated = computed(() => {
        return !!user.value;
    });

    const hasRole = computed(() => (role: Role) => {
        return authService.hasRole(role);
    });

    const isAdmin = computed(() => hasRole.value(Role.ADMINISTRATOR));
    const isWorker = computed(() => hasRole.value(Role.WORKER));
    const isVerifier = computed(() => hasRole.value(Role.VERIFIER));

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
        await authService.logout();
        user.value = null;
    }

    // Function to update user after successful authentication
    function setUser(newUser: User | null) {
        user.value = newUser;
    }

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
