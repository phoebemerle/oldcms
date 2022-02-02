import {endPoints, event, http} from '@/services';
import {sharedStore} from "./shared";
import { create } from 'domain';

export const templateStore = {
    state: {
        templates:[],
        search:[]
    },

    async checkLoading(){
        if(this.state.templates.length === 0){
            sharedStore.showLandingPage();
            await this.init();
        }
        return this.state.templates;
    },


    init() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'email-templates', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.templates;
    },

    set all(value) {
        this.state.templates = value;
        this.state.search = value;
        return this.state.templates;
    },

    getTemplateByID(id)
    {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'email-templates/'+id, response => {
                resolve(response.data.data);
            }, error => reject(error))
        })
    },

    update(data, id) {
        return new Promise((resolve, reject) => {
            http.patch(endPoints.catalogue + 'email-templates/'+id, data, async ({data}) => {
                let template = this.all.filter(row => row.id === data.data.id)[0];
                let index = this.all.indexOf(template);
                this.all.splice(index, 1);
                this.all.push(data.data);
                event.emit(event.names.USER_MESSAGE, 'Email Template has been updated', 'success');
                resolve(data.data);
                sharedStore.hideLoadingPage();
            }, error => 
                reject(error, sharedStore.hideLoadingPage())
            )
        })
    },

    create(data) {
        return new Promise ((resolve, reject) => {
            http.post(endPoints.catalogue + 'email-templates', data, ({data}) => {
                this.all.push(data.data);
                event.emit(event.names.USER_MESSAGE, 'Email Template has been created', 'success');
                window.location = '/#!/templates/edit/'+data.data.id
                resolve(data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()))
        })
    }
}