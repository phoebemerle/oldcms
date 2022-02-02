import axios from 'axios';
import {ls, event} from '@/services';

export const CDN = {
    request(method, url, data = {}, successCb = null, errorCb = null) {
        return axios.request({
            method,
            url,
            data
        }).then(successCb).catch(errorCb)
    },
    get(url, successCb = null, errorCb = null) {
        return this.request('get', url, {}, successCb, errorCb);
    },

    post(url, data = {}, successCb = null, errorCb = null) {
        return this.request('post', url, data, successCb, errorCb);
    },

    put(url, data = {}, successCb = null, errorCb = null) {
        return this.request('put', url, data, successCb, errorCb);
    },

    patch(url, data = {}, successCb = null, errorCb = null) {
        return this.request('patch', url, data, successCb, errorCb);
    },

    delete(url, data = {}, successCb = null, errorCb = null) {
        return this.request('delete', url, data, successCb, errorCb);
    },
    init() {

        // axios.defaults.baseURL = '/api/';

        // axios.interceptors.response.use(response => {
        //     const token = response.data.access_token;
        //     token && ls.set('jwt-token', token);
        //     return response;
        // }, error => {
        //     if (error.response.status === 401) {
        //         if (!(error.config.method === 'post' && /\/api\/login\/?$/.test(error.config.url))) {
        //             event.emit(event.names.LOG_OUT);
        //         }
        //     }
        // });

        // axios.defaults.headers.put['x-ms-blob-content-type'] = 'image/png';


        // axios.interceptors.request.use(config => {
        //     // config.headers.Authorization = `Bearer ${ls.get('jwt-token')}`;
        //     // config.headers.ContentType = '';
        //     config.headers = {
        //         "Authorization": `Bearer ${ls.get('jwt-token')}`,
        //         "Content-Type": "application/vnd.api+json",
        //         "Access-Control-Allow-Origin": "*"
        //     }
        //     return config;
        // });
    },

    createData(passedData){
        return {'data': passedData}
    }
};