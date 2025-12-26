<script setup>
import { useLocale } from '@/composables';

const { t } = useLocale();
</script>

<template>
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
</template>

<style scoped>
.p-header-logo {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  transition: transform 0.2s ease;
}

.p-header-logo:hover {
  transform: translateY(-1px);
}

.p-header-logo-icon {
  width: 2.75rem;
  height: 2.75rem;
  background: linear-gradient(135deg, var(--p-primary-color) 0%, var(--p-primary-color) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.p-header-logo-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.p-header-logo:hover .p-header-logo-icon::before {
  left: 100%;
}

.p-header-logo:hover .p-header-logo-icon {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1);
}

.p-header-logo-icon i {
  color: var(--p-primary-color-text);
  font-size: 1.375rem;
  z-index: 1;
  position: relative;
}

.p-header-title {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.p-header-title-text {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--p-text-color) 0%, var(--p-primary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  margin: 0;
  letter-spacing: -0.02em;
}

.p-header-title-description {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  line-height: 1.25;
  margin: 0;
  display: none;
  font-weight: 500;
}

@media (min-width: 640px) {
  .p-header-title-description {
    display: block;
  }
}

@media (max-width: 1024px) {
  .p-header-logo-icon {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .p-header-title-text {
    font-size: 1.125rem;
  }
}
</style>

