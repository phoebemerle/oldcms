import { http } from '@/services';
import { event } from '@/services';
import { endPoints } from '@/services';
import { sharedStore } from "./shared";
import { productStore } from './product';

export const productSashesStore = {
    state: {
        productsashes: [],
        search: [],
    },

    async checkLoading() {
        if(this.state.search.length === 0){
            sharedStore.showLandingPage();
            return await this.init();
        }else{
            return this.state.search;
        }
    },

    init() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'productsashes', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.productsashes;
    },


    set all(value) {
        this.state.productsashes = value;
        this.state.search = value;
        return this.state.productsashes;
    },

    searchStore(searchTerm){
        if(searchTerm.length > 0) {
            let searchResults = [];
            let upperSearch = searchTerm.toUpperCase();

            for (let a = 0; a < this.all.length; a++) {
                let upperTitle = this.all[a].attributes.title.toUpperCase();

                if (upperTitle.includes(upperSearch)) {
                    searchResults.push(this.all[a]);
                }
            }
            return searchResults;
        }
        else{
            return this.all;
        }
    },

     sashByID(id){
         const stringID = id.toString();
        return this.all.find(productsash => productsash.id === stringID);
    },

      createSash(data){
        return new Promise ((resolve, reject) => {
            http.post(endPoints.catalogue + 'productsashes' ,data, ({data})=>{
                this.state.productsashes.push(data.data);
                event.emit(event.names.USER_MESSAGE, data.data.attributes.description+' was created successfully', 'success');
                window.location = '#!/productsashes/edit/' + data.data.id;
                resolve(data.data);
            }, error => reject(error));
        });
    },

    update(data, id){
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.catalogue + 'productsashes/'+id ,data, ({data})=>{
                let index = this.all.indexOf(this.sashByID(data.data.id));
                this.all.splice(index, 1);
                this.all.unshift(data.data);
                event.emit(event.names.USER_MESSAGE, data.data.attributes.title+' was updated successfully', 'success');
                resolve(data.data);
            }, error => reject(error));
        }); 
    }, 

    attachSash(data, product) {
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.post(endPoints.catalogue + 'productsashes/attach', {
                sash: data.id,
                product: product.id
            }, ({ data }) => {
                    sharedStore.hideLoadingPage();
                    resolve(data.data);
                event.emit(event.names.USER_MESSAGE, 'Product was attached successfully', 'success');
        }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    attachSashViaProduct(data, product) {
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'productsashes/attach', {
                sash: data,
                product: product.id
            }, ({ data }) => {
                sharedStore.hideLoadingPage();
                resolve(data.data);
                event.emit(event.names.USER_MESSAGE, 'Product was attached successfully', 'success');
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    detachSash(data, product) {
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.post(endPoints.catalogue + 'productsashes/detach', {
                sash: data.id,
                product: product.id
            }, ({ data }) => {
                sharedStore.hideLoadingPage();
                event.emit(event.names.USER_MESSAGE, 'Sash was detached successfully', 'success');
                resolve(data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    }

};