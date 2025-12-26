<script setup>
defineProps({
  route: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="tab-placeholder">
    <div class="placeholder-content">
      <i class="pi pi-file placeholder-icon"></i>
      <h2>{{ label }}</h2>
      <p>Content for {{ label }} will be displayed here.</p>
      <p class="tab-route">Route: {{ route }}</p>
    </div>
  </div>
</template>

<style scoped>
.tab-placeholder {
  padding: 2rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  max-width: 500px;
}

.placeholder-icon {
  font-size: 3rem;
  color: var(--p-text-color-secondary);
  opacity: 0.5;
  margin-bottom: 1rem;
}

.tab-placeholder h2 {
  margin: 0 0 1rem 0;
  color: var(--p-text-color);
  font-size: 1.5rem;
  font-weight: 600;
}

.tab-placeholder p {
  margin: 0.5rem 0;
  color: var(--p-text-color-secondary);
}

.tab-route {
  font-family: monospace;
  font-size: 0.875rem;
  color: var(--p-text-color-secondary);
  opacity: 0.7;
  margin-top: 1rem;
}
</style>



