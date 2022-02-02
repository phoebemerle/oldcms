import {http} from '@/services';
import {event} from '@/services';
import {inventoryStore, sharedStore} from '@/stores';
import {endPoints} from '@/services';


export const productMetaInfoStore = {

    delete(data){
        return new Promise((resolve, reject) => {
            http.delete(endPoints.catalogue + 'product-meta-info/'+ data.data.id, data.data.id, ({response}) => {

                event.emit(event.names.USER_MESSAGE, 'Meta Info was successfully deleted!', 'success');
                resolve(response);
            }, error => reject(error, event.emit(event.names.USER_MESSAGE, 'Failed to delete Meta Info', 'error')));
        });
    },

    create(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'product-meta-info', data, ({data}) => {
                event.emit(event.names.USER_MESSAGE, 'Meta Description was successfully created!', 'success');
                resolve(data.data);
            }, error => reject(error, event.emit(event.names.USER_MESSAGE, 'Failed to Create Meta Info', 'error')));
        });
    },

    update(data, id){
        return new Promise((resolve, reject) => {
            http.patch(endPoints.catalogue + 'product-meta-info/'+id, data, ({data}) => {

                event.emit(event.names.USER_MESSAGE, 'Meta Description was successfully updated!', 'success');
                resolve(data.data);           
            }, error => reject(error, event.emit(event.names.USER_MESSAGE, 'Failed to update Meta Info', 'error')));
        });
    },

}