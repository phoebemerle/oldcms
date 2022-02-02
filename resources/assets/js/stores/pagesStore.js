import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore, userStore, departmentStore} from '@/stores';
import { ls } from '../services';

export const pagesStore = {

    state: {
        pages: [],
        search: []
    },

    async checkLoading(){
        if(this.state.pages.length === 0){
            sharedStore.showLandingPage();
            await this.init();
        }
    },


    init() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'pages', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.departments;
    },

    set all(value) {
        this.state.pages = value;
        this.state.search = value;
        return this.state.pages;
    },

    pagesByID(id){
        for(let a = 0; a < this.state.pages.length; a ++){
             if(id.toString() === this.state.pages[a].id.toString()){
                 return this.state.pages[a];
             }
        }
    },

    async userAccess(id) {
        await departmentStore.checkLoading()
        await this.checkLoading();
        var user_id = ls.get('user')
        var user = await userStore.getUserByID(user_id);
        const page = await this.pagesByID(id)
        var result = page.attributes.departments.filter(row => row.id === user.attributes.user_permissions.department_id)
        if(result.length > 0) {
            return true
        }
        return false;
    }

}