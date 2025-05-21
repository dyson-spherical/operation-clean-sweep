<template>
  <div class="worker-dashboard">
    <h1>My Chores</h1>

    <div class="dashboard-summary card">
      <div class="summary-stats">
        <div class="stat-item">
          <span class="stat-value">{{ todayChores.length }}</span>
          <span class="stat-label">Today's Chores</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ flexibleChores.length }}</span>
          <span class="stat-label">Flexible Chores</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ completedChores.length }}</span>
          <span class="stat-label">Completed</span>
        </div>
      </div>

      <progress-bar 
        :completed-count="completedChores.length" 
        :total-count="totalChores"
        label="chores completed"
        :show-celebration="allChoresCompleted"
      />
    </div>

    <div class="chores-section">
      <h2>Today's Chores</h2>
      <div v-if="loading" class="loading-indicator">
        Loading chores...
      </div>
      <div v-else-if="todayChores.length === 0" class="empty-state">
        <p>No chores scheduled for today!</p>
      </div>
      <div v-else class="chore-placeholder">
        <p>Chore cards will be implemented in Phase 2.</p>
        <p>You have {{ todayChores.length }} chores scheduled for today.</p>
      </div>
    </div>

    <div class="chores-section">
      <h2>Flexible Chores</h2>
      <div v-if="loading" class="loading-indicator">
        Loading chores...
      </div>
      <div v-else-if="flexibleChores.length === 0" class="empty-state">
        <p>No flexible chores assigned!</p>
      </div>
      <div v-else class="chore-placeholder">
        <p>Flexible chore cards will be implemented in Phase 2.</p>
        <p>You have {{ flexibleChores.length }} flexible chores to complete.</p>
      </div>
    </div>

    <div class="chores-section">
      <h2>Pending Verification</h2>
      <div v-if="loading" class="loading-indicator">
        Loading chores...
      </div>
      <div v-else-if="pendingVerification.length === 0" class="empty-state">
        <p>No chores pending verification!</p>
      </div>
      <div v-else class="chore-placeholder">
        <p>Verification queue will be implemented in Phase 2.</p>
        <p>You have {{ pendingVerification.length }} chores awaiting verification.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ProgressBar from '@/components/common/ProgressBar.vue';
import halClient from '@/services/api/halClient';
import type { Assignment, AssignmentStatus } from '@/types';

// Mock data for initial UI development
const assignments = ref<Assignment[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Computed properties for different chore categories
const todayChores = computed(() => {
  return assignments.value.filter(a => 
    a.status === AssignmentStatus.PENDING && 
    isToday(a.createdAt)
  );
});

const flexibleChores = computed(() => {
  return assignments.value.filter(a => 
    a.status === AssignmentStatus.PENDING && 
    !isToday(a.createdAt)
  );
});

const completedChores = computed(() => {
  return assignments.value.filter(a => 
    a.status === AssignmentStatus.COMPLETED || 
    a.status === AssignmentStatus.VERIFIED
  );
});

const pendingVerification = computed(() => {
  return assignments.value.filter(a => 
    a.status === AssignmentStatus.VERIFICATION_NEEDED
  );
});

const totalChores = computed(() => assignments.value.length);

const allChoresCompleted = computed(() => {
  return totalChores.value > 0 && 
         completedChores.value.length === totalChores.value;
});

onMounted(async () => {
  await fetchAssignments();
});

async function fetchAssignments() {
  loading.value = true;
  error.value = null;

  try {
    // In a real implementation, this would fetch from the API
    // const response = await halClient.get<{ _embedded: { assignments: Assignment[] } }>('/assignments/my');
    // assignments.value = response._embedded.assignments;

    // Mock data for UI development
    setTimeout(() => {
      assignments.value = [
        {
          id: '1',
          choreId: 'c1',
          workerId: 'w1',
          weekId: 'week1',
          status: AssignmentStatus.PENDING,
          completedAt: null,
          verifierId: null,
          verifiedAt: null,
          rejectionNotes: null,
          completionEvidence: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          choreId: 'c2',
          workerId: 'w1',
          weekId: 'week1',
          status: AssignmentStatus.PENDING,
          completedAt: null,
          verifierId: null,
          verifiedAt: null,
          rejectionNotes: null,
          completionEvidence: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          choreId: 'c3',
          workerId: 'w1',
          weekId: 'week1',
          status: AssignmentStatus.VERIFICATION_NEEDED,
          completedAt: new Date().toISOString(),
          verifierId: null,
          verifiedAt: null,
          rejectionNotes: null,
          completionEvidence: 'evidence.jpg',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          updatedAt: new Date().toISOString()
        }
      ];
      loading.value = false;
    }, 1000);
  } catch (err: any) {
    console.error('Failed to fetch assignments:', err);
    error.value = 'Failed to load your chores';
    loading.value = false;
  }
}

function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();

  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}
</script>

<style scoped>
.worker-dashboard {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
  margin-bottom: 2rem;
  color: var(--text-color);
}

h2 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.dashboard-summary {
  margin-bottom: 2rem;
  padding: 1.5rem;
}

.summary-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.8;
}

.chores-section {
  margin-bottom: 2rem;
}

.loading-indicator {
  padding: 2rem;
  text-align: center;
  color: var(--text-color);
  opacity: 0.7;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  background-color: var(--card-background);
  border: 1px dashed var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-color);
  opacity: 0.7;
}

.chore-placeholder {
  padding: 2rem;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 0.5rem;
  color: var(--text-color);
  opacity: 0.7;
}

@media (max-width: 640px) {
  .summary-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .stat-item {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
}
</style>
