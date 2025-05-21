<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          &copy; {{ currentYear }} Family Chores Management
        </div>
        <div class="flex space-x-6">
          <button @click="toggleTheme"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {{ isDarkTheme ? 'Light Mode' : 'Dark Mode' }}
          </button>
          <button @click="showAbout = true"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            About
          </button>
          <button @click="showHelp = true"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Help
          </button>
        </div>
      </div>
    </div>

    <modal-dialog v-if="showAbout" title="About Family Chores" @close="showAbout = false">
      <div class="space-y-4">
        <p class="text-gray-600 dark:text-gray-300">
          Family Chores is a collaborative task management system designed to help
          families organize household responsibilities in a fun and engaging way.
        </p>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Version 1.0.0
        </p>
      </div>
    </modal-dialog>

    <modal-dialog v-if="showHelp" title="Help & Support" @close="showHelp = false">
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Quick Start Guide</h3>
        <div class="space-y-2 text-gray-600 dark:text-gray-300">
          <p>1. View your assigned chores on your dashboard</p>
          <p>2. Complete chores and mark them as done</p>
          <p>3. Wait for verification from a verifier</p>
          <p>4. Earn rewards for completed chores</p>
        </div>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          For more help, contact the administrator.
        </p>
      </div>
    </modal-dialog>
  </footer>
</template>

<script setup lang="ts">
import ModalDialog from '@/components/common/ModalDialog.vue';
import userService from '@/services/api/userService';
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';

const authStore = useAuthStore();
const showAbout = ref(false);
const showHelp = ref(false);

const currentYear = computed(() => new Date().getFullYear());
const isDarkTheme = computed(() => authStore.user?.preferences?.theme === 'dark');

async function toggleTheme() {
  if (!authStore.user) return;

  const newTheme = isDarkTheme.value ? 'light' : 'dark';

  try {
    await userService.updatePreferences(authStore.user.id, {
      theme: newTheme
    });

    // Update local user data
    if (authStore.user.preferences) {
      authStore.user.preferences.theme = newTheme;
    } else {
      authStore.user.preferences = {
        theme: newTheme,
        notifications: true,
        emailReminders: true,
        celebrationAnimations: true
      };
    }

    // Update in localStorage
    localStorage.setItem('current_user', JSON.stringify(authStore.user));

    // Apply theme to document
    document.documentElement.classList.toggle('dark', isDarkTheme.value);
  } catch (error) {
    console.error('Failed to update theme preference:', error);
  }
}
</script>
