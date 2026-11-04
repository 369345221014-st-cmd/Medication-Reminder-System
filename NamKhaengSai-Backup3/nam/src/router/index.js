import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import MedicationsPage from '../pages/ProductsPage.vue';
import MedicationDetailPage from '../pages/ProductDetailPage.vue';
import MedicationSummaryPage from '../pages/CartPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import AdminPage from '../pages/AdminPage.vue';
import ImpactPage from '../pages/ImpactPage.vue';
import { user, authReady } from '../store.js';

const routes = [
  { path: '/', component: HomePage },
  { path: '/medications', component: MedicationsPage },
  { path: '/medication/:id', component: MedicationDetailPage },
  { path: '/summary', component: MedicationSummaryPage },
  { path: '/login', component: LoginPage },
  // 🔒 ล็อกให้เฉพาะแอดมินที่ล็อกอินแล้วเท่านั้นถึงจะเข้าถึงได้
  { path: '/impact', component: ImpactPage, meta: { requiresLogin: true } },
  { path: '/admin', component: AdminPage, meta: { requiresLogin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (to.meta.requiresLogin) {
    await authReady;
    if (!user.value) {
      return '/login';
    }
  }
});

router.afterEach(() => {
  document.getElementById('main')?.focus();
});

export default router;