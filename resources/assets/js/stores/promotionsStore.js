import {http} from '@/services';
import {event} from '@/services';
import {campaignStore} from '@/stores';
import {endPoints} from "@/services";


export const promotionsStore = {

    state: {
        promotions: [],
        promotionTargets:[]
    },


    async checkPromotions(id){
        let promotion = null;

        for(let a = 0; a < this.state.promotions.length; a++){
            if(this.state.promotions[a].campaign_id === id){
                promotion = this.state.promotions[a];
            }
        }

        if(promotion === null ){
            promotion = await this.getPromotions(id);
        }

        return promotion;
    },

    getPromotions(id){
        return new Promise((resolve, reject) => {
            http.get(endPoints.marketing + 'promotions/get-all/'+id, response => {
                this.state.promotions = this.state.promotions.concat(response.data.data);
                resolve(response.data.data);

            }, error => reject(error));
        });
    },

    updatePromo(data){
        return new Promise((resolve, reject) => {
           http.patch(endPoints.marketing + 'promotions/'+data.data.id, data, ({data}) =>{


               event.emit(event.names.USER_MESSAGE, data.data.attributes.description+' was updated successfully', 'success');

               resolve(data.data);

           }, error => reject(error));
        });
    },

    savePromo(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.marketing + 'promotions', data, ({data}) =>{

                this.state.promotions.push(data.data);
                event.emit(event.names.USER_MESSAGE, data.data.attributes.description+' was saved successfully', 'success');
                campaignStore.addNewPromotion(data.data);
                let id = data.data.id;
                resolve(data.data, id);


            }, error => reject(error));
        });
    },

    deletePromo(id){
        return new Promise((resolve,reject) => {
            http.delete(endPoints.marketing + 'promotions/'+id, id, ({data})=>{
                for(let a = 0; a < this.state.promotions.length; a++){
                    if(this.state.promotions[a].id === id){
                        campaignStore.removePromotion(this.state.promotions[a]);
                        // this.state.promotions.splice(a,1);
                    }
                }
                resolve(id);
                event.emit(event.names.USER_MESSAGE,'Promotion was successfully removed', 'success');
            }, error => reject(error));

        });
    },

    promotionByID(id){
        return new Promise((resolve, reject) => {
            http.get(endPoints.marketing + 'promotions/'+id, response => {           
                resolve(response.data.data);
            }, error => reject(error));
        });
    },

    checkTargets(id){

        let target = [];

        for(let a = 0; a < this.state.promotionTargets.length; a++){
            if(this.state.promotionTargets[a].attributes.promotion_id === id){
                target.push(this.state.promotionTargets[a]);
            }
        }

        if(target.length === 0){
            target = this.getTargets(id);
        }

        return target;
    },

    getTargets(id){
            return new Promise((resolve,reject) => {
                http.get(endPoints.marketing + 'promotion-targets?promotion_id='+id, ({data})=>{
                    for(let a = 0 ; a < data.data.length; a++){
                        this.state.promotionTargets.push(data.data[a]);
                    }
                }, error => reject(error));

            });
    },

    saveTargets(data){
        return new Promise((resolve,reject) => {
            http.post(endPoints.marketing + 'promotion-targets', data, ({data})=>{

                this.state.promotionTargets.push(data.data);
                resolve(data.data);

                event.emit(event.names.USER_MESSAGE,'Target was successfully added to the promotion', 'success');

            }, error => reject(error));

        });
    }

}