<script setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useSidebar } from './composables';
  import AppHeader from './components/common/header/AppHeader.vue';
  import AppSidebar from './components/common/sidebar/AppSidebar.vue';
  
  const { t } = useI18n();
  const options = ref(['One-Way', 'Return']);
  const value = ref('One-Way');
  
  // Sidebar management - all logic extracted to composable
  const {
    sidebarOpen,
    sidebarCollapsed,
    isDesktop,
    toggleSidebar,
    toggleCollapse,
  } = useSidebar();
</script>

<template>
  <div class="app-container">
    <AppHeader 
      :sidebar-open="sidebarOpen"
      :sidebar-collapsed="sidebarCollapsed"
      :is-desktop="isDesktop"
      @toggle-sidebar="toggleSidebar"
      @toggle-collapse="toggleCollapse"
    />
    <div class="app-layout">
      <!-- Backdrop overlay for mobile -->
      <div 
        v-if="sidebarOpen"
        class="app-sidebar-backdrop"
        @click="toggleSidebar"
      ></div>
      <AppSidebar 
        v-model="sidebarOpen" 
        :collapsed="sidebarCollapsed"
      />
      <main 
        class="app-main"
        :class="{ 
          'app-main-sidebar-open': sidebarOpen && !sidebarCollapsed,
          'app-main-sidebar-collapsed': sidebarOpen && sidebarCollapsed
        }"
      >
        <div class="app-main-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <!-- Using i18n with t() function -->
              <Button :label="t('common.verify')" />
              <SelectButton v-model="value" :options="options" />
              
              <!-- Example of using i18n in template -->
              <p>{{ t('welcome') }}</p>
              <p>{{ t('hello', { name: 'User' }) }}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: var(--p-surface-ground);
  display: flex;
  flex-direction: column;
}

.app-layout {
  display: flex;
  flex: 1;
  position: relative;
}

.app-main {
  flex: 1;
  transition: margin-left 0.3s ease-in-out;
  min-height: calc(100vh - 4rem);
  width: 100%;
  margin-top: 4rem;
}

.app-main-content {
  width: 100%;
}

/* Backdrop overlay for mobile */
.app-sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 35;
  display: none;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* On mobile, sidebar overlays, so no margin needed */
@media (max-width: 1023px) {
  .app-main {
    margin-left: 0;
  }
  
  .app-sidebar-backdrop {
    display: block;
  }
}

/* On larger screens, no backdrop needed */
@media (min-width: 1024px) {
  .app-sidebar-backdrop {
    display: none;
  }
}

/* On larger screens, sidebar pushes content when open */
@media (min-width: 1024px) {
  .app-main {
    margin-left: 0;
    transition: margin-left 0.3s ease-in-out;
  }
  
  .app-main-sidebar-open {
    margin-left: 16rem; /* Sidebar expanded width */
  }
  
  .app-main-sidebar-collapsed {
    margin-left: 4rem; /* Sidebar collapsed width (icons only) */
  }
}
</style>
