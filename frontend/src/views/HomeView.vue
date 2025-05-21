<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">Welcome to TaskTide</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
        v-if="isAdmin">
        <h2 class="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Admin Dashboard</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">Manage chores, users, and system settings</p>
        <router-link to="/admin"
          class="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Go to
          Admin Dashboard</router-link>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
        v-if="isWorker">
        <h2 class="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">My Chores</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">View and complete your assigned chores</p>
        <router-link to="/worker"
          class="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Go to
          My Chores</router-link>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
        v-if="isVerifier">
        <h2 class="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Verify Chores</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">Review and verify completed chores</p>
        <router-link to="/verifier"
          class="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Go to
          Verification</router-link>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
      v-if="currentWeek">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Weekly Summary</h2>
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
        This week's goal: <span class="font-semibold">{{ currentWeek.goal }}</span>
      </p>

      <progress-bar :completed-count="currentWeek.totalChoresCompleted" :total-count="currentWeek.totalChoresAssigned"
        label="chores completed" :show-celebration="currentWeek.goalAchieved" />

      <div
        class="mt-6 text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
        v-if="currentWeek.goalAchieved">
        <h3 class="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">🎉 Congratulations! 🎉</h3>
        <p class="text-green-700 dark:text-green-300">You've achieved this week's goal!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from '@/components/common/ProgressBar.vue';
import halClient from '@/services/api/halClient';
import { useAuthStore } from '@/stores/auth';
import { type Week } from '@/types';
import { computed, onMounted, ref } from 'vue';

const authStore = useAuthStore();
const currentWeek = ref<Week | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const isAdmin = computed(() => authStore.isAdmin);
const isWorker = computed(() => authStore.isWorker);
const isVerifier = computed(() => authStore.isVerifier);

onMounted(async () => {
  // await fetchCurrentWeek();
});

async function fetchCurrentWeek() {
  loading.value = true;
  error.value = null;

  try {
    const response = await halClient.get<Week>('/weeks/current');
    currentWeek.value = response;
  } catch (err: any) {
    console.error('Failed to fetch current week:', err);
    error.value = 'Failed to load weekly data';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Remove all custom styles as they're now handled by Tailwind */
</style>
