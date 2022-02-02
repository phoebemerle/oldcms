import {http} from '@/services';
import {event} from '@/services';
import {endPoints, ls} from '@/services';
import {sharedStore} from "./shared";
import axios from 'axios';

export const cdnStore = {

    state: {
        CDN:[],
        CNET:[],
    },

    async checkCDN(id){

        return new Promise((resolve, reject) => {
            http.get('https://comxcdn.azurewebsites.net/upload'+ id, ({data}) => {
                resolve(data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        })
    },

    uploadToCDN(data) {
        sharedStore.showLandingPage();
        // let config = {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // };
        return new Promise((resolve, reject) => {
            axios.post('https://comxcdn.azurewebsites.net/upload', data)
            // axios.post('https://comxcdn.azurewebsites.net/upload', data, config)
            .then(response => {
                sharedStore.hideLoadingPage();
                resolve(response.data);
            })
            .catch(error => {
                console.error(error);
                reject(error);
                sharedStore.hideLoadingPage()
            })
        })
    },

    getFromCDN(id) {
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.get('https://comxcdn.azurewebsites.net/upload' + id, response => {
                this.state.CDN.push(response.data);
                resolve(response.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error,sharedStore.hideLoadingPage()));
        })
    },
};