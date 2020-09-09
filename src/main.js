import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import './registerServiceWorker'
import router from './router/router'
import store from './store/store'

Vue.use(Vuelidate);
import dateFilter from './filters/date.filter'

import 'materialize-css/dist/js/materialize.min'

Vue.config.productionTip = false;

Vue.filter('date', dateFilter); // register filter for Date -  dateFilter

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
