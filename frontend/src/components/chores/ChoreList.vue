<!-- src/components/chores/ChoreList.vue -->
<template>
  <div class="chore-list">
    <div v-if="loading" class="loading-indicator">
      <span>Loading chores...</span>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else>
      <div class="chore-grid">
        <chore-card 
          v-for="chore in chores" 
          :key="chore.id" 
          :chore="chore"
          @complete="markComplete"
        />
      </div>

      <div class="pagination-controls">
        <button 
          @click="loadPreviousPage" 
          :disabled="!hasPreviousPage"
          class="btn-pagination"
        >
          Previous
        </button>

        <span class="page-info">
          Page {{ currentPage + 1 }} of {{ totalPages }}
        </span>

        <button 
          @click="loadNextPage" 
          :disabled="!hasNextPage"
          class="btn-pagination"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useChoreStore } from '@/stores/chores';
import ChoreCard from './ChoreCard.vue';

const choreStore = useChoreStore();

const chores = computed(() => choreStore.chores);
const loading = computed(() => choreStore.loading);
const error = computed(() => choreStore.error);
const currentPage = computed(() => choreStore.pagination.page);
const totalPages = computed(() => choreStore.pagination.totalPages);
const hasNextPage = computed(() => !!choreStore.links.next);
const hasPreviousPage = computed(() => !!choreStore.links.prev);

onMounted(async () => {
  await choreStore.fetchChores();
});

const loadNextPage = () => choreStore.loadNextPage();
const loadPreviousPage = () => choreStore.loadPreviousPage();

const markComplete = async (choreId) => {
  // Implementation for marking a chore complete
};
</script>
