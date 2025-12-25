import { createApp } from 'vue';
import './global.css';
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import App from './App.vue';
import { i18n } from './config';

const app = createApp(App);
app.use(i18n);
app.use(PrimeVue, {
    // Default theme configuration
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.dark',
            cssLayer: false
        }
    },
    unstyled: false
});
app.mount('#app');
