<!-- src/components/admin/HalResourceExplorer.vue -->
<template>
  <div class="hal-explorer">
    <h2>API Resource Explorer</h2>

    <div class="available-resources">
      <h3>Available Resources</h3>
      <ul class="resource-list">
        <li v-for="(link, rel) in rootLinks" :key="rel">
          <button @click="exploreResource(rel, link)">
            {{ formatRelName(rel) }}
          </button>
        </li>
      </ul>
    </div>

    <div v-if="currentResource" class="resource-details">
      <h3>{{ formatRelName(currentResourceRel) }}</h3>

      <div class="resource-content">
        <pre>{{ JSON.stringify(currentResource, null, 2) }}</pre>
      </div>

      <div v-if="resourceLinks.length > 0" class="resource-links">
        <h4>Related Resources</h4>
        <ul>
          <li v-for="(link, rel) in resourceLinks" :key="rel">
            <button @click="followLink(rel, link)">
              {{ formatRelName(rel) }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import halNavigator from '@/services/api/halNavigator';

const rootLinks = ref({});
const currentResource = ref(null);
const currentResourceRel = ref('');

onMounted(async () => {
  await halNavigator.initialize();
  rootLinks.value = halNavigator.links;
});

const resourceLinks = computed(() => {
  if (!currentResource.value || !currentResource.value._links) {
    return [];
  }

  const links = {...currentResource.value._links};
  delete links.self;
  return links;
});

const formatRelName = (rel) => {
  return rel.replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/-/g, ' ');
};

const exploreResource = async (rel, link) => {
  try {
    currentResource.value = await halNavigator.followLink(rel);
    currentResourceRel.value = rel;
  } catch (error) {
    console.error('Failed to explore resource:', error);
  }
};

const followLink = async (rel, link) => {
  try {
    currentResource.value = await apiClient.get(link.href).then(res => res.data);
    currentResourceRel.value = rel;
  } catch (error) {
    console.error('Failed to follow link:', error);
  }
};
</script>
