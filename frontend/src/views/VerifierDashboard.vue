<template>
  <div class="verifier-dashboard">
    <h1>Verification Dashboard</h1>

    <div class="dashboard-summary card">
      <div class="summary-stats">
        <div class="stat-item">
          <span class="stat-value">{{ pendingVerification.length }}</span>
          <span class="stat-label">Pending Verification</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ verifiedToday }}</span>
          <span class="stat-label">Verified Today</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ rejectedCount }}</span>
          <span class="stat-label">Needs Improvement</span>
        </div>
      </div>
    </div>

    <div class="verification-section">
      <h2>Pending Verification</h2>
      <div v-if="loading" class="loading-indicator">
        Loading verification queue...
      </div>
      <div v-else-if="pendingVerification.length === 0" class="empty-state">
        <p>No chores waiting for verification!</p>
      </div>
      <div v-else class="verification-placeholder">
        <p>Verification interface will be implemented in Phase 2.</p>
        <p>There are {{ pendingVerification.length }} chores waiting for your verification.</p>
      </div>
    </div>

    <div class="verification-section">
      <h2>Recently Verified</h2>
      <div v-if="loading" class="loading-indicator">
        Loading history...
      </div>
      <div v-else-if="recentlyVerified.length === 0" class="empty-state">
        <p>No recently verified chores!</p>
      </div>
      <div v-else class="verification-placeholder">
        <p>Verification history will be implemented in Phase 2.</p>
        <p>You have verified {{ recentlyVerified.length }} chores recently.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import halClient from '@/services/api/halClient.ts';
import type { Assignment, AssignmentStatus } from './types';

// Mock data for initial UI development
const assignments = ref<Assignment[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Computed properties for different verification categories
const pendingVerification = computed(() => {
  return assignments.value.filter(a => 
    a.status === AssignmentStatus.VERIFICATION_NEEDED
  );
});

const recentlyVerified = computed(() => {
  return assignments.value.filter(a => 
    (a.status === AssignmentStatus.VERIFIED || a.status === AssignmentStatus.REJECTED) &&
    a.verifiedAt !== null
  );
});

const verifiedToday = computed(() => {
  return recentlyVerified.value.filter(a => 
    a.status === AssignmentStatus.VERIFIED && isToday(a.verifiedAt!)
  ).length;
});

const rejectedCount = computed(() => {
  return assignments.value.filter(a => a.status === AssignmentStatus.REJECTED).length;
});

onMounted(async () => {
  await fetchVerificationQueue();
});

async function fetchVerificationQueue() {
  loading.value = true;
  error.value = null;

  try {
    // In a real implementation, this would fetch from the API
    // const response = await halClient.get<{ _embedded: { assignments: Assignment[] } }>('/assignments/verification');
    // assignments.value = response._embedded.assignments;

    // Mock data for UI development
    setTimeout(() => {
      assignments.value = [
        {
          id: '1',
          choreId: 'c1',
          workerId: 'w1',
          weekId: 'week1',
          status: AssignmentStatus.VERIFICATION_NEEDED,
          completedAt: new Date().toISOString(),
          verifierId: null,
          verifiedAt: null,
          rejectionNotes: null,
          completionEvidence: 'evidence1.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          choreId: 'c2',
          workerId: 'w2',
          weekId: 'week1',
          status: AssignmentStatus.VERIFICATION_NEEDED,
          completedAt: new Date().toISOString(),
          verifierId: null,
          verifiedAt: null,
          rejectionNotes: null,
          completionEvidence: 'evidence2.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          choreId: 'c3',
          workerId: 'w3',
          weekId: 'week1',
          status: AssignmentStatus.VERIFIED,
          completedAt: new Date().toISOString(),
          verifierId: 'v1',
          verifiedAt: new Date().toISOString(),
          rejectionNotes: null,
          completionEvidence: 'evidence3.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      loading.value = false;
    }, 1000);
  } catch (err: any) {
    console.error('Failed to fetch verification queue:', err);
    error.value = 'Failed to load verification queue';
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
.verifier-dashboard {
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

.verification-section {
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

.verification-placeholder {
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
