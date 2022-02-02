import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";

export const finderStore = {
    state: {
        finders: [],
    },

    async checkForFinders(){
        let expressFinder = [];
        if(this.state.finders.length > 0 ){
            expressFinder = this.state.finders;
        }else{
            expressFinder = await this.getAllFinder();
        }

        return expressFinder.data;
    },

    getAllFinder(){
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'express-finder', response  => {
                this.state.finders = response.data.data;
                resolve(response.data);
            }, error => reject(error));
        });
    },

    storeNewFinder(data){
        sharedStore.showLandingPage();

        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'express-finder', data, ({data}) => {
                window.location = '#!/express-finder/edit/'+data.data.id;
                resolve(data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    editFinderTitle(data, id){
        sharedStore.showLandingPage();

        return new Promise ((resolve, reject)=>{
            http.patch(endPoints.catalogue + 'express-finder/'+id, data, ({data}) => {
                window.location = '#!/express-finder/edit/'+data.data.id;
                resolve(data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        })
    },

    async getFinder(id){

        let expressFinder = null;

        if(this.state.finders.length > 0 ){
            for (let i = 0; i < this.state.finders; i++) {
                if(this.state.finders[i].id === id){
                    expressFinder = this.state.finders[i]
                }
            }
        }

        if(!expressFinder){
            expressFinder = await this.loadFinder(id);
            // console.log(this.state.finders);
            this.state.finders.push(expressFinder);
        }

        return expressFinder;

    },

    loadFinder(id){
        sharedStore.showLandingPage();

        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'express-finder/'+id, response  => {
                resolve(response.data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    getAllHeaders(){
        sharedStore.showLandingPage();

        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'attributes', response  => {
                resolve(response.data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    saveNewFinderHeader(data){
        sharedStore.showLandingPage();

        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'express-finder-headers', data, ({data}) => {
                this.addToTheState(data.data, data.data.attributes.finder_id, 'headers');
                resolve(data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    removeHeader(id){
        return new Promise((resolve, reject) => {
            http.delete(endPoints.catalogue + 'express-finder-headers/'+id, response  => {
                resolve('done');
            }, error => reject(error));
        });
    },



    addToTheState(data, finderID, type){
        let editedState =  this.state.finders.find(row => row.id === finderID);

        editedState.attributes[type].push(data.attributes);

    },

    removeFromState(id, finderID, type){

        console.log(finderID);

        console.log(id);

        let editedState =  this.state.finders.find(row => row.id === finderID);

        console.log(editedState);
    },

    saveNewFinderCategory(data){
        sharedStore.showLandingPage();

        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'express-finder-category', data, ({data}) => {

                console.log(data.data);

                data.data.attributes.id = data.data.id;

                this.addToTheState(data.data, data.data.attributes.finder_id, 'categories');

                resolve(data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    removeCategory(id, finderID){
        return new Promise((resolve, reject) => {
            http.delete(endPoints.catalogue + 'express-finder-category/'+id, response  => {

                this.removeFromState(id, finderID, 'categories');

                resolve(response);
            }, error => reject(error, this.removeFromState(id, finderID, 'categories')));
        });
    },

    saveNewFinderProduct(data){
        sharedStore.showLandingPage();

        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'express-finder-product', data, ({data}) => {

                data.data.attributes.id = data.data.id;

                this.addToTheState(data.data, data.data.attributes.finder_id, 'products');

                resolve(data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    removeProduct(id, finderID){
        return new Promise((resolve, reject) => {
            http.delete(endPoints.catalogue + 'express-finder-product/'+id, response  => {

                this.removeFromState(id, finderID, 'products');

                resolve(response);
            }, error => reject(error, this.removeFromState(id, finderID, 'products')));
        });
    },

};