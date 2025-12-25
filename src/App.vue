<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import AppHeader from './components/header/AppHeader.vue';
  import AppSidebar from './components/sidebar/AppSidebar.vue';
  
  const { t } = useI18n();
  const options = ref(['One-Way', 'Return']);
  const value = ref('One-Way');
  
  // Sidebar open by default on desktop, closed on mobile
  const sidebarOpen = ref(false);
  const sidebarCollapsed = ref(false);
  const isDesktop = ref(false);
  
  const checkScreenSize = () => {
    const wasDesktop = isDesktop.value;
    isDesktop.value = window.innerWidth >= 1024;
    
    // Only adjust sidebar state when crossing the breakpoint
    if (wasDesktop !== isDesktop.value) {
      if (isDesktop.value) {
        // Switched to desktop - open sidebar, expanded
        sidebarOpen.value = true;
        sidebarCollapsed.value = false;
      } else {
        // Switched to mobile - close sidebar, but keep expanded state for when it opens
        sidebarOpen.value = false;
        sidebarCollapsed.value = false; // Keep expanded so when opened, it shows fully
      }
    }
  };
  
  onMounted(() => {
    isDesktop.value = window.innerWidth >= 1024;
    if (isDesktop.value) {
      sidebarOpen.value = true;
      sidebarCollapsed.value = false;
    } else {
      sidebarCollapsed.value = false; // On mobile, sidebar should be expanded when open
    }
    window.addEventListener('resize', checkScreenSize);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize);
  });
  
  const toggleSidebar = () => {
    const wasOpen = sidebarOpen.value;
    sidebarOpen.value = !sidebarOpen.value;
    
    // On mobile, when opening sidebar, always expand it fully
    if (!isDesktop.value && sidebarOpen.value && !wasOpen) {
      sidebarCollapsed.value = false;
    }
  };
  
  const toggleCollapse = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  };
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
