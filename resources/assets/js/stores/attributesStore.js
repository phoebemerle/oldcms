import {http} from '@/services';
import {event} from '@/services';
import {inventoryStore, sharedStore} from '@/stores';
import {endPoints} from '@/services';


export const attributeStore = {

    state: {
        attributes: [],
    },

   async checkAttributes(){

       if(this.state.attributes.length === 0){

           await this.getAttributes();
       }
    },

    attachAttributes(data)
    {
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'attributes/attach', data, ({data}) => {
                event.emit(event.names.USER_MESSAGE, 'Your attribute was successfully updated', 'success');
                sharedStore.hideLoadingPage()
                resolve(data.data)
            }, error => reject(error, sharedStore.hideLoadingPage()))
        })
    },

    async getAttributes(){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'attributes', response => {
                this.state.attributes = response.data.data;
                sharedStore.hideLoadingPage();
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    async syncFinder(){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'sync-finder', response => {
                sharedStore.hideLoadingPage();
                resolve(response.data);
                event.emit(event.names.USER_MESSAGE, 'Express finder Synced Sucessfully', 'success');
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    delete(data){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.delete(endPoints.inventory + 'stockattributes/remove/'+data.attribute_id, data, ({response}) => {
                event.emit(event.names.USER_MESSAGE, 'Your attribute was successfully deleted', 'success');
                sharedStore.hideLoadingPage();
                resolve(data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    deleteOtherTypes(id) {
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'attributes/remove/'+id, response => {
                sharedStore.hideLoadingPage();
                resolve(response.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    create(data){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'attributes', data, ({data}) => {
                this.state.attributes.push(data);
                inventoryStore.updateAttributesRelationships(data, 'add');
                event.emit(event.names.USER_MESSAGE, 'Your attribute was successfully created', 'success');
                sharedStore.hideLoadingPage();
                resolve(data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    update(data, id){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.patch(endPoints.inventory + 'attributes/'+id, data, ({data}) => {
                    for(let a = 0; a < this.state.attributes.length; a++){
                        if(this.state.attributes[a].id === data.data.id){
                            this.state.attributes[a] = data.data;
                        }
                    }
                event.emit(event.names.USER_MESSAGE, 'Your attribute was successfully update', 'success');
                sharedStore.hideLoadingPage();
                resolve(data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    searchFilterValues(search) {
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'attribute-filter-values/search/' + search, data => {
                resolve(data.data.data)
            }, error => reject(error))
        })
    },

    saveStockAttribute(data){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'attributes/stock-attributes', data, ({data}) => {
                this.state.attributes.push(data);
                event.emit(event.names.USER_MESSAGE, 'Your attribute type was set successfully!', 'success');
                sharedStore.hideLoadingPage();
                resolve(data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

}