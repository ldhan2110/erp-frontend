<script setup>
import { ref } from 'vue';
import AutoComplete from 'primevue/autocomplete';

// Search functionality - all menu items for autocomplete
const searchItems = ref([
  { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard', category: 'Main' },
  { label: 'Overview', icon: 'pi pi-chart-line', route: '/dashboard/overview', category: 'Dashboard' },
  { label: 'Analytics', icon: 'pi pi-chart-bar', route: '/dashboard/analytics', category: 'Dashboard' },
  { label: 'Products', icon: 'pi pi-box', route: '/products', category: 'Main' },
  { label: 'All Products', icon: 'pi pi-list', route: '/products/list', category: 'Products' },
  { label: 'Categories', icon: 'pi pi-tags', route: '/products/categories', category: 'Products' },
  { label: 'Inventory', icon: 'pi pi-database', route: '/products/inventory', category: 'Products' },
  { label: 'Orders', icon: 'pi pi-shopping-cart', route: '/orders', category: 'Main' },
  { label: 'All Orders', icon: 'pi pi-list', route: '/orders/list', category: 'Orders' },
  { label: 'Pending Orders', icon: 'pi pi-clock', route: '/orders/pending', category: 'Orders' },
  { label: 'Completed Orders', icon: 'pi pi-check-circle', route: '/orders/completed', category: 'Orders' },
  { label: 'Customers', icon: 'pi pi-users', route: '/customers', category: 'Main' },
  { label: 'All Customers', icon: 'pi pi-list', route: '/customers/list', category: 'Customers' },
  { label: 'Customer Groups', icon: 'pi pi-users', route: '/customers/groups', category: 'Customers' },
  { label: 'Reports', icon: 'pi pi-file', route: '/reports', category: 'Main' },
  { label: 'Sales Report', icon: 'pi pi-dollar', route: '/reports/sales', category: 'Reports' },
  { label: 'Product Report', icon: 'pi pi-box', route: '/reports/products', category: 'Reports' },
  { label: 'Settings', icon: 'pi pi-cog', route: '/settings', category: 'Main' }
]);

const searchQuery = ref('');
const filteredSearchItems = ref([]);

const search = (event) => {
  const query = event.query.toLowerCase();
  if (!query) {
    filteredSearchItems.value = [];
    return;
  }
  
  filteredSearchItems.value = searchItems.value.filter(item => 
    item.label.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );
};

const onSearchSelect = (event) => {
  const selectedItem = event.value;
  if (selectedItem && selectedItem.route) {
    console.log('Navigate to:', selectedItem.route);
    // You can use Vue Router here: router.push(selectedItem.route)
    searchQuery.value = '';
  }
};
</script>

<template>
  <div class="p-header-search-wrapper">
    <i class="pi pi-search p-header-search-icon"></i>
    <AutoComplete
      v-model="searchQuery"
      :suggestions="filteredSearchItems"
      @complete="search"
      @item-select="onSearchSelect"
      placeholder="Search programs, features..."
      class="p-header-search"
      inputClass="p-header-search-input"
      panelClass="p-header-search-panel"
      :showEmptyMessage="true"
      emptyMessage="No results found"
    >
      <template #item="slotProps">
        <div class="p-header-search-item">
          <i :class="slotProps.item.icon" class="p-header-search-item-icon"></i>
          <div class="p-header-search-item-content">
            <div class="p-header-search-item-label">{{ slotProps.item.label }}</div>
            <div class="p-header-search-item-category">{{ slotProps.item.category }}</div>
          </div>
        </div>
      </template>
    </AutoComplete>
  </div>
</template>

<style scoped>
.p-header-search-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.p-header-search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--p-text-muted-color);
  font-size: 1rem;
  pointer-events: none;
  z-index: 2;
  transition: color 0.3s ease;
}

.p-header-search-wrapper:focus-within .p-header-search-icon {
  color: var(--p-primary-color);
}

.p-header-search {
  width: 100%;
}

:deep(.p-header-search-input) {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.75rem;
  border-radius: 12px;
  border: 1px solid var(--p-surface-border);
  background: var(--p-surface-0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  font-size: 0.9375rem;
}

:deep(.p-header-search-input:focus) {
  outline: none;
  border-color: var(--p-primary-color);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.08);
  background: var(--p-surface-0);
}

:deep(.p-header-search-input::placeholder) {
  color: var(--p-text-muted-color);
}

:deep(.p-header-search-panel) {
  margin-top: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--p-surface-border);
  overflow: hidden;
  background: var(--p-surface-0);
  animation: fadeIn 0.2s ease;
}

.p-header-search-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--p-surface-100);
}

.p-header-search-item:last-child {
  border-bottom: none;
}

.p-header-search-item:hover {
  background: var(--p-surface-hover);
}

.p-header-search-item-icon {
  font-size: 1.125rem;
  color: var(--p-primary-color);
  width: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.p-header-search-item-content {
  flex: 1;
  min-width: 0;
}

.p-header-search-item-label {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--p-text-color);
  margin-bottom: 0.125rem;
}

.p-header-search-item-category {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  font-weight: 400;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

