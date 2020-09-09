import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import dateFilter from './filters/date.filter'
import messagePlugin from './utilites/message.plugin'

import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'

Vue.config.productionTip = false;

Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.filter('date', dateFilter); // register filter for Date -  dateFilter



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
