<script setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTabsStore, useAppStore } from '@/store/common';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  collapsed: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const appStore = useAppStore();
const tabsStore = useTabsStore();
const { menuList } = storeToRefs(appStore);

// Console log to see menuList value
watch(menuList, (newVal, oldVal) => {
  console.log('=== MenuList in AppSidebar ===');
  console.log('Old value:', oldVal);
  console.log('New value:', newVal);
  console.log('MenuList length:', newVal?.length);
  console.log('Full menuList object:', JSON.stringify(newVal, null, 2));
}, { immediate: true, deep: true });

// Also log initial value
console.log('=== Initial MenuList in AppSidebar ===');
console.log('Current menuList value:', menuList.value);
console.log('MenuList type:', typeof menuList.value);
console.log('Is array?', Array.isArray(menuList.value));

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const isCollapsed = computed(() => props.collapsed);

// Clear expanded submenus when collapsing
watch(() => props.collapsed, (collapsed) => {
  if (collapsed) {
    expandedItems.value.clear();
  }
});

// Menu items with submenus
const menuItems = ref([
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    route: '/dashboard',
    items: [
      {
        label: 'Overview',
        icon: 'pi pi-chart-line',
        route: '/dashboard/overview'
      },
      {
        label: 'Analytics',
        icon: 'pi pi-chart-bar',
        route: '/dashboard/analytics'
      }
    ]
  },
  {
    label: 'Products',
    icon: 'pi pi-box',
    route: '/products',
    items: [
      {
        label: 'All Products',
        icon: 'pi pi-list',
        route: '/products/list'
      },
      {
        label: 'Categories',
        icon: 'pi pi-tags',
        route: '/products/categories'
      },
      {
        label: 'Inventory',
        icon: 'pi pi-database',
        route: '/products/inventory'
      }
    ]
  },
  {
    label: 'Orders',
    icon: 'pi pi-shopping-cart',
    route: '/orders',
    items: [
      {
        label: 'All Orders',
        icon: 'pi pi-list',
        route: '/orders/list'
      },
      {
        label: 'Pending',
        icon: 'pi pi-clock',
        route: '/orders/pending'
      },
      {
        label: 'Completed',
        icon: 'pi pi-check-circle',
        route: '/orders/completed'
      }
    ]
  },
  {
    label: 'Customers',
    icon: 'pi pi-users',
    route: '/customers',
    items: [
      {
        label: 'All Customers',
        icon: 'pi pi-list',
        route: '/customers/list'
      },
      {
        label: 'Groups',
        icon: 'pi pi-users',
        route: '/customers/groups'
      }
    ]
  },
  {
    label: 'Reports',
    icon: 'pi pi-file',
    route: '/reports',
    items: [
      {
        label: 'Sales Report',
        icon: 'pi pi-dollar',
        route: '/reports/sales'
      },
      {
        label: 'Product Report',
        icon: 'pi pi-box',
        route: '/reports/products'
      }
    ]
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    route: '/settings'
  }
]);

const expandedItems = ref(new Set());

const toggleSubmenu = (item) => {
  if (item.items && item.items.length > 0) {
    if (expandedItems.value.has(item.label)) {
      expandedItems.value.delete(item.label);
    } else {
      expandedItems.value.add(item.label);
    }
  }
};

const isExpanded = (item) => {
  return expandedItems.value.has(item.label);
};

const isLeafItem = (item) => {
  return !item.items || item.items.length === 0;
};

const handleItemClick = (item) => {
  // Check if item is a leaf (no submenu)
  if (isLeafItem(item)) {
    // Add tab for leaf items
    tabsStore.addTab(item);
    // Close sidebar on mobile after selecting
    if (window.innerWidth < 1024) {
      emit('update:modelValue', false);
    }
  } else {
    // For items with submenus, toggle submenu expansion
    if (isCollapsed.value) {
      // If collapsed, expand submenu on click
      toggleSubmenu(item);
    } else {
      // Normal behavior when expanded - toggle submenu
      toggleSubmenu(item);
    }
  }
};
</script>

<template>
  <aside 
    class="app-sidebar"
    :class="{ 
      'app-sidebar-open': isOpen,
      'app-sidebar-collapsed': isCollapsed
    }"
    @click.stop
  >
    <div class="app-sidebar-content">
      <nav class="app-sidebar-nav">
        <ul class="app-sidebar-menu">
          <li 
            v-for="item in menuItems" 
            :key="item.label"
            class="app-sidebar-menu-item"
          >
            <div
              class="app-sidebar-menu-link"
              :class="{ 
                'has-submenu': item.items && item.items.length > 0 && !isCollapsed,
                'expanded': isExpanded(item) && !isCollapsed
              }"
              @click="handleItemClick(item)"
              :title="isCollapsed ? item.label : ''"
            >
              <i v-if="item.icon" :class="item.icon" class="app-sidebar-icon"></i>
              <span v-if="!isCollapsed" class="app-sidebar-label">{{ item.label }}</span>
              <i 
                v-if="item.items && item.items.length > 0 && !isCollapsed"
                class="pi pi-chevron-down app-sidebar-chevron"
                :class="{ 'rotated': isExpanded(item) }"
              ></i>
            </div>
            <transition name="submenu">
              <ul 
                v-if="item.items && item.items.length > 0 && isExpanded(item) && !isCollapsed"
                class="app-sidebar-submenu"
              >
                <li
                  v-for="subItem in item.items"
                  :key="subItem.label"
                  class="app-sidebar-submenu-item"
                >
                  <a
                    href="#"
                    class="app-sidebar-submenu-link"
                    @click.prevent="handleItemClick(subItem)"
                  >
                    <i v-if="subItem.icon" :class="subItem.icon" class="app-sidebar-icon"></i>
                    <span class="app-sidebar-label">{{ subItem.label }}</span>
                  </a>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
.app-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 16rem;
  background: var(--p-surface-0);
  border-right: 1px solid var(--p-surface-border);
  border-top: none;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transform: translateX(-100%);
  transition: width 0.3s ease-in-out, transform 0.3s ease-in-out;
  z-index: 40;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.app-sidebar-open {
  transform: translateX(0);
}

.app-sidebar-collapsed {
  width: 4rem;
}


.app-sidebar-content {
  padding-top: 4rem; /* Account for header height */
  height: 100%;
}

.app-sidebar-nav {
  padding: 1rem 0;
}

.app-sidebar-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.app-sidebar-menu-item {
  margin: 0;
  padding: 0;
}

.app-sidebar-menu-link {
  display: flex;
  align-items: center;
  padding: 0.875rem 1rem;
  color: var(--p-text-color);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  border-left: 3px solid transparent;
  justify-content: flex-start;
  position: relative;
}

.app-sidebar-collapsed .app-sidebar-menu-link {
  justify-content: center;
  padding: 0.875rem 0.5rem;
}

.app-sidebar-collapsed .app-sidebar-menu-link:hover {
  background: var(--p-surface-hover);
}

.app-sidebar-menu-link:hover {
  background: var(--p-surface-hover);
  color: var(--p-text-color);
}

.app-sidebar-menu-link:hover .app-sidebar-icon {
  color: var(--p-text-color);
}

.app-sidebar-menu-link.has-submenu {
  justify-content: space-between;
}

.app-sidebar-icon {
  margin-right: 0.75rem;
  font-size: 1.125rem;
  width: 1.5rem;
  text-align: center;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--p-text-color-secondary);
}

.app-sidebar-collapsed .app-sidebar-icon {
  margin-right: 0;
  font-size: 1rem;
  width: auto;
}

.app-sidebar-label {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-sidebar-chevron {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.app-sidebar-chevron.rotated {
  transform: rotate(180deg);
}

.app-sidebar-submenu {
  list-style: none;
  margin: 0;
  padding: 0;
  background: var(--p-surface-50);
  overflow: hidden;
}

.app-sidebar-submenu-item {
  margin: 0;
  padding: 0;
}

.app-sidebar-submenu-link {
  display: flex;
  align-items: center;
  padding: 0.625rem 1rem 0.625rem 3.5rem;
  color: var(--p-text-color-secondary);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  border-left: 3px solid transparent;
}

.app-sidebar-submenu-link:hover {
  background: var(--p-surface-hover);
  color: var(--p-text-color);
}

.app-sidebar-submenu-link:hover .app-sidebar-icon {
  color: var(--p-text-color);
}

/* Submenu transition */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
}

.submenu-enter-from,
.submenu-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Scrollbar styling */
.app-sidebar::-webkit-scrollbar {
  width: 6px;
}

.app-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.app-sidebar::-webkit-scrollbar-thumb {
  background: var(--p-surface-border);
  border-radius: 3px;
}

.app-sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--p-text-color-secondary);
}

/* Responsive: On larger screens, sidebar behavior */
@media (min-width: 1024px) {
  .app-sidebar {
    position: fixed;
    height: calc(100vh - 4rem);
    top: 4rem;
    z-index: 30;
    border-top: none;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }
  
  .app-sidebar-open {
    transform: translateX(0);
  }
  
  .app-sidebar-content {
    padding-top: 0;
  }
}

/* Match header height on larger screens (header is 4.5rem above 1024px) */
@media (min-width: 1025px) {
  .app-sidebar {
    height: calc(100vh - 4.5rem);
    top: 4.5rem;
  }
}

/* On mobile, always full width when open (ignore collapsed state) */
@media (max-width: 1023px) {
  .app-sidebar {
    width: 16rem !important; /* Always full width on mobile when open */
  }
  
  .app-sidebar-open {
    width: 16rem !important;
  }
}
</style>

