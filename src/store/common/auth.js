import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient, API_ENDPOINTS } from '@/config/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('auth_token') || null);
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value);

  // Initialize auth state from localStorage
  const initAuth = () => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken) {
      token.value = storedToken;
      // Set axios default header for API requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch (e) {
        console.error('Failed to parse stored user data:', e);
        localStorage.removeItem('auth_user');
      }
    }
  };

  const login = async (username, password, rememberMe = false) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        user_id: username,
        password
      });

      // Check if login was successful
      if (response.data && (response.data.success === true || response.data.user?.STATUS === 'OK')) {
        // Extract token from response body
        const authToken = response.data.data.token;

        // If token found, store it
        if (authToken) {
          token.value = authToken;
          localStorage.setItem('auth_token', authToken);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        }

        // Store user data from response.user object
        await getUserInfo();

        return { success: true, message: response.data.message };
      } else {
        // Handle error response
        const errorMessage = response.data?.message || response.data?.MESSAGE || 'Login failed. Please check your credentials.';
        error.value = errorMessage;
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      // Handle network/API errors
      const errorMessage = 
        err.response?.data?.message ||
        err.response?.data?.MESSAGE ||
        err.message ||
        'Login failed. Please try again.';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const getUserInfo = async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.USER_INFO);
    const userData = response.data || {};
    user.value = {
      PK: userData.PK,
      username: userData.USER_NAME,
      userName: userData.USER_NAME,
      thrAbempPk: userData.THR_ABEMP_PK,
      orgNm: userData.ORG_NM,
      roleNm: userData.ROLE_NM,
      sysadminYn: userData.SYSADMIN_YN,
      tcoCompanyPk: userData.TCO_COMPANY_PK,
      tcoOrgPk: userData.TCO_ORG_PK,
      hrLevel: userData.HR_LEVEL,
      userLanguage: userData.USER_LANGUAGE,
      empId: userData.EMP_ID,
      announceYn: userData.ANNOUNCE_YN,
      orgId: userData.ORG_ID,
      pk: userData.PK,
      prLevel: userData.PR_LEVEL,
      salarySecurity: userData.SALARY_SECURITY,
      logo: userData.LOGO,
      // Store full user object for reference
      _raw: userData
    };

    localStorage.setItem('auth_user', JSON.stringify(user.value));
  };

  const checkAuth = async () => {
    if (!token.value) {
      return false;
    }

    try {
      // Optionally verify token with backend
      // const response = await apiClient.get('/auth/verify');
      // return response.data.valid;
      return true;
    } catch (err) {
      logout();
      return false;
    }
  };

  // Initialize on store creation
  initAuth();

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    getUserInfo,
    initAuth
  };
});

