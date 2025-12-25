import { ref, onMounted, onUnmounted } from 'vue';

const DESKTOP_BREAKPOINT = 1024;

/**
 * Composable for managing sidebar state and behavior
 * Handles responsive sidebar behavior (desktop vs mobile)
 */
export function useSidebar() {
  // Sidebar state
  const sidebarOpen = ref(false);
  const sidebarCollapsed = ref(false);
  const isDesktop = ref(false);

  /**
   * Checks screen size and updates sidebar state accordingly
   * Only adjusts sidebar when crossing the breakpoint
   */
  const checkScreenSize = () => {
    const wasDesktop = isDesktop.value;
    isDesktop.value = window.innerWidth >= DESKTOP_BREAKPOINT;
    
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

  /**
   * Toggles sidebar open/closed state
   * On mobile, when opening sidebar, always expands it fully
   */
  const toggleSidebar = () => {
    const wasOpen = sidebarOpen.value;
    sidebarOpen.value = !sidebarOpen.value;
    
    // On mobile, when opening sidebar, always expand it fully
    if (!isDesktop.value && sidebarOpen.value && !wasOpen) {
      sidebarCollapsed.value = false;
    }
  };

  /**
   * Toggles sidebar collapsed/expanded state
   */
  const toggleCollapse = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  };

  /**
   * Initializes sidebar state based on screen size
   */
  const initializeSidebar = () => {
    isDesktop.value = window.innerWidth >= DESKTOP_BREAKPOINT;
    if (isDesktop.value) {
      sidebarOpen.value = true;
      sidebarCollapsed.value = false;
    } else {
      sidebarCollapsed.value = false; // On mobile, sidebar should be expanded when open
    }
  };

  // Setup resize listener
  onMounted(() => {
    initializeSidebar();
    window.addEventListener('resize', checkScreenSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize);
  });

  return {
    // State
    sidebarOpen,
    sidebarCollapsed,
    isDesktop,
    // Methods
    toggleSidebar,
    toggleCollapse,
  };
}

