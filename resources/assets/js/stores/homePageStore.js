import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";

export const homePageStore = {

    state: {
        homePage: [],

    },

    async checkHomeContent(){
        if(this.state.homePage.length === 0){
            sharedStore.showLandingPage();
            return await this.getHomePageContent();
        }else{
            return this.state.homePage;
        }
    },

    getHomePageContent(){
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'home-page-contents', response => {
                this.state.homePage = response.data.data[0];
                resolve(response.data.data[0]);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    updateHomePageContent(data, id){
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.catalogue + 'home-page-contents/'+id ,data, ({data})=>{
                this.state.homePage = data.data[0];
                event.emit(event.names.USER_MESSAGE, 'New home page content was created successfully', 'success');
                resolve(data.data[0]);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

}

