<template>
  <div class="flex flex-col h-screen p-4 gap-4">
    <div class="flex justify-between items-center gap-4">
      <h1 class="text-2xl font-bold">HAL Navigator</h1>
      <div class="flex gap-2 flex-1 max-w-2xl">
        <input v-model="currentUrl" @keyup.enter="() => navigateTo()" placeholder="Enter HAL URL"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
        <button @click="() => navigateTo()"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
          Go
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-auto border border-gray-300 rounded-md p-4">
      <div v-if="loading" class="text-center py-8 text-gray-600">Loading...</div>
      <div v-else-if="error" class="p-4 bg-red-50 text-red-700 rounded-md">{{ error }}</div>
      <div v-else class="flex flex-col gap-4">
        <div v-if="currentData" class="space-y-2">
          <h2 class="text-xl font-semibold">Data</h2>
          <pre class="bg-gray-50 p-4 rounded-md overflow-auto">{{ JSON.stringify(currentData, null, 2) }}</pre>
        </div>

        <div v-if="links.length > 0" class="space-y-2">
          <h2 class="text-xl font-semibold">Links</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            <button v-for="link in links" :key="link.rel" @click="() => navigateTo(link.href)"
              class="p-2 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 text-left focus:outline-none focus:ring-2 focus:ring-green-500">
              {{ link.rel }}
            </button>
          </div>
        </div>

        <div v-if="embeddedResources.length > 0" class="space-y-4">
          <h2 class="text-xl font-semibold">Embedded Resources</h2>
          <div v-for="(resource, index) in embeddedResources" :key="index"
            class="border border-gray-200 rounded-md p-4">
            <h3 class="text-lg font-medium mb-2">{{ resource.type }}</h3>
            <pre class="bg-gray-50 p-4 rounded-md overflow-auto">{{ JSON.stringify(resource.data, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-2">
      <button @click="goBack" :disabled="!canGoBack"
        class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed">
        Back
      </button>
      <button @click="goForward" :disabled="!canGoForward"
        class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed">
        Forward
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import halClient from '@/services/api/halClient';
import type { AxiosResponse } from 'axios';
import { computed, ref } from 'vue';

const currentUrl = ref('/api');
const currentData = ref<any>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const history = ref<string[]>([]);
const historyIndex = ref(-1);

const links = computed(() => {
  if (!currentData.value?._links) return [];
  return Object.entries(currentData.value._links)
    .map(([rel, link]: [string, any]) => ({
      rel,
      href: typeof link === 'string' ? link : link.href
    }));
});

const embeddedResources = computed(() => {
  if (!currentData.value?._embedded) return [];
  return Object.entries(currentData.value._embedded)
    .map(([type, data]: [string, any]) => ({
      type,
      data: Array.isArray(data) ? data : [data]
    }));
});

const canGoBack = computed(() => historyIndex.value > 0);
const canGoForward = computed(() => historyIndex.value < history.value.length - 1);

async function navigateTo(url?: string) {
  if (url) {
    currentUrl.value = url;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await halClient.get(currentUrl.value) as AxiosResponse;
    currentData.value = response.data;

    // Update history
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1);
    }
    history.value.push(currentUrl.value);
    historyIndex.value = history.value.length - 1;
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch data';
    currentData.value = null;
  } finally {
    loading.value = false;
  }
}

function goBack() {
  if (canGoBack.value) {
    historyIndex.value--;
    currentUrl.value = history.value[historyIndex.value];
    navigateTo();
  }
}

function goForward() {
  if (canGoForward.value) {
    historyIndex.value++;
    currentUrl.value = history.value[historyIndex.value];
    navigateTo();
  }
}

// Initial navigation
navigateTo();
</script>