import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

import App from './App.vue'
import router from './router'

import i18n from './i18n';
import { vFocus } from './directives/focus';

const app = createApp(App)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.directive('focus', vFocus);
app.use(pinia);
app.use(ElementPlus);
app.use(router);
app.use(i18n);

document.querySelector('html')?.classList.add('dark');

app.mount('#app')
