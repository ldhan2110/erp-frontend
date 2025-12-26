import { computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@store/common/auth';

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();

  const login = async (username, password, rememberMe = false) => {
    const result = await authStore.login(username, password, rememberMe);
    
    if (result.success) {
      // Wait for Vue reactivity to update and ensure token is in localStorage
      await nextTick();
      
      // Double-check that token is set before navigating
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Ensure store state is updated
        authStore.initAuth();
        
        // Small delay to ensure all state updates are complete
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Use replace instead of push to avoid adding login to history
        try {
          await router.replace('/');
        } catch (error) {
          console.error('Navigation error:', error);
          // Fallback: use window.location as last resort
          window.location.href = '/';
        }
      } else {
        console.error('Login succeeded but token not found in localStorage');
      }
    }
    
    return result;
  };

  const logout = () => {
    authStore.logout();
    router.push('/login');
  };

  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const user = computed(() => authStore.user);
  const loading = computed(() => authStore.loading);
  const error = computed(() => authStore.error);

  return {
    login,
    logout,
    isAuthenticated,
    user,
    loading,
    error,
  };
}

