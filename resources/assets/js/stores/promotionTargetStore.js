import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';


export const promotionTargetStore = {

    state: {
        promotionTargets:[]
    },

    checkTargets(id){
        let target = [];


        for(let a = 0; a < this.state.promotionTargets.length; a++){
            if(this.state.promotionTargets[a].attributes.promotion_id.toString() === id.toString()){
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
                this.state.promotionTargets = [];
                for(let a = 0 ; a < data.data.length; a++){
                    this.state.promotionTargets.push(data.data[a]);
                }
                resolve(data.data);
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
    },

    removeTarget(id){
        return new Promise((resolve,reject) => {
            http.delete(endPoints.marketing + 'promotion-targets/'+id, id, ({data}) =>{

                for(let a = 0; a < this.state.promotionTargets.length; a++){
                    if(this.state.promotionTargets[a].id === id){
                        this.state.promotionTargets.splice(a, 1);
                    }
                }

                event.emit(event.names.USER_MESSAGE,'Target was successfully removed from the promotion', 'success');

                resolve(data);

            }, error => reject(error));

        });
    }

}