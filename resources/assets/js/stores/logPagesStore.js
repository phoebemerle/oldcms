import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";
import {userStore, productStore, categoryStore} from '@/stores';
import Axios from 'axios';

export const logPagesStore = {
    state: {
        logPages: [],
        search: []
    },

    async checkLoading(){
        if(this.state.logPages.length === 0){
            sharedStore.showLandingPage();
            await this.init();
        }
    },

    getLogPageByID(id) {
        const stringID = id.toString();
        return this.all.find(logPage => logPage.id === stringID);
    },

    logsByType(type)
    {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'log-page/'+type, response => {
                resolve(response.data.data);
            }, error => reject(error));
        })
    },


    init() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'log-pages', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.logPages;
    },

    set all(value) {
        this.state.logPages = value;
        this.state.search = value;
        return this.state.logPages;
    },


    attachedLogsByID(id) {
            return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'log-pages/'+ id + '/children', async response => {
                for(let i = 0; i < response.data.data.length; i++) {
                    if(response.data.data[i].attributes.log_page == 1) {
                        const item = await productStore.productByID(response.data.data[i].attributes.item_id);
                        response.data.data[i].attributes.item_id = item.attributes.title;
                    } else if (response.data.data[i].attributes.log_page == 2) {
                        const item = categoryStore.categoryByID(response.data.data[i].attributes.item_id)
                        response.data.data[i].attributes.item_id = item.attributes.title;
                    }
                    const user = userStore.getUserByID(response.data.data[i].attributes.user_id);
                    const page = this.getLogPageByID(response.data.data[i].attributes.log_page);
                    response.data.data[i].attributes.log_page = page.attributes.page_type
                    response.data.data[i].attributes.user_id = user.attributes.name
                }
                resolve(response.data.data);
            }, error => reject(error));
        });
    },
    filterByUser(id) {
        for(let z = 0; z < this.all.length; z++) {
            
        }
    }
};