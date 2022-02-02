import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";

export const donationStore = {
    state: {
        donations: [],
        search: []
    },

    async checkLoading(){
        if(this.state.donations.length === 0){
            sharedStore.showLandingPage();
            await this.init();
        }
        
    },

    init() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.marketing + 'donations', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.donations;
    },

    set all(value) {
        this.state.donations = value;
        this.state.search = value;
        return this.state.donations;
    },

    searchStore(searchTerm){
        if(searchTerm.length > 0) {
            return new Promise((resolve, reject) => {
                http.get(endPoints.marketing + 'donations/search?searchTerm='+searchTerm, ({data}) => {
                    resolve(data.data);
                }, error => reject(error));
            });
        }
    },

    donationByID(id){
        return new Promise((resolve, reject) => {
            http.get(endPoints.marketing + 'donations/'+id, ({data}) => {
                sharedStore.hideLoadingPage();
                resolve(data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    createDonation(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.marketing + 'donations', data, ({data}) => {
                if(this.state.donations.length > 0) {
                    this.all.unshift(data.data);
                }
                window.location = '#!/marketing/donations/edit/'+data.data.id;
                event.emit(event.names.USER_MESSAGE, 'Your donation was successfully created', 'success');
                sharedStore.hideLoadingPage();
                resolve (data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    deleteDonation(data){
        return new Promise((resolve, reject) => {
            http.delete(endPoints.marketing + 'donations/'+ data.id, data, ({data}) => {
                let index = this.all.indexOf(this.all.find(row => row.id === data.data.id))
                this.all.splice(index, 1)
                event.emit(event.names.USER_MESSAGE, 'Your donation was successfully deleted', 'success');
                sharedStore.hideLoadingPage();
                window.location.replace('#!/marketing/donations');
                resolve(data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    updateDonation(data){
        return new Promise((resolve, reject) => {
            http.patch(endPoints.marketing + 'donations/' + data.data.id, data, ({data}) => {
                window.location = '#!/marketing/donations';
                sharedStore.hideLoadingPage();
                let index = this.all.indexOf(this.all.find(row => row.id == data.data.id))
                this.all.splice(index, 1)
                this.all.unshift(data.data)
                resolve (data.data);
                event.emit(event.names.USER_MESSAGE, 'Your donation was successfully updated', 'success');
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },
};