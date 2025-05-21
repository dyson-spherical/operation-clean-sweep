<template>
  <div class="confetti-container" ref="container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import lottie, { AnimationItem } from 'lottie-web';
import confettiData from '@/assets/animations/confetti.json';

const container = ref<HTMLElement | null>(null);
let animation: AnimationItem | null = null;

onMounted(() => {
  if (container.value) {
    animation = lottie.loadAnimation({
      container: container.value,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: confettiData
    });

    animation.addEventListener('complete', () => {
      // Optional: remove the animation when complete
      // if (container.value) container.value.innerHTML = '';
    });
  }
});

onBeforeUnmount(() => {
  if (animation) {
    animation.destroy();
  }
});
</script>

<style scoped>
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}
</style>
