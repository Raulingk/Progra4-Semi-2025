import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axiosInstance from './plugins/axios';

const app = createApp(App)

app.use(router)

app.provide('axios', axiosInstance);

app.mount('#app')
