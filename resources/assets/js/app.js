import Vue from 'vue';
import VeeValidate from 'vee-validate';
import {VirtualScroller} from 'vue-virtual-scroller';
import {http, event, CDN} from '@/services';
import App from '@/components/App';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Datetime from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';
import tinymce from 'vue-tinymce-editor';
require('./bootstrap.js')
import KProgress from 'k-progress';
import VueAzureUploader from 'vue-azure-blob-upload';
var VueResource = require('vue-resource');

Vue.use(VueResource);


Vue.component('k-progress', KProgress);

Vue.component('tinymce', tinymce)


Vue.use(Datetime);
Vue.use(BootstrapVue);
Vue.use(VeeValidate);
Vue.use(VueAzureUploader);

VeeValidate.Validator.extend('secure_password', {
    getMessage: field => `The password must contain at least: 1 uppercase letter and 1 number`,
    validate: value => {
    var strongRegex = new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    return strongRegex.test(value);
    }
    
});


Vue.component('virtual-scroller', VirtualScroller);

new Vue({
    'el': '#root',
    components: {
        App
    },
    template: '<App/>',
    created() {
        http.init();
        event.init();
    }
});