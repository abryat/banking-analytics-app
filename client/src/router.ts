import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import AnalysisPage from './components/AnalysisPage.vue';
import AnalysisSetup from './components/AnalysisSetup.vue';

const routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/setup',
    component: AnalysisSetup,
  },
  {
    path: '/analysis',
    component: AnalysisPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;