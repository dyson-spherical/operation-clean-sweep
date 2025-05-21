<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex-shrink-0">
          <router-link to="/"
            class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
            <h1 class="text-xl font-bold">Family Chores</h1>
          </router-link>
        </div>

        <nav class="hidden sm:flex space-x-8">
          <router-link v-if="isAdmin" to="/admin"
            class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium relative"
            :class="{ 'text-indigo-600 dark:text-indigo-400': $route.path.startsWith('/admin') }">
            Admin Dashboard
            <span v-if="$route.path.startsWith('/admin')"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"></span>
          </router-link>
          <router-link v-if="isWorker" to="/worker"
            class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium relative"
            :class="{ 'text-indigo-600 dark:text-indigo-400': $route.path.startsWith('/worker') }">
            My Chores
            <span v-if="$route.path.startsWith('/worker')"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"></span>
          </router-link>
          <router-link v-if="isVerifier" to="/verifier"
            class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium relative"
            :class="{ 'text-indigo-600 dark:text-indigo-400': $route.path.startsWith('/verifier') }">
            Verify Chores
            <span v-if="$route.path.startsWith('/verifier')"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"></span>
          </router-link>
        </nav>

        <div class="relative" v-if="user">
          <div @click="toggleUserDropdown" class="flex items-center space-x-3 cursor-pointer">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ user.name }}</span>
            <div
              class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              {{ userInitials }}
            </div>
          </div>

          <div v-if="showUserDropdown"
            class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="py-1" role="menu">
              <router-link to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem">
                Profile
              </router-link>
              <router-link to="/settings"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem">
                Settings
              </router-link>
              <button @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const showUserDropdown = ref(false);

const user = computed(() => authStore.user);
const isAdmin = computed(() => authStore.isAdmin);
const isWorker = computed(() => authStore.isWorker);
const isVerifier = computed(() => authStore.isVerifier);

const userInitials = computed(() => {
  if (!user.value?.name) return '';

  return user.value.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

function toggleUserDropdown() {
  showUserDropdown.value = !showUserDropdown.value;
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>
