<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900" :class="theme">
    <app-header v-if="isAuthenticated" />
    <main class="flex-1 p-4 max-w-7xl mx-auto w-full">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <app-footer v-if="isAuthenticated" />
  </div>
</template>

<script setup lang="ts">
import AppFooter from '@/components/common/AppFooter.vue';
import AppHeader from '@/components/common/AppHeader.vue';
import halNavigator from '@/services/api/halNavigator';
import authService from '@/services/authService';
import { useAuthStore } from '@/stores/auth';
import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const theme = computed(() => authStore.user?.preferences?.theme || 'light');

// Update the document theme when the user preference changes
watch(theme, (newTheme) => {
  document.documentElement.classList.toggle('dark', newTheme === 'dark');
});

onMounted(async () => {
  // Update the store with the current user from authService
  const currentUser = authService.getCurrentUser();

  console.log("currentUser",currentUser);

  if (currentUser) {
    authStore.setUser(currentUser);

    try {
      // Initialize HAL navigator
      await halNavigator.initialize();

      // Apply theme based on user preference
      document.documentElement.classList.toggle('dark', theme.value === 'dark');

      // Redirect to appropriate dashboard based on role if on the home page
      if (router.currentRoute.value.path === '/') {
        if (authStore.isAdmin) {
          router.push({ name: 'AdminDashboard' });
        } else if (authStore.isVerifier) {
          router.push({ name: 'VerifierDashboard' });
        } else if (authStore.isWorker) {
          router.push({ name: 'WorkerDashboard' });
        }
      }
    } catch (error) {
      console.error('Failed to initialize application:', error);
    }
  }
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Keep only the transition styles as the rest will be handled by Tailwind */
</style>
