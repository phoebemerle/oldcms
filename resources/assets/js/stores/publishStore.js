import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";


export const publishStore = {

    state: {
        catalogue: {},
        inventory: {},
        marketing: {}
    },

    publishAll() {
        // sharedStore.showLandingPage();

        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'publish', response => {
                event.emit(event.names.USER_MESSAGE, 'Publish complete.', 'success');
                resolve(response.data);
                sharedStore.hideLoadingPage();
            }, error => {
                event.emit(event.names.USER_MESSAGE, 'Publish failed.', 'error')
                reject(error, sharedStore.hideLoadingPage())
            });
        });
    },

    history() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'publish-history', response => {
                this.state = response.data
                resolve(response.data);
            }, error => {
                reject(error, console.error(error.response))
            });
        });
    },

    publishAll() {
        // sharedStore.showLandingPage();

        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'publish', response => {
                event.emit(event.names.USER_MESSAGE, 'Publish complete.', 'success');
                resolve(response.data);
                sharedStore.hideLoadingPage();
            }, error => {
                event.emit(event.names.USER_MESSAGE, 'Publish failed.', 'error')
                reject(error, sharedStore.hideLoadingPage())
            });
        });
    },    
    
    publishSeparate(database) {
        // sharedStore.showLandingPage();

        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'publish?database='+database, response => {
                event.emit(event.names.USER_MESSAGE, 'Publish complete.', 'success');
                resolve(response.data);
                sharedStore.hideLoadingPage();
            }, error => {
                event.emit(event.names.USER_MESSAGE, 'Publish failed.', 'error')
                reject(error, sharedStore.hideLoadingPage())
            });
        });
    },
}