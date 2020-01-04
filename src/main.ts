import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import App from './App.vue';
import store from './store';
import router from './router';

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
