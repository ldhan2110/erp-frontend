<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Panel: Branding & Image -->
      <div class="login-left-panel">
        <div class="login-branding">
          <div class="brand-logo">
            <i class="pi pi-building" style="font-size: 4rem; color: white;"></i>
          </div>
          <h1 class="brand-title">{{ t('app.title') }}</h1>
          <p class="brand-tagline">{{ t('login.tagline') }}</p>
          <p class="brand-description">{{ t('login.description') }}</p>
          
          <!-- Decorative elements -->
          <div class="brand-decoration">
            <div class="decoration-circle decoration-circle-1"></div>
            <div class="decoration-circle decoration-circle-2"></div>
            <div class="decoration-circle decoration-circle-3"></div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Login Form -->
      <div class="login-right-panel">
        <div class="login-form-container">
          <div class="login-form-header">
            <h2 class="login-title">{{ t('login.title') }}</h2>
            <p class="login-subtitle">{{ t('login.subtitle') }}</p>
          </div>

          <!-- Error Message -->
          <Message 
            v-if="error" 
            severity="error" 
            :closable="false"
            class="login-error-message"
          >
            {{ error }}
          </Message>

          <form @submit.prevent="handleSubmit" class="login-form">
            <!-- Username Field -->
            <div class="form-field">
              <label for="username" class="form-label">
                <i class="pi pi-user form-icon"></i>
                {{ t('login.username') }}
              </label>
              <InputText
                id="username"
                v-model="form.username"
                :placeholder="t('login.username')"
                :class="{ 'p-invalid': errors.username }"
                class="form-input"
                autocomplete="username"
                @blur="validateField('username')"
              />
              <small v-if="errors.username" class="form-error">
                {{ errors.username }}
              </small>
            </div>

            <!-- Password Field -->
            <div class="form-field">
              <label for="password" class="form-label">
                <i class="pi pi-lock form-icon"></i>
                {{ t('login.password') }}
              </label>
              <Password
                id="password"
                v-model="form.password"
                :placeholder="t('login.password')"
                :class="{ 'p-invalid': errors.password }"
                class="form-input"
                :feedback="false"
                toggleMask
                autocomplete="current-password"
                @blur="validateField('password')"
              />
              <small v-if="errors.password" class="form-error">
                {{ errors.password }}
              </small>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="form-options">
              <div class="form-checkbox">
                <Checkbox
                  id="rememberMe"
                  v-model="form.rememberMe"
                  :binary="true"
                />
                <label for="rememberMe" class="checkbox-label">
                  {{ t('login.rememberMe') }}
                </label>
              </div>
              <a href="#" class="forgot-password-link" @click.prevent="handleForgotPassword">
                {{ t('login.forgotPassword') }}
              </a>
            </div>

            <!-- Submit Button -->
            <Button
              type="submit"
              :label="loading ? t('login.submitting') : t('login.submit')"
              :loading="loading"
              :disabled="loading"
              class="login-submit-button"
              size="large"
            />
          </form>

          <!-- Footer -->
          <div class="login-footer">
            <p class="footer-text">
              © {{ new Date().getFullYear() }} {{ t('app.title') }}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useLocale, useAuth } from '@/composables';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Message from 'primevue/message';

const { t } = useLocale();
const { login, loading, error } = useAuth();

const form = reactive({
  username: '',
  password: '',
  rememberMe: false,
});

const errors = reactive({
  username: '',
  password: '',
});

const validateField = (field) => {
  if (field === 'username') {
    errors.username = form.username.trim() ? '' : t('login.usernameRequired');
  } else if (field === 'password') {
    errors.password = form.password ? '' : t('login.passwordRequired');
  }
};

const validateForm = () => {
  let isValid = true;
  
  if (!form.username.trim()) {
    errors.username = t('login.usernameRequired');
    isValid = false;
  } else {
    errors.username = '';
  }
  
  if (!form.password) {
    errors.password = t('login.passwordRequired');
    isValid = false;
  } else {
    errors.password = '';
  }
  
  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  await login(form.username, form.password, form.rememberMe);
};

const handleForgotPassword = () => {
  // TODO: Implement forgot password functionality
  console.log('Forgot password clicked');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.login-container {
  width: 100%;
  max-width: 1200px;
  height: 90vh;
  max-height: 800px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* Left Panel */
.login-left-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  overflow: hidden;
}

.login-left-panel::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: pulse 20s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.login-branding {
  text-align: center;
  color: white;
  position: relative;
  z-index: 2;
}

.brand-logo {
  margin-bottom: 2rem;
  animation: fadeInUp 0.8s ease-out;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.brand-tagline {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 1rem;
  opacity: 0.95;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.brand-description {
  font-size: 1rem;
  opacity: 0.85;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.brand-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 15s ease-in-out infinite;
}

.decoration-circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.decoration-circle-2 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  right: 15%;
  animation-delay: 5s;
}

.decoration-circle-3 {
  width: 100px;
  height: 100px;
  top: 60%;
  left: 20%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* Right Panel */
.login-right-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: white;
  overflow-y: auto;
}

.login-form-container {
  width: 100%;
  max-width: 420px;
}

.login-form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--p-text-color);
  margin-bottom: 0.5rem;
}

.login-subtitle {
  font-size: 1rem;
  color: var(--p-text-color-secondary);
  margin: 0;
}

.login-error-message {
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--p-text-color);
  font-size: 0.9rem;
}

.form-icon {
  color: var(--p-primary-color);
  font-size: 1rem;
}

.form-input {
  width: 100%;
}

.form-input :deep(.p-inputtext),
.form-input :deep(.p-password-input) {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

.form-error {
  color: var(--p-red-500);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  font-size: 0.9rem;
  color: var(--p-text-color-secondary);
  cursor: pointer;
  user-select: none;
}

.forgot-password-link {
  font-size: 0.9rem;
  color: var(--p-primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-password-link:hover {
  color: var(--p-primary-color-text);
  text-decoration: underline;
}

.login-submit-button {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 600;
}

.login-footer {
  margin-top: 2rem;
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid var(--p-surface-border);
}

.footer-text {
  font-size: 0.875rem;
  color: var(--p-text-color-secondary);
  margin: 0;
}

/* Responsive Design */
@media (max-width: 968px) {
  .login-container {
    grid-template-columns: 1fr;
    height: auto;
    max-height: none;
  }

  .login-left-panel {
    display: none;
  }

  .login-right-panel {
    padding: 2rem 1.5rem;
  }

  .login-form-container {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .login-page {
    padding: 0;
    align-items: flex-start;
  }

  .login-container {
    border-radius: 0;
    height: 100vh;
    max-height: none;
  }

  .login-right-panel {
    padding: 1.5rem 1rem;
  }

  .login-title {
    font-size: 1.75rem;
  }

  .brand-title {
    font-size: 2rem;
  }
}

/* Dark mode support */
:global(.dark) .login-right-panel {
  background: var(--p-surface-0);
}

:global(.dark) .login-title,
:global(.dark) .form-label {
  color: var(--p-text-color);
}
</style>

