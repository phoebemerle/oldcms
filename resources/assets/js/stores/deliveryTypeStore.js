import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";
import stub from '@/stubs/deliverytype';

export const deliveryTypeStore = {
    state: {
        deliverytype: [stub],
        search: [],
        locations:[]
    },

    async checkLoading(){
        if(this.state.search.length === 0){
            sharedStore.showLandingPage();
            return await this.init();
        }else{
            return this.state.search;
        }
    },

    init(){
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'deliverytype', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.deliverytype;
    },

    set all(value) {
        this.state.deliverytype = value;
        this.state.search = value;
        return this.state.deliverytype;
    },

    deliveryTypeByID(id){
        for(let a = 0; a < this.state.deliverytype.length; a ++){
            if(id.toString() === this.state.deliverytype[a].id.toString()){
                return this.state.deliverytype[a];
            }
        }
    },

    update(data, id){
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.inventory + 'deliverytype/'+id ,data, ({data})=>{
                let index = this.all.indexOf(this.deliveryTypeByID(data.data.id));
                this.all.splice(index, 1);
                this.all.push(data.data);
                event.emit(event.names.USER_MESSAGE, data.data.attributes.description+' was updated successfully', 'success');
                resolve(data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        }); 
    },   

    create(data) {
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'deliverytype', data, ({data}) => {
                this.all.push(data.data);
                window.location = '/#!/delivery-types';
                event.emit(event.names.USER_MESSAGE, data.data.attributes.description+' was created successfully', 'success');
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        })
    },

    searchStore(searchTerm){
        if(searchTerm.length > 0) {
            let searchResults = [];
            let upperSearch = searchTerm.toUpperCase();

            for (let a = 0; a < this.all.length; a++) {
                let upperTitle = this.all[a].attributes.description.toUpperCase();
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

    getDeliveryLocations(){
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'delivery-locations', response => {
                this.state.locations = response.data.data;
                resolve(response.data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    saveExclusionZone(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'delivery-locations-exclusion', data,({data}) => {
                this.state.locations = data.data.data;
                resolve(data.data.data);
                event.emit(event.names.USER_MESSAGE, 'Updated successfully', 'success');
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    updateStockDelivery(data, id){
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.inventory + 'stockitem-delivery/'+id ,data, ({data})=>{
                resolve(data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        }); 
    },

    createStockDelivery(data){
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.post(endPoints.inventory + 'stockitem-delivery' ,data, ({data})=>{
                resolve(data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },


}; 