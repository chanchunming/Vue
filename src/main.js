const { createApp } = require('vue');
import App from './App.vue';
import VueGoogleMaps from '@fawmi/vue-google-maps';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

const app = createApp(App);
app.component('EasyDataTable', Vue3EasyDataTable);
app.use(VueGoogleMaps, {
  load: {
    key: '',
    libraries: 'places',
  },
});
app.mount('#app');
