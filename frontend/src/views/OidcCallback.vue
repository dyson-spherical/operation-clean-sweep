<!-- src/views/OidcCallback.vue -->
<template>
  <div class="callback-container">
    <div class="loading-spinner"></div>
    <p>Completing login, please wait...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import authService from '@/services/authService';

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  try {
    await authService.handleCallback();

    // Redirect to the originally requested URL or default route
    const redirectPath = route.query.redirect as string || '/';
    router.push(redirectPath);
  } catch (error) {
    console.error('Error during authentication callback:', error);
    router.push('/login');
  }
});
</script>

<style scoped>
.callback-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--primary-color);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
