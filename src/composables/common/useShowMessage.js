import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

export function useShowMessage() {
  const toast = useToast();
  const { t } = useI18n();

  const showInfo = (message) => {
    toast.add({
      severity: 'info',
      summary: 'Info',
      detail: t(message),
      life: 3000
    });
  };

  const showError = (message) => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: t(message),
      life: 3000
    });
  };

  const showSuccess = (message) => {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: t(message),
      life: 3000
    });
  };

  return {
    showInfo,
    showError,
    showSuccess
  };
}

