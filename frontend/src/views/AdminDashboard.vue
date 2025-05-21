<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

    <div class="border-b border-gray-200 dark:border-gray-700 mb-8">
      <nav class="-mb-px flex space-x-8 overflow-x-auto">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
          activeTab === tab.id
            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200'
        ]">
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <div class="space-y-6">
      <!-- Chores Management Tab -->
      <div v-if="activeTab === 'chores'" class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Chores Management</h2>
          <button @click="showAddChoreModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add New Chore
          </button>
        </div>

        <div class="px-6 py-4">
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Create and manage chores for your household. Assign values, schedules, and checklists.
          </p>

          <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 text-center">
            <p class="text-gray-500 dark:text-gray-400">Chore management interface will be implemented in Phase 2.</p>
          </div>
        </div>
      </div>

      <!-- Users Management Tab -->
      <div v-if="activeTab === 'users'" class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Users Management</h2>
          <button @click="showAddUserModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add New User
          </button>
        </div>

        <div class="px-6 py-4">
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Manage household members, assign roles, and set permissions.
          </p>

          <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 text-center">
            <p class="text-gray-500 dark:text-gray-400">User management interface will be implemented in Phase 2.</p>
          </div>
        </div>
      </div>

      <!-- Weekly Ceremony Tab -->
      <div v-if="activeTab === 'ceremony'" class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Weekly Ceremony</h2>
          <button @click="navigateToCeremony"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Start Ceremony
          </button>
        </div>

        <div class="px-6 py-4">
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Set up and manage the weekly chore assignment ceremony.
          </p>

          <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 text-center">
            <p class="text-gray-500 dark:text-gray-400">Weekly ceremony interface will be implemented in Phase 4.</p>
          </div>
        </div>
      </div>

      <!-- Financial Overview Tab -->
      <div v-if="activeTab === 'financial'" class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Financial Overview</h2>
        </div>

        <div class="px-6 py-4">
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Track chore values, manage accounts, and process payments.
          </p>

          <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 text-center">
            <p class="text-gray-500 dark:text-gray-400">Financial management interface will be implemented in Phase 3.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeTab = ref('chores');
const showAddChoreModal = ref(false);
const showAddUserModal = ref(false);

const tabs = [
  { id: 'chores', label: 'Chores' },
  { id: 'users', label: 'Users' },
  { id: 'ceremony', label: 'Weekly Ceremony' },
  { id: 'financial', label: 'Financial' }
];

function navigateToCeremony() {
  // This will be implemented in Phase 4
  alert('Weekly ceremony feature will be available in a future update.');
}
</script>
