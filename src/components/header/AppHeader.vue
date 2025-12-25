<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Menu from 'primevue/menu';

const props = defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false
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

const { t, locale } = useI18n();

const languages = [
  { label: 'English', value: 'en', flag: '🇺🇸' },
  { label: 'Tiếng Việt', value: 'vi', flag: '🇻🇳' }
];

const currentLanguage = computed(() => {
  return languages.find(lang => lang.value === locale.value) || languages[0];
});

const changeLanguage = (lang) => {
  locale.value = lang.value;
};

const userMenu = ref();
const userMenuItems = computed(() => [
  {
    label: t('template.personal_info'),
    icon: 'pi pi-user',
    command: () => {
      // Handle personal info
      console.log('Personal Info');
    }
  },
  {
    label: t('template.favorites'),
    icon: 'pi pi-star',
    command: () => {
      // Handle favorites
      console.log('Favorites');
    }
  },
  {
    separator: true
  },
  {
    label: t('template.log_out'),
    icon: 'pi pi-sign-out',
    command: () => {
      // Handle logout
      console.log('Logout');
    }
  }
]);

const languageMenu = ref();
const languageMenuItems = computed(() => 
  languages.map(lang => ({
    label: `${lang.flag} ${lang.label}`,
    command: () => changeLanguage(lang)
  }))
);

const toggleLanguageMenu = (event) => {
  languageMenu.value.toggle(event);
};

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

const toggleSidebar = () => {
  // On desktop, toggle collapse/expand when sidebar is open
  // On mobile, toggle open/close
  if (props.isDesktop && props.sidebarOpen) {
    emit('toggle-collapse');
  } else {
    emit('toggle-sidebar');
  }
};
</script>

<template>
  <header class="p-header">
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
          <div class="p-header-logo">
            <div class="p-header-logo-icon">
              <i class="pi pi-building"></i>
            </div>
            <div class="p-header-title">
              <h1 class="p-header-title-text">
                {{ t('app.title') }}
              </h1>
              <p class="p-header-title-description">
                {{ t('app.description') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right Section: Language Switcher and User Menu -->
        <div class="p-header-right">
          <!-- Language Switcher -->
          <Menu 
            ref="languageMenu" 
            :model="languageMenuItems" 
            popup
            class="p-language-menu"
          />
          <Button
            type="button"
            :label="currentLanguage.flag"
            severity="secondary"
            text
            size="small"
            @click="toggleLanguageMenu"
            :title="currentLanguage.label"
            class="p-language-button"
          />

          <!-- User Menu -->
          <Menu 
            ref="userMenu" 
            :model="userMenuItems" 
            popup
            class="p-user-menu"
          />
          <Button
            type="button"
            icon="pi pi-user"
            severity="secondary"
            text
            rounded
            size="small"
            @click="toggleUserMenu"
            :title="t('template.personal_info')"
            class="p-user-button"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.p-header {
  background: var(--p-surface-0);
  border-bottom: 1px solid var(--p-surface-border);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
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
    padding: 0 2rem;
  }
}

.p-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.p-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.p-header-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.p-header-logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--p-primary-color);
  border-radius: var(--p-border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.p-header-logo-icon i {
  color: var(--p-primary-color-text);
  font-size: 1.25rem;
}

.p-header-title {
  display: flex;
  flex-direction: column;
}

.p-header-title-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--p-text-color);
  line-height: 1.25;
  margin: 0;
}

.p-header-title-description {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  line-height: 1.25;
  margin: 0;
  display: none;
}

@media (min-width: 640px) {
  .p-header-title-description {
    display: block;
  }
}

.p-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.p-sidebar-toggle,
.p-language-button,
.p-user-button {
  color: var(--p-text-color-secondary);
}

.p-sidebar-toggle:hover,
.p-language-button:hover,
.p-user-button:hover {
  background: var(--p-surface-hover);
  color: var(--p-text-color);
}
</style>
