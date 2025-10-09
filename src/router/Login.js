import LoginView from "@/views/LoginView.vue";

const login = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      layout: 'none'  // 또는 hideLayout: true
    }
  }
];

export default login;
