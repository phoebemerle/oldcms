import {http, event, endPoints} from '@/services';
import {sharedStore} from "./shared";

export const configProductStore = {

    saveLabel(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory+'configurable-products/new-label', data, ({data}) => {
                data.data.attributes.id = data.data.id;
                resolve(data.data.attributes);
                event.emit(event.names.USER_MESSAGE, 'Label was created successfully', 'success');
                sharedStore.hideLoadingPage();
            }, error => {
                event.emit(event.names.USER_MESSAGE, 'Error, was unable to create!', 'error');
                reject(error)
                sharedStore.hideLoadingPage();
            });
        });
    },


    saveOptions(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory+'configurable-products/options', data, ({data}) => {

                data.data.attributes.id = data.data.id;

                resolve(data.data.attributes);
                event.emit(event.names.USER_MESSAGE, 'Option was created successfully', 'success');
                sharedStore.hideLoadingPage();
            }, error => {
                event.emit(event.names.USER_MESSAGE, 'Error, was unable to create!', 'error');
                reject(error)
                sharedStore.hideLoadingPage();
            });
        });
    },

    saveInput(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory+'configurable-products/input', data, ({data}) => {

                data.data.attributes.id = data.data.id;

                resolve(data.data.attributes);
                event.emit(event.names.USER_MESSAGE, 'Input was created successfully', 'success');
                sharedStore.hideLoadingPage();
            }, error => {
                event.emit(event.names.USER_MESSAGE, 'Error, was unable to create!', 'error');
                reject(error)
                sharedStore.hideLoadingPage();
            });
        });
    },

    updatePartCode(data, id){
        return new Promise((resolve, reject) => {
            http.patch(endPoints.inventory + '/configurable-products/update-part-code/' + id, data, ({data}) => {
                event.emit(event.names.USER_MESSAGE, 'Part Code '+data.part_code+' was successfully updated', 'success');
                resolve(data);
            }, error => reject(error));
        });
    },


    removeOption(id){
        return new Promise((resolve, reject) => {
            http.delete(endPoints.inventory+'configurable-products/options/'+ id, id, ({data}) => {
                event.emit(event.names.USER_MESSAGE, 'Your Option was successfully deleted!', 'success');
                data.data.attributes.id = data.data.id;
                resolve(data.data.attributes);
            }, error => {
                event.emit(event.names.USER_MESSAGE, 'Error, was unable to delete configuration!', 'error');
                reject(error)
                sharedStore.hideLoadingPage();
            });
        });
    },

    removeLabel(id){
        return new Promise((resolve, reject) => {
            http.delete(endPoints.inventory+'configurable-products/label/'+ id, ({response}) => {
                event.emit(event.names.USER_MESSAGE, 'Your Label was successfully deleted!', 'success');
                response.data.attributes.id = response.data.id;

                resolve(response.data.attributes);
            }, error => {
                event.emit(event.names.USER_MESSAGE, 'Error, was unable to delete configuration!', 'error');
                reject(error)
                sharedStore.hideLoadingPage();
            });
        });
    },



}; 