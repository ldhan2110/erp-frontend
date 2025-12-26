<script setup>
import { computed, defineAsyncComponent } from 'vue';

const props = defineProps({
  route: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
});

// Component mapping based on route
const componentMap = {
  '/dashboard/overview': () => import('./DashboardOverview.vue'),
  '/dashboard/analytics': () => import('./DashboardAnalytics.vue'),
  '/products/list': () => import('./ProductsList.vue'),
  '/products/categories': () => import('./ProductsCategories.vue'),
  '/products/inventory': () => import('./ProductsInventory.vue'),
  '/orders/list': () => import('./OrdersList.vue'),
  '/orders/pending': () => import('./OrdersPending.vue'),
  '/orders/completed': () => import('./OrdersCompleted.vue'),
  '/customers/list': () => import('./CustomersList.vue'),
  '/customers/groups': () => import('./CustomersGroups.vue'),
  '/reports/sales': () => import('./ReportsSales.vue'),
  '/reports/products': () => import('./ReportsProducts.vue'),
  '/settings': () => import('./Settings.vue')
};

// Get component or return placeholder
const component = computed(() => {
  const loader = componentMap[props.route];
  if (loader) {
    return defineAsyncComponent({
      loader: loader,
      loadingComponent: defineAsyncComponent(() => import('./TabPlaceholder.vue')),
      errorComponent: defineAsyncComponent(() => import('./TabPlaceholder.vue')),
      delay: 200,
      timeout: 3000
    });
  }
  return defineAsyncComponent(() => import('./TabPlaceholder.vue'));
});
</script>

<template>
  <component :is="component" :route="route" :label="label" />
</template>

