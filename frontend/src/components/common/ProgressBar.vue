<template>
  <div class="progress-container">
    <div class="progress-label" v-if="showLabel">
      <span>{{ completedCount }} of {{ totalCount }} {{ label }}</span>
      <span class="percentage">{{ percentage }}%</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: `${percentage}%` }"
        :class="{ 
          'complete': percentage === 100,
          'almost': percentage >= 75 && percentage < 100,
          'halfway': percentage >= 50 && percentage < 75,
          'started': percentage > 0 && percentage < 50
        }"
      ></div>
    </div>
    <confetti-animation v-if="showCelebration" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ConfettiAnimation from './ConfettiAnimation.vue';

const props = defineProps({
  completedCount: {
    type: Number,
    required: true
  },
  totalCount: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    default: 'chores'
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  showCelebration: {
    type: Boolean,
    default: false
  }
});

const percentage = computed(() => {
  if (props.totalCount === 0) return 0;
  return Math.round((props.completedCount / props.totalCount) * 100);
});
</script>

<style scoped>
.progress-container {
  margin: 1rem 0;
  position: relative;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-color);
}

.percentage {
  font-weight: 600;
}

.progress-bar {
  height: 0.75rem;
  background-color: var(--border-color);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s ease-out;
}

.progress-fill.started {
  background-color: var(--warning-color);
}

.progress-fill.halfway {
  background-color: var(--accent-color);
}

.progress-fill.almost {
  background-color: #22c55e;
}

.progress-fill.complete {
  background-color: var(--success-color);
}
</style>
