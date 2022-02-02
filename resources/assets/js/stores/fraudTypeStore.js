import { http } from '@/services';
import { event } from '@/services';
import { endPoints } from '@/services';
import { sharedStore } from "./shared";

export const fraudTypeStore = {
    state: {
        fraudtypes: [],
        search: [],
    },

    async checkLoading() {
        if (this.state.fraudtypes.length === 0) {
            sharedStore.showLandingPage();
            await this.init();
        }
    },

    init() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'fraudtypes', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.fraudtypes;
    },


    set all(value) {
        this.state.fraudtypes = value;
        this.state.search = value;
        return this.state.fraudtypes;
    },

    fraudTypeByID(id) {
        const stringID = id.toString();
        return this.all.find(fraudtype => fraudtype.id === stringID);
    },

    createFraudType(data) {
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'fraudtypes', data, ({ data }) => {
                event.emit(event.names.USER_MESSAGE, data.data.attributes.type + ' was created successfully', 'success');
                resolve(data.data);
            }, error => reject(error));
        });  
    },

    updateFraudType(data, id) {
        return new Promise((resolve, reject) => {
            http.patch(endPoints.catalogue + 'fraudtypes/' + id, data, ({ data }) => {
                event.emit(event.names.USER_MESSAGE, data.data.attributes.ftype + ' was updated successfully', 'success');
                resolve(data.data);
            }, error => reject(error));
        });
    }, 

    removeFraudType(id) {
        return new Promise((resolve, reject) => {
            http.delete(endPoints.catalogue + 'fraudtypes/' + id, id, ({ data }) => {
                resolve(data.data);
                event.emit(event.names.USER_MESSAGE, 'Fraud type was removed successfully', 'success');
            }, error => reject(error));
        })
    },
}