import { http } from '@/services';
import { event } from '@/services';
import { endPoints } from '@/services';
import { sharedStore } from "./shared";

export const mainBannerStore = {
    state: {
        mainbanner: [],
    },

    async checkLoading() {
        if (this.state.mainbanner.length === 0) {
            sharedStore.showLandingPage();
            await this.init();
        }
    },

    init() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'home-main-banners', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.mainbanner;
    },


    set all(value) {
        this.state.mainbanner = value;
        return this.state.mainbanner;
    },

    bannerByID(id) {
        const stringID = id.toString();
        return this.all.find(mainbanner => mainbanner.id === stringID);
    },

    createNewBanner(data) {
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'home-main-banners', data, ({ data }) => {
                this.state.mainbanner.push(data.data);
                event.emit(event.names.USER_MESSAGE, 'Your new banner was created successfully', 'success');
                resolve(data.data);
            }, error => reject(error));
        });
    },

       updateBanner(data, id){
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.catalogue + 'home-main-banners/' + id, data, ({ data }) => {
                let index = this.all.indexOf(this.bannerByID(data.data.id));
                event.emit(event.names.USER_MESSAGE, 'Your banner was updated successfully', 'success');
                resolve();
            }, error => reject(error));
        }); 
    }, 

    deleteBanner(data) {
        return new Promise((resolve, reject) => {
            http.delete(endPoints.catalogue + 'home-main-banners/' + data.id, data.id, ({ response }) => {
                event.emit(event.names.USER_MESSAGE, 'Your banner was successfully deleted', 'success');
                // let index = this.all.indexOf(this.bannerByID(data.id));
                resolve(response);
            }, error => reject(error));
        });
    },
}