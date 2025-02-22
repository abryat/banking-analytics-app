import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/VuexTransactionStore';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './assets/styles.scss';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOfBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOfBefore);

const app = createApp(App);
app.use(router);
app.use(store);
app.use(ElementPlus);
app.config.globalProperties.$dayjs = dayjs;

app.mount('#app');
