<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Header Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div class="flex items-center space-x-4">
        <div
          class="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold text-gray-600 dark:text-gray-300">
          {{ userInitials }}
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ user.name }}</h1>
          <p class="text-gray-600 dark:text-gray-300">@{{ user.username }}</p>
          <p class="text-gray-500 dark:text-gray-400">{{ user.email }}</p>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Balance</h3>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400">${{ user.balance.toFixed(2) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Completed Chores</h3>
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ user.completedChores }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Current Streak</h3>
        <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ user.streakCount }} days</p>
      </div>
    </div>

    <!-- Roles and Verifiable Tasks -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Roles</h2>
        <div class="space-y-2">
          <span v-for="role in user.roles" :key="role"
            class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
            {{ role }}
          </span>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Verifiable Tasks</h2>
        <div class="space-y-2">
          <span v-for="task in user.verifiableTasks" :key="task"
            class="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
            {{ task }}
          </span>
        </div>
      </div>
    </div>

    <!-- Achievements -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Achievements</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="achievement in user.achievements" :key="achievement.id"
          class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h3 class="font-semibold text-gray-800 dark:text-white">{{ achievement.name }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ achievement.description }}</p>
        </div>
      </div>
    </div>

    <!-- Preferences -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Preferences</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span class="text-gray-700 dark:text-gray-300">Notifications</span>
          <span :class="[
            'px-2 py-1 rounded',
            user.preferences.notifications
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          ]">
            {{ user.preferences.notifications ? 'Enabled' : 'Disabled' }}
          </span>
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span class="text-gray-700 dark:text-gray-300">Email Reminders</span>
          <span :class="[
            'px-2 py-1 rounded',
            user.preferences.emailReminders
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          ]">
            {{ user.preferences.emailReminders ? 'Enabled' : 'Disabled' }}
          </span>
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span class="text-gray-700 dark:text-gray-300">Theme</span>
          <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
            {{ user.preferences.theme }}
          </span>
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span class="text-gray-700 dark:text-gray-300">Celebration Animations</span>
          <span :class="[
            'px-2 py-1 rounded',
            user.preferences.celebrationAnimations
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          ]">
            {{ user.preferences.celebrationAnimations ? 'Enabled' : 'Disabled' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Account Info -->
    <div class="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
      <p>Account created: {{ formatDate(user.createdAt) }}</p>
      <p>Last updated: {{ formatDate(user.updatedAt) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/types';
import { computed } from 'vue';

const authStore = useAuthStore();
const user = computed(() => authStore.user as User);

const userInitials = computed(() => {
  if (!user.value?.name) return '';
  return user.value.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
</script>