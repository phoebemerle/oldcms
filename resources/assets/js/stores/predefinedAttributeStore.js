import {http} from '@/services';
import {event} from '@/services';
import {sharedStore, attributeTypeStore} from '@/stores';
import {endPoints} from '@/services';


export const predefinedAttributeStore = {

    state: {
        predefined_attributes: [],
        search: []
    },

    async checkLoading(){
        if(this.state.search.length === 0){
            sharedStore.showLandingPage();
            await this.init();
        }
    },

    init(){
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'predefined-attribute', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.predefined_attributes;
    },

    set all(value) {
        this.state.predefined_attributes = value;
        this.state.search = value;
        return this.state.predefined_attributes;
    },


    async getPredefinedAttribute(id){
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'predefined-attribute/'+id, response => {
                resolve(response.data.data);
            }, error => reject(error));
        });
    },

    delete(id){
        return new Promise((resolve, reject) => {
            http.delete(endPoints.inventory + 'predefined-attribute/'+ id, response => {
                let index = this.state.predefined_attributes.indexOf(this.getPredefinedAttribute(response.data.data.id));
                this.state.predefined_attributes.splice(index, 1);
                resolve(response);
            }, error => reject(error));
        });
    },

    create(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'predefined-attribute', data, ({data}) => {
                this.state.predefined_attributes.push(data.data);
                event.emit(event.names.USER_MESSAGE, 'Your attribute was successfully created', 'success');
                resolve(data);
            }, error => reject(error));
        });
    },

    update(data, id){
        return new Promise((resolve, reject) => {
            http.patch(endPoints.inventory + 'predefined-attribute/'+id, data, response => {
                let index = this.state.predefined_attributes.indexOf(this.getPredefinedAttribute(response.data.data.id));
                this.state.predefined_attributes.splice(index, 1);
                this.state.predefined_attributes.unshift(response.data.data);
                resolve(response.data.data);
            }, error => reject(error));
        });
    },
    async searchAttributeTypes(searchTerm){
       
        const attributes = attributeTypeStore.state.attribute_types
        if(searchTerm.length > 0) {
            let searchResults = [];
            let upperSearch = searchTerm.toUpperCase();
            for (let a = 0; a < attributes.length; a++) {
                let upperDesc = attributes[a].attributes.attribute_type.toUpperCase();
                if (upperDesc.includes(upperSearch)) {
                    searchResults.push(attributes[a]);
                }
            }
            return searchResults;
        }
        else{
        }
    },

    async searchAttributeNames(searchTerm){
       
        const attributes = this.state.predefined_attributes;
        let searchResults = [];
        if(searchTerm.length > 0) {
            let upperSearch = searchTerm.toUpperCase();

            for (let a = 0; a < attributes.length; a++) {
                let upperDesc = attributes[a].attributes.attribute_name.toUpperCase();
                if (upperDesc.includes(upperSearch)) {
                    searchResults.push(attributes[a]);
                }
            }
            
        }
        return searchResults;
    },
}