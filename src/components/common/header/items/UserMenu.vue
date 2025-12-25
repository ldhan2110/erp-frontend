<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuth } from '@/composables';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import SettingsModal from './SettingsModal.vue';

const { t } = useI18n();
const { logout } = useAuth();

const userMenu = ref();
const settingsModalVisible = ref(false);

const openSettings = () => {
  settingsModalVisible.value = true;
};

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
    label: t('template.settings'),
    icon: 'pi pi-cog',
    command: () => {
      openSettings();
    }
  },
  {
    separator: true
  },
  {
    label: t('template.log_out'),
    icon: 'pi pi-sign-out',
    command: () => {
      logout();
    }
  }
]);

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};
</script>

<template>
  <div class="p-user-menu-wrapper">
    <Menu 
      ref="userMenu" 
      :model="userMenuItems" 
      popup
      class="p-user-menu"
    />
    <Button
      v-tooltip.top="t('template.personal_info')"
      type="button"
      icon="pi pi-user"
      severity="secondary"
      size="small"
      @click="toggleUserMenu"
      :title="t('template.personal_info')"
      class="p-user-button"
    />
    <SettingsModal v-model:visible="settingsModalVisible" />
  </div>
</template>

<style scoped>
.p-user-menu-wrapper {
  display: inline-flex;
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
</style>

