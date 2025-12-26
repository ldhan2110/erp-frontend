import { useAuthStore } from '@store/common/auth';

export function setupRouterGuards(router) {
  router.beforeEach((to, from, next) => {
    // Check localStorage directly first (synchronous and reliable)
    const token = localStorage.getItem('auth_token');
    const hasToken = !!token;
    
    // Also check store for consistency
    const authStore = useAuthStore();
    const storeIsAuthenticated = authStore.isAuthenticated;
    const isAuthenticated = hasToken || storeIsAuthenticated;
    const isLoginPage = to.path === '/login';

    // Debug logging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Router Guard:', {
        to: to.path,
        hasToken,
        storeIsAuthenticated,
        isAuthenticated,
        token: token ? `${token.substring(0, 20)}...` : 'none'
      });
    }

    // If trying to access login page while authenticated, redirect to home
    if (isLoginPage && isAuthenticated) {
      next('/');
      return;
    }

    // If trying to access protected route while not authenticated, redirect to login
    if (!isLoginPage && !isAuthenticated) {
      next('/login');
      return;
    }

    next();
  });
}

