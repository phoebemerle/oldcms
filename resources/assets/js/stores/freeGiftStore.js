import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";

export const freeGiftStore = {
    state: {
        freeGifts: [],
        search: []
    },

    async checkLoading(){
        if(this.state.freeGifts.length === 0){
            sharedStore.showLandingPage();
            await this.init();
        }
    },


    init() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.marketing + 'free-gifts', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.freeGifts;
    },

    set all(value) {
        this.state.freeGifts = value;
        this.state.search = value;
        return this.state.freeGifts;
    },

    freeGiftByID(id){
        return new Promise((resolve, reject) => {
            http.get(endPoints.marketing + 'free-gifts/'+id, ({data}) => {
                sharedStore.hideLoadingPage();
                resolve(data.data);
            }, error => reject(error));
        });
    },

    createFreeGift(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.marketing + 'free-gifts', data, ({data}) => {
                this.all.push(data.data);
                window.location = '#!/marketing/free-gifts/edit/'+data.data.id;
                event.emit(event.names.USER_MESSAGE, 'Your free gift was successfully created', 'success');
                window.location = '#!/marketing/free-gifts';
                sharedStore.hideLoadingPage();
                resolve (data);
            }, error => reject(error));
        });
    },

    deleteFreeGifts(data){
        return new Promise((resolve, reject) => {
            http.delete(endPoints.marketing + 'free-gifts/'+ data.id, data.id, ({response}) => {
                for(let a = 0; a < this.state.freeGifts.length; a++){
                    if(this.state.freeGifts[a].id === data.id){
                        this.state.freeGifts.splice(a,1);
                    }
                }
                window.location = '#!/marketing/free-gifts';
                event.emit(event.names.USER_MESSAGE, 'Your free gift was successfully deleted', 'success');
                sharedStore.hideLoadingPage();
                resolve(response);
            }, error => reject(error));
        });
    },

    updateFreeGifts(data){
        return new Promise((resolve, reject) => {
            http.patch(endPoints.marketing + 'free-gifts/' + data.data.id, data, ({data}) => {
                for(let a = 0; a < this.all.length; a++){
                    if(this.all[a].id.toString() === data.data.id.toString()){

                        this.all[a] = data.data;
                    }
                }
                window.location = '#!/marketing/free-gifts';
                sharedStore.hideLoadingPage();
                resolve (data.data);
                event.emit(event.names.USER_MESSAGE, 'Your free gift was successfully updated', 'success');
            }, error => reject(error));
        });
    },
};