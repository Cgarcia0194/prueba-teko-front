import Vue from 'vue';
import App from '@/App.vue';
import VueRouter from 'vue-router';
import vuetify from '@/plugins/vuetify';
import auth from '@/helpers/auth';
import { api } from "@/helpers/api";
import useMenu from '@/helpers/menu';
import $ from "jquery";
import { VueMaskDirective } from 'v-mask';
import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'

exportingInit(Highcharts)

Vue.directive('mask', VueMaskDirective);
Vue.config.productionTip = false;

const { state } = auth();
const { menu } = useMenu();

Vue.use(VueRouter, HighchartsVue);
let routes = [];

api.post('general/consultar-plantillas').then(({ data }) => {
  switch (data.status) {
    case "success":
      $.each(data.items, (i, data) => {
        if (data.es_menu == "No") {
          let node = {
            path: data.path,
            name: data.name,
            meta: {
              requiresAuth: true,
              description: data.descripcion
            },
            component: () => import(`@/${data.component}.vue`)
          };

          routes.push(node);
        }
      });
      break;
    default:
      break;
  }

  const router = new VueRouter({
    routes,
    mode: "history"
  });

  router.addRoutes(menu);

  router.beforeEach((to, from, next) => {
    if ((to.meta.requiresAuth || to.name == undefined) && (state.user == null || state.token == undefined)) {
      next({ name: "Login", replace: true });
    } else if (to.name == 'Login' && state.user != null) {
      next({ name: "Inicio", replace: true });
    } else {
      next();
    }
  });

  new Vue({
    router,
    vuetify,
    render: h => h(App)
  }).$mount('#app');
});