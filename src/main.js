import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
  position: POSITION.BOTTOM_CENTER,
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  toastClassName: "custom-toast",
};

const app = createApp(App);
app.use(router);
app.use(Toast, options);
app.mount('#app');