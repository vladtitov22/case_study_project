import { createRouter, createWebHistory } from 'vue-router';
import MainClientList from '@/components/MainClientList.vue';
import LoginComponent from '../components/LoginComponent.vue';
import RegistrationEditor from '../components/RegistrationEditor.vue';
import EditorDashboard from '../components/EditorDashboard.vue';
import UserManagement from '../components/UserManagement.vue';
import CaseStudiesManagement from '../components/CaseStudiesManagement.vue';


const routes = [
  { path: '/',  name: 'MainClientList', component: MainClientList},
  { path: '/login', component: LoginComponent },
  { path: '/register', component: RegistrationEditor },
  { path: '/dashboard/editor', component: EditorDashboard },
  { path: '/dashboard/editor/usermanagement', component: UserManagement },
  { path: '/dashboard/editor/casemanagement', component: CaseStudiesManagement }
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;