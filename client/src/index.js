import Vue from 'vue';
import App from './App.vue';
import store from './store/index';
import router from './router/index';
import axios from 'axios';
import loading from './components/loading.vue';
import anime from 'animejs';
import io from 'socket.io-client';
import VueChatScroll from 'vue-chat-scroll';
import alert from './mixins/alert';
import icon from './components/app-icon.vue';

Vue.mixin(alert);

Vue.component('loading', loading);
Vue.component('app-icon', icon);

import { domain, clientId, audience } from '../../auth_config.json';

// Import the plugin here
import { Auth0Plugin } from './auth/index.js';
import VueSocket from './modules/Socket';

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: appState => {
    router.push({ name: 'home' });
  },
});

Vue.use(VueChatScroll);

Vue.prototype.$socket = new VueSocket(io);
Vue.prototype.$http = axios;
Vue.prototype.$anime = anime;
Vue.prototype.$eventBus = new Vue();

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
