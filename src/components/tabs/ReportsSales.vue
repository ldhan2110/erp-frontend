<script setup>
defineProps({
  route: {
    type: String,
    default: '/reports/sales'
  },
  label: {
    type: String,
    default: 'Sales Report'
  }
});
</script>

<template>
  <div class="tab-content-wrapper">
    <div class="tab-placeholder">
      <i class="pi pi-dollar placeholder-icon"></i>
      <h2>Sales Report</h2>
      <p>Sales report content will be displayed here.</p>
    </div>
  </div>
</template>

<style scoped>
.tab-content-wrapper {
  padding: 1.5rem;
  height: 100%;
}

.tab-placeholder {
  background: var(--p-surface-0);
  border-radius: var(--p-border-radius);
  padding: 2rem;
  text-align: center;
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
}

.tab-placeholder p {
  margin: 0.5rem 0;
  color: var(--p-text-color-secondary);
}
</style>

