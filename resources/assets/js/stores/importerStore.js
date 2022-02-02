import {http} from '@/services';
import axios from 'axios';
import {sharedStore} from "./shared";


export const importerStore = {
   

    priceImporter(data) {

        return new Promise((resolve, reject) => {
            sharedStore.showLandingPage();
            http.post('http://inventory.dev.local/api/v1/importer/price', data, ({data}) => {
                resolve(data);
                sharedStore.hideLoadingPage();
            }, error => reject(error,  sharedStore.hideLoadingPage()));
        })

    //     axios.post('http://inventory.dev.local/api/v1/importer/price', data)
    // .then(response => {

    //     return response.data;
    // })
    // .catch(error => {
    //     console.error(error.response)
    // })

    //     return new Promise((resolve, reject) => {
    //         http.post('/inventory/attributes/attach', data, ({data}) => {
    //             console.log('fhkusdfv');
    //             resolve(data.data)
    //         }, error => reject(error))
    //     })
    },

}