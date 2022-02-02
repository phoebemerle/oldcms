import { http } from '@/services';
import { event } from '@/services';
import { endPoints } from '@/services';
import { sharedStore } from "./shared";

export const fraudInfoStore = {
    state: {
        fraudinfo: [],
        search: [],
    },

    async checkLoading() {
        if (this.state.search.length === 0) {
            sharedStore.showLandingPage();
            await this.init();
        }
    },

    init() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'fraudinfo', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.fraudinfo;
    },


    set all(value) {
        this.state.fraudinfo = value;
        this.state.search = value;
        return this.state.fraudinfo;
    },

    fraudInfoByID(id) {
        const stringID = id.toString();
        return this.all.find(fraudinfo => fraudinfo.id === stringID);
    },

    createFraudInfo(data) {
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'fraudinfo', data, ({ data }) => {
                event.emit(event.names.USER_MESSAGE, data.data.attributes.details + ' was created successfully', 'success');
                resolve(data.data);
            }, error => reject(error));
        });
    },

    updateFraudInfo(data, id) {
        return new Promise((resolve, reject) => {
            http.patch(endPoints.catalogue + 'fraudinfo/' + id, data, ({ data }) => {
                event.emit(event.names.USER_MESSAGE, data.data.attributes.details + ' was updated successfully', 'success');
                resolve(data.data);
            }, error => reject(error));
        });
    }, 

    removeFraudInfo(id) {
        return new Promise((resolve, reject) => {
            http.delete(endPoints.catalogue + 'fraudinfo/' + id, id, ({ data }) => {
                resolve(data.data);
                event.emit(event.names.USER_MESSAGE, 'Fraud details were removed successfully', 'success');
            }, error => reject(error));
        })
    },
}