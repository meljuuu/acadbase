import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/components/Dashboard.vue";
import Masterlist from "@/components/Masterlist.vue";
import History from "@/components/History.vue";
import Main from "@/Main.vue";

const routes = [
  {
    path: "/",
    component: Main,
    children: [
      { path: "dashboard", component: Dashboard },
      { path: "masterlist", component: Masterlist },
      { path: "history", component: History },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
