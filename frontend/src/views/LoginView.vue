<!-- src/views/LoginView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">TaskTide</h1>
        <p class="text-gray-600 dark:text-gray-300">Sign in to manage your household chores</p>
      </div>

      <div class="mt-8">
        <button @click="handleLogin"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          :disabled="loading">
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Signing in...
          </span>
          <span v-else>Sign In with Authentik</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import authService from '@/services/authService';
import { ref } from 'vue';

const loading = ref(false);

async function handleLogin() {
  loading.value = true;
  try {
    await authService.login();
    // The page will redirect to Authentik, so no need to handle success here
  } catch (error) {
    console.error('Failed to initiate login:', error);
    loading.value = false;
  }
}
</script>
