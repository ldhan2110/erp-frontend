<script setup>
import Button from 'primevue/button';
import UserMenu from './items/UserMenu.vue';
import HeaderSearch from './items/HeaderSearch.vue';
import HeaderLogo from './items/HeaderLogo.vue';
import { useLocale } from '@/composables';

const { t } = useLocale();

const props = defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false,
  },
  sidebarCollapsed: {
    type: Boolean,
    default: false
  },
  isDesktop: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle-sidebar', 'toggle-collapse']);

const toggleSidebar = () => {
  // On desktop, toggle collapse/expand when sidebar is open
  // On mobile, toggle open/close
  if (props.isDesktop && props.sidebarOpen) {
    emit('toggle-collapse');
  } else {
    emit('toggle-sidebar');
  }
};

const handleManual = () => {
  // TODO: Implement manual functionality
  console.log('Manual clicked');
};

const handleDictionary = () => {
  // TODO: Implement dictionary functionality
  console.log('Dictionary clicked');
};
</script>

<template>
  <header 
    class="p-header"
    :class="{
      'sidebar-open': isDesktop && sidebarOpen,
      'sidebar-collapsed': isDesktop && sidebarOpen && sidebarCollapsed
    }"
  >
    <div class="p-header-container">
      <div class="p-header-content">
        <!-- Logo and Title Section -->
        <div class="p-header-left">
          <!-- Sidebar Toggle Button -->
          <Button
            type="button"
            icon="pi pi-bars"
            severity="secondary"
            text
            rounded
            size="small"
            @click="toggleSidebar"
            class="p-sidebar-toggle"
            :title="isDesktop && sidebarOpen 
              ? (sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar')
              : (sidebarOpen ? 'Close Sidebar' : 'Open Sidebar')"
          />
        </div>

        <HeaderLogo />

        <!-- Center Section: Search -->
        <div class="p-header-center">
          <HeaderSearch />
        </div>

        <!-- Right Section: Manual, Dictionary, and User Menu -->
        <div class="p-header-right">
          <Button
            v-tooltip.top="t('template.show_manual')"
            type="button"
            icon="pi pi-book"
            severity="secondary"
            size="small"
            @click="handleManual"
            class="p-user-button"
            :title="t('template.show_manual')"
          />
          <Button
            v-tooltip.top="t('template.show_dictionary')"
            type="button"
            icon="pi pi-bookmark"
            severity="secondary"
            size="small"
            @click="handleDictionary"
            class="p-user-button"
            :title="t('template.show_dictionary')"
          />
          <UserMenu />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.p-header {
  background: linear-gradient(135deg, var(--p-surface-0) 0%, var(--p-surface-50) 100%);
  border-bottom: 1px solid var(--p-surface-border);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
}

/* Box shadow at the bottom of header, not over sidebar */
.p-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15), 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

/* On desktop, clip the shadow to exclude sidebar area when open */
@media (min-width: 1024px) {
  .p-header.sidebar-open:not(.sidebar-collapsed)::after {
    clip-path: polygon(16rem 0, 100% 0, 100% 100%, 16rem 100%);
  }
  
  .p-header.sidebar-collapsed::after {
    clip-path: polygon(4rem 0, 100% 0, 100% 100%, 4rem 100%);
  }
  
  .p-header:not(.sidebar-open)::after {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}

.p-header-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .p-header-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .p-header-container {
    padding: 0 1rem;
  }
}

.p-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.5rem;
  gap: 1rem;
}

.p-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 0 0 auto;
  min-width: 0;
}

.p-header-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .p-header-center {
    display: none;
  }
}

.p-header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 0 0 auto;
}

.p-sidebar-toggle {
  color: var(--p-text-color-secondary);
  transition: all 0.3s ease;
  position: relative;
}

.p-sidebar-toggle::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--p-primary-color);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  z-index: 0;
}

.p-sidebar-toggle:hover::after {
  opacity: 0.1;
  transform: scale(1);
}

.p-sidebar-toggle:hover {
  background: var(--p-surface-hover);
  color: var(--p-primary-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.p-sidebar-toggle:active {
  transform: translateY(0);
}

.p-user-button {
  color: var(--p-text-color-secondary);
  transition: all 0.3s ease;
  position: relative;
  min-width: 2.5rem;
  height: 2.5rem;
}

.p-user-button::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--p-primary-color);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  z-index: 0;
}

.p-user-button:hover::after {
  opacity: 0.1;
  transform: scale(1);
}

.p-user-button:hover {
  background: var(--p-surface-hover);
  color: var(--p-primary-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.p-user-button:active {
  transform: translateY(0);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .p-header-content {
    height: 4rem;
  }
}
</style>
