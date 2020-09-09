import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import dateFilter from './filters/date.filter'
import messagePlugin from './utilites/message.plugin'

import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'

///  FIREBASE  Import
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'


Vue.config.productionTip = false;

Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.filter('date', dateFilter); // register filter for Date -  dateFilter


/// --  https://www.youtube.com/watch?v=CTLonYohENw&list=PLqKQF2ojwm3njNpksFCi8o-_c-9Vva_W0&index=8  - - -
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1cMEs91pSfNE3etXGW-9-ifp5AD-8jBc",
    authDomain: "vue-crmsys.firebaseapp.com",
    databaseURL: "https://vue-crmsys.firebaseio.com",
    projectId: "vue-crmsys",
    storageBucket: "vue-crmsys.appspot.com",
    messagingSenderId: "760279348039",
    appId: "1:760279348039:web:ae6f20269900caa27a1262",
    measurementId: "G-FNDP5TV34G"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// инициализируем Vue если сработала аутентификация в  файрбейз - - -
let app;
firebase.auth().onAuthStateChanged(() => {
    if(!app) { // проверка, чтоб приложение Vue  app  создавалось лиш  один раз )
        app = new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    }
});

