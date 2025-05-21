<template>
  <div class="chore-card" :class="{ 'is-completed': isCompleted }">
    <div class="chore-header">
      <h3>{{ chore.name }}</h3>
      <span class="difficulty-badge">{{ chore.difficulty }}</span>
    </div>

    <p class="description">{{ chore.description }}</p>

    <div class="checklist" v-if="showChecklist">
      <h4>Checklist:</h4>
      <ul>
        <li v-for="(item, index) in chore.checklist" :key="index">
          <input type="checkbox" v-model="checklistStatus[index]">
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>

    <div class="estimated-time">
      <i class="icon-clock"></i> {{ chore.estimatedDuration }} minutes
    </div>

    <div class="card-actions">
      <button @click="markAsCompleted" 
              :disabled="isCompleted" 
              class="btn-complete">
        Mark Complete
      </button>
      <button @click="toggleChecklist" class="btn-checklist">
        {{ showChecklist ? 'Hide' : 'Show' }} Checklist
      </button>
    </div>
  </div>
</template>
