import { http } from '@/services';
import { event } from '@/services';
import { endPoints } from '@/services';
import { sharedStore } from "./shared";

export const promotionBannerStore = {
    state: {
        promotionBanners: [],
        search: []
    },

    async checkLoading() {
        if (this.state.promotionBanners.length === 0) {
            sharedStore.showLandingPage();
            await this.init();
        }
    },


    init() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.marketing + 'promotion-banners', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.promotionBanners;
    },

    set all(value) {
        this.state.promotionBanners = value;
        this.state.search = value;
        return this.state.promotionBanners;
    },

    bannerByID(id) {
        const stringID = id.toString();
        return this.all.find(banner => banner.id === stringID);
    },

    createPromotionBanner(data) {
        return new Promise((resolve, reject) => {
            http.post(endPoints.marketing + 'promotion-banners', data, ({ data }) => {
                this.all.push(data.data);
                window.location = '#!/marketing/promotion-banners/edit/' + data.data.id;
                event.emit(event.names.USER_MESSAGE, 'Your promotion banner was successfully created', 'success');
                sharedStore.hideLoadingPage();
                resolve(data);
            }, error => reject(error));
        });
    },

    updatePromotionBanner(data) {
        return new Promise((resolve, reject) => {
            http.patch(endPoints.marketing + 'promotion-banners/' + data.data.id, data, ({ data }) => {
                for (let a = 0; a < this.all.length; a++) {
                    if (this.all[a].id.toString() === data.data.id.toString()) {

                        this.all[a] = data.data;
                    }
                }
                window.location = '#!/marketing/promotion-banners';
                sharedStore.hideLoadingPage();
                resolve(data.data);
                event.emit(event.names.USER_MESSAGE, 'Your promotion banner was successfully updated', 'success');
            }, error => reject(error));
        });
    },

    deletePromotionBanner(data) {
        return new Promise((resolve, reject) => {
            http.delete(endPoints.marketing + 'promotion-banners/' + data.id, data.id, ({ response }) => {
                for (let a = 0; a < this.state.promotionBanners.length; a++) {
                    if (this.state.promotionBanners[a].id === data.id) {
                        this.state.promotionBanners.splice(a, 1);
                    }
                }
                window.location = '#!/marketing/promotion-banners';
                event.emit(event.names.USER_MESSAGE, 'Your promotion banner was successfully deleted', 'success');
                sharedStore.hideLoadingPage();
                resolve(response);
            }, error => reject(error));
        });
    },


}