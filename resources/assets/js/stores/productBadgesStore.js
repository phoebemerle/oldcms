import {http} from '@/services';
import {event} from '@/services';
import stub from '@/stubs/productBadge';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";
import Axios from 'axios';

export const productBadgesStore = {
    state: {
        productbadges: [stub],
        search:[],
    },

    async checkLoading(){
        if(this.state.search.length === 0){
            sharedStore.showLandingPage();

            return await this.init();

        }else{
            sharedStore.hideLoadingPage();
            return this.state;
        }

    },

    init(){
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'productbadges', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.productbadges;
    },


    set all(value) {
        this.state.productbadges = value;
        this.state.search = value;
        return this.state.productbadges;
    },

    badgeByID(id){
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.get(endPoints.catalogue + 'productbadges/'+id, ({data})=>{
                resolve(data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    createBadge(data){
        return new Promise ((resolve, reject) => {
            http.post(endPoints.catalogue + 'productbadges' ,data, ({data})=>{
                this.state.productbadges.push(data.data);
                event.emit(event.names.USER_MESSAGE, data.data.attributes.description+' was updated successfully', 'success');
                window.location = '#!/productbadges/edit/' + data.data.id;
                resolve(data.data);
            }, error => reject(error));
        });
    },

    update(data, id){
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.catalogue + 'productbadges/'+id ,data, ({data})=>{
                let index = this.all.indexOf(this.badgeByID(data.data.id));
                this.all.splice(index, 1);
                this.all.unshift(data.data);
                event.emit(event.names.USER_MESSAGE, data.data.attributes.description+' was updated successfully', 'success');
                resolve(data.data);
            }, error => reject(error));
        }); 
    },   

    saveNewImage(id, newBadgeDetails){
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.catalogue + 'productbadges/'+id ,newBadgeDetails, ({data})=>{
                let index = this.all.indexOf(this.badgeByID(id));
                this.all.splice(index, 1);
                this.all.unshift(data.data);
                sharedStore.hideLoadingPage();
                event.emit(event.names.USER_MESSAGE, 'Image was updated successfully', 'success');
                resolve(data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    searchStore(searchTerm){
        if(searchTerm.length > 0) {
            return new Promise((resolve, reject) => {
                http.post(endPoints.catalogue + 'productbadges/search', {searchWord: searchTerm}, ({data}) => {

                    resolve(data.data);
                }, error => reject(error));
            })
        }

    },

    attachBadge(data, product) {
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.post(endPoints.catalogue + 'productbadges/attach', {
                badge: data.id,
                product: product.id
            }, ({data})=>{
                let index = this.all.indexOf(this.badgeByID(data.data.id));
                this.all.splice(index, 1);
                this.all.unshift(data.data);
                sharedStore.hideLoadingPage();
                event.emit(event.names.USER_MESSAGE, 'Badge was updated successfully', 'success');
                resolve(data.data);
        }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    detachBadge(data, product) {
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.post(endPoints.catalogue + 'productbadges/detach', {
                badge: data.id,
                product: product.id
            }, ({data})=>{
                let index = this.all.indexOf(this.badgeByID(data.data.id));
                this.all.splice(index, 1);
                this.all.unshift(data.data);
                sharedStore.hideLoadingPage();
                event.emit(event.names.USER_MESSAGE, 'Badge was updated successfully', 'success');
                resolve(data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    }
};
