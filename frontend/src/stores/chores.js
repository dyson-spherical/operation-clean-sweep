// src/stores/chores.js
import { defineStore } from 'pinia';
import choreService from '@/services/choreService';

export const useChoreStore = defineStore('chores', {
  state: () => ({
    chores: [],
    currentChore: null,
    pagination: {
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0
    },
    links: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchChores() {
      this.loading = true;
      try {
        const result = await choreService.getAllChores(
          this.pagination.page, 
          this.pagination.size
        );

        this.chores = result.chores;
        this.pagination = result.page;
        this.links = result.links;
        this.error = null;
      } catch (err) {
        this.error = err.message || 'Failed to fetch chores';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async loadNextPage() {
      if (this.links.next) {
        this.pagination.page++;
        await this.fetchChores();
      }
    },

    async loadPreviousPage() {
      if (this.links.prev && this.pagination.page > 0) {
        this.pagination.page--;
        await this.fetchChores();
      }
    }

    // Additional actions for CRUD operations
  }
});
