import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from "@/services";
import {sharedStore} from "./shared";

export const footerContactInfoStore = {
    state: {
        type:'footerInfo',
        footerContactInfo: [],
        footerSiteResources:[],
        footerCustomerLinks:[],
        footerSocialLinks:[]
    },

    async checkLoading(){
        sharedStore.showLandingPage();

        if(this.state.footerContactInfo.length === 0){
            this.state.footerContactInfo = await this.getFooterContact();
        }

        if(this.state.footerSiteResources.length === 0){
            this.state.footerSiteResources = await this.getSiteResources();
        }

        if(this.state.footerCustomerLinks.length === 0){
            this.state.footerCustomerLinks = await this.getCustomerServiceLinks();
        }

        if(this.state.footerSocialLinks.length === 0){
            this.state.footerSocialLinks = await this.getSocialLinks();
        }

        sharedStore.hideLoadingPage();

        return this.state;

    },

    getFooterContact() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'footercontact', response => {
                this.state.footerContactInfo = response.data.data;
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    updateFooterContact(data, id){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.patch(endPoints.catalogue + 'footercontact/'+id, data, ({data}) => {
                sharedStore.hideLoadingPage();
                event.emit(event.names.USER_MESSAGE, 'Contact info has been updated', 'success');
            }, error => reject(error));
        });
    },

    getSiteResources(){
        return new Promise((resolve, reject)=>{
           http.get(endPoints.catalogue + 'footersiteresources', response => {
               this.state.footerSiteResources = response.data.data;
               resolve(response.data.data);
           }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    updateSiteResource(data, id){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject)=>{
            http.patch(endPoints.catalogue + 'footersiteresources/'+id, data, ({data}) =>{
                event.emit(event.names.USER_MESSAGE, data.data.attributes.name + ' has been updated', 'success');
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        })
    },

    addNewSiteResource(data, key){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject)=>{
            http.post(endPoints.catalogue + 'footersiteresources', data, ({data}) =>{
                this.state.footerSiteResources[key] = data.data;
                event.emit(event.names.USER_MESSAGE, data.data.attributes.name + ' has been added', 'success');
                sharedStore.hideLoadingPage()
            }, error => reject(error, sharedStore.hideLoadingPage()));
        })
    },

    getCustomerServiceLinks(){
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'footercustomerservice', response => {
                this.state.footerCustomerLinks = response.data.data;
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    updateCustomerServiceLinks(data, id){
        return new Promise((resolve, rejects)=>{
            http.patch(endPoints.catalogue + 'footercustomerservice/'+id, data,({data})=>{
                event.emit(event.names.USER_MESSAGE, data.data.attributes.name + ' has been updated', 'success');
                sharedStore.hideLoadingPage();
            },error => rejects(error, sharedStore.hideLoadingPage()));
        })
    },

    storeCustomerServiceLinks(data, key){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject)=>{
            http.post(endPoints.catalogue + 'footercustomerservice', data, ({data}) =>{
                this.state.footerSiteResources[key] = data.data;
                event.emit(event.names.USER_MESSAGE, data.data.attributes.name + ' has been added', 'success');
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        })
    },

    getSocialLinks(){
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'footersocialmedia', response => {
                this.state.footerSocialLinks = response.data.data;
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    updateSocialLinks(data, id){
        return new Promise((resolve, rejects)=>{
            http.patch(endPoints.catalogue + 'footersocialmedia/'+id, data,({data})=>{
                event.emit(event.names.USER_MESSAGE, data.data.attributes.name + ' has been updated', 'success');
                sharedStore.hideLoadingPage();
            },error => rejects(error, sharedStore.hideLoadingPage()));
        })
    },

    storeSocialLinks(data, key){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject)=>{
            http.post(endPoints.catalogue + 'footersocialmedia', data, ({data}) =>{
                this.state.footerSocialLinks[key] = data.data;
                event.emit(event.names.USER_MESSAGE, data.data.attributes.name + ' has been added', 'success');
                resolve(data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        })
    },

};

