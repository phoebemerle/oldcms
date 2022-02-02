import {http} from '@/services';
import {event} from '@/services';
import {sharedStore} from '@/stores';
import {endPoints} from '@/services';


export const attributeTypeStore = {

    state: {
        attribute_types: [],
        search: []
    },

    async checkLoading(){
        if(this.state.attribute_types.length === 0){
            sharedStore.showLandingPage();
            await this.init();
        }
    },

    init(){
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'attributetype', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.attribute_types;
    },

    set all(value) {
        this.state.attribute_types = value;
        this.state.search = value;
        return this.state.attribute_types;
    },


    async getAttributeType(id){
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'attributetype/'+id, response => {
                resolve(response.data.data);
            }, error => reject(error));
        });
    },

    create(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'attributetype', data, response => {
                this.state.attribute_types.push(data);
                resolve(response.data.data.id);
            }, error => reject(error));
        });
    },

    createAndAttach(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'attribute-type/create-and-attach', data, response => {
                let existing = this.state.attribute_types.filter(row => row.id === response.data.data.id);
                if(existing.length > 0) {
                    let index = this.state.attribute_types.indexOf(existing[0]);
                    this.state.attribute_types.splice(index, 1)
                }
                this.state.attribute_types.push(response.data.data);
                event.emit(event.names.USER_MESSAGE, 'Attribute Type saved!', 'success');
                resolve(response.data.data.id);
            }, error => reject(error));
        });
    },

    update(data, id){
        return new Promise((resolve, reject) => {
            http.patch(endPoints.inventory + 'attributetype/'+id, data, response => {
                let index = this.all.indexOf(this.getAttributeType(response.data.data.id));
                this.state.attribute_types.splice(index, 1);
                this.state.attribute_types.push(response.data.data);
                resolve(response.data.data.id);
            }, error => reject(error));
        });
    },

    delete(data){
        return new Promise((resolve, reject) => {
            http.delete(endPoints.inventory + 'attributetype/'+data.id, data, response => {
                for(let a = 0; a < this.state.attribute_types.length; a++){
                    if(this.state.attribute_types[a].id === data.id){
                        this.state.attribute_types.splice(a,1);
                    }
                }
                event.emit(event.names.USER_MESSAGE, 'Your attribute was successfully deleted', 'success');
                window.location = '/#!/inventory/predefined-attributes';
                sharedStore.hideLoadingPage()
                resolve(data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },
}