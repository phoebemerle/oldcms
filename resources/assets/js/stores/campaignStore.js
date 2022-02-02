import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";

export const campaignStore = {

    state: {
        campaigns: [],
        search:[],
        pagination:[]
    },

    async loadCheck(pageNumber){
        sharedStore.showLandingPage();

        let campaigns = [];

        if(!('page_'+pageNumber in this.state.campaigns)){
           campaigns =  await this.init(pageNumber);

        }else{
            campaigns = this.state.campaigns['page_'+pageNumber];
        }
        
        this.state.pagination.page['current-page'] = pageNumber;
        sharedStore.hideLoadingPage();
        return campaigns;
    },

    init(pageNumber) {
        return new Promise((resolve, reject) => {
            http.get(endPoints.marketing + 'campaigns?page[number]='+pageNumber+'&page[size]=50', response => {
                this.state.pagination = response.data.meta;
                this.state.campaigns['page_'+pageNumber] = response.data.data;
                this.state.search = this.state.search.concat(response.data.data);
                event.emit(event.names.CAMPAIGN_PAGINATION, this.state.pagination);
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    campaignByID(id){
        return new Promise((resolve, reject) => {
            http.get(endPoints.marketing + 'campaigns/'+id, ({data}) => {

                resolve(data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    createCampaign(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.marketing + 'campaigns', data, ({data}) => {
                window.location = '#!/marketing/campaign/edit/'+data.data.id;
                resolve (data.data);
                event.emit(event.names.USER_MESSAGE, 'Your campaign was successfully created', 'success');
            }, error => reject(error));
        });
    },

    updateCampaign(data){
        return new Promise((resolve, reject) => {
            http.patch(endPoints.marketing + 'campaigns/' + data.data.id, data, ({data}) => {
                resolve (data.data);
                event.emit(event.names.USER_MESSAGE, 'Your campaign was successfully updated', 'success');
            }, error => reject(error));
        });
    },

    addNewPromotion(newPromo){
        for(let a = 0; a < this.state.campaigns.length; a++){
            if(this.state.campaigns[a].id === newPromo.relationships.campaign.data.id){
                this.state.campaigns[a].relationships.promotions.data.push({
                        'id':newPromo.id,
                        'type': 'promotions'
                    }
                )
            }
        }
    },

    removePromotion(promo){
        for(let a = 0; a < this.state.campaigns.length; a++){
            if(this.state.campaigns[a].id === promo.relationships.campaign.data.id){
               for(let i =0; i < this.state.campaigns[a].relationships.promotions.data.length; i++){
                   if(this.state.campaigns[a].relationships.promotions.data[i].id === promo.id){
                       this.state.campaigns[a].relationships.promotions.data.splice(i, 1);
                   }
               }
            }
        }
    },

    searchStore(searchTerm){
        if(searchTerm.length > 0) {
            return new Promise((resolve, reject) => {
                http.get(endPoints.marketing + 'campaigns/search?searchTerm='+searchTerm, ({data}) => {
                    resolve(data.data);
                }, error => reject(error));
            });
        }
    },

}