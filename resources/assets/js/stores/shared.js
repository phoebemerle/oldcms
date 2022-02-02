import {http, event} from '@/services';

export const sharedStore = {

    async init() {
        try {
            await Promise.all([

            ]).then(() => {

            });

            return this.state;
        } catch (error) {
            return Promise.reject(error);
        }
    },

    showLandingPage(){
        event.emit(event.names.LOADING, true);
    },

    hideLoadingPage(){
        event.emit(event.names.LOADING, false);
    }
};