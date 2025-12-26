import { useToast } from 'primevue/usetoast';
import { useLocale } from './useLocale';

export function useShowMessage() {
  const toast = useToast();
  const { t } = useLocale();

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

