import {http} from '@/services';
import {event} from '@/services';
import {inventoryStore} from '@/stores';
import {endPoints} from '@/services';

export const bomComponentStore = {

    state: {
        bomComponents: [],
        search:[]
    },

    async checkBomComponents(stockID){

        let counter = 0;

        //Check to see if supplier are already stored, if so skip to pulling them out
        for(let s =0; s < this.state.bomComponents.length; s++){
            if(this.state.bomComponents[s].id === stockID) {
                counter = 1
            }
        }

        if(counter === 0) {
            let componentInfo = await this.getComponentsInfo(stockID);
            await this.getComponents(componentInfo);
            await this.getComponentAlternatives(componentInfo);
        }

        let returnedComponent =[];

        for(let y = 0; y < this.state.bomComponents.length; y++){
            if(this.state.bomComponents[y].id === stockID){
                returnedComponent.push(this.state.bomComponents[y]);
            }
        }

        return returnedComponent;

    },

    async getComponentsInfo(ID){
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'stockitems/'+ID+'?include=bom_components.alternatives', response => {
                if(response.data.included) {
                    for(let x =0; x < response.data.included.length; x++) {
                        if (response.data.included[x].type === 'bom-components') {
                            this.state.bomComponents.push({
                                'id': ID,
                                'bom_attributes': {
                                    'id': response.data.included[x].id,
                                    'qty': response.data.included[x].attributes.qty,
                                    'stock_id': response.data.included[x].relationships.stockitem.data.id
                                },
                                alt_attributes: []
                            });
                        }
                    }
                    resolve(response.data.included);
                }
            }, error => reject(error));
        });
    },


    async getComponents(bomComponents){
        let bomComponentsID = [];

        for(let g =0; g < bomComponents.length; g++){
            bomComponentsID.push({
                'id':bomComponents[g].relationships.stockitem.data.id
            });
        }

        let returnedStockItem = await inventoryStore.getStockItem(bomComponentsID);

        for(let f =0; f <returnedStockItem.length; f++){
            for(let r = 0; r < this.state.bomComponents.length; r++){
                if(returnedStockItem[f].id === this.state.bomComponents[r].bom_attributes.stock_id){
                    this.state.bomComponents[r].bom_attributes.code = returnedStockItem[f].attributes.code;
                    this.state.bomComponents[r].bom_attributes.description = returnedStockItem[f].attributes.description;
                    }
                }
            }
    },

    async getComponentAlternatives(bomComponents){
        let stockItems = [];
        let altList = [];
        let altComponents = [];
        let bomComponentsID = [];

        for(let g=0; g < bomComponents.length;g++){
            if(bomComponents[g].type === 'alt-components'){
                altList.push(bomComponents[g]);
            }
        }

        for(let z = 0; z < altList.length; z++){

                bomComponentsID.push({
                    'id':altList[z].relationships.stockitem.data.id,
                    'bom_id':altList[z].relationships.component.data.id
                });

            stockItems = await inventoryStore.getStockItem(bomComponentsID);
        }

        for(let s=0; s < stockItems.length; s++){
           for(let a=0; a < altList.length;a++){
               if(altList[a].relationships.stockitem.data.id === stockItems[s].id){
                   altComponents.push({
                       'bom_id':altList[a].relationships.component.data.id,
                       'name':stockItems[s].attributes.description,
                       'stock_id':stockItems[s].id,
                       'code':stockItems[s].attributes.code,
                       'id':altList[a].id
                   })
               }
           }
        }
        this.attachAlternativeComponents(altComponents);
    },

    attachAlternativeComponents(components){

        for(let t = 0; t < components.length; t++){
            for(let y = 0; y < this.state.bomComponents.length;y++){
                if(components[t].bom_id === this.state.bomComponents[y].bom_attributes.id){
                    this.state.bomComponents[y].alt_attributes.push(
                        {
                            'stock_id':components[t].stock_id,
                            'code':components[t].code,
                            'name':components[t].name,
                            'alt_id':components[t].id
                        }
                    )
                }
            }
        }

    },

    async storeBomComponent(data, name, code){
        return new Promise ((resolve, reject) =>{
            http.post(endPoints.inventory + 'bom-components', data, ({data})=>{
                let newBom = {
                    'id':data.data.relationships.bom.data.id,
                    'bom_attributes':{
                        'id':data.data.id,
                        'qty':data.data.attributes.qty,
                        'stock_id':data.data.relationships.stockitem.data.id,
                        'code':code,
                        'description':name
                    }
                };

                this.state.bomComponents.push(newBom);

                resolve(newBom);
                event.emit(event.names.USER_MESSAGE, name + ' suppliers were updated successfully', 'success');
            },error => reject(error));
        })

    },

    removeBomComponent(id, ComponentName){
        return new Promise ((resolve, reject) =>{
            http.delete(endPoints.inventory + 'bom-components/'+id, id, ({response}) =>{
                for(let g=0; g < this.state.bomComponents.length; g++){
                    if(this.state.bomComponents[g].bom_attributes.id === id){
                        this.state.bomComponents.splice(g, 1);
                    }
                }
                resolve(response);
                event.emit(event.names.USER_MESSAGE, ComponentName + ' was successfully removed', 'success');
            },error => reject(error));
        })
    },

    updateBomComponent(data, id, name){
        return new Promise ((resolve, reject) =>{
            http.patch(endPoints.inventory + 'bom-components/'+id, data, ({data})=>{

                for(let f =0; f< this.state.bomComponents.length; f++){
                    if(this.state.bomComponents[f].bom_attributes.id === id){
                        this.state.bomComponents[f].bom_attributes.qty = data.data.attributes.qty;
                    }
                }
                resolve(data);
                event.emit(event.names.USER_MESSAGE, name + ' was updated successfully', 'success');
            },error => reject(error));
        })
    },

    removeAltComponent(id, bomID){
        return new Promise ((resolve, reject) =>{
            http.delete(endPoints.inventory + 'alt-components/'+id, id, ({response}) =>{

               for(let g=0; g < this.state.bomComponents.length; g++){
                    if(this.state.bomComponents[g].bom_attributes.id === bomID){
                        for(let t=0; t < this.state.bomComponents[g].alt_attributes.length; t++){
                            if(this.state.bomComponents[g].alt_attributes[t].alt_id === id){
                                this.state.bomComponents[g].alt_attributes.splice(t, 1);
                            }
                        }
                    }
                }
                resolve(response);
            },error => reject(error));
        })
    },

    async storeAltComponent(data, stockCode, stockName){
        return new Promise ((resolve, reject) =>{
            http.post(endPoints.inventory + 'alt-components', data, ({data})=>{
                for(let g = 0; g < this.state.bomComponents.length;g++){
                    if(this.state.bomComponents[g].bom_attributes.id === data.data.relationships.component.data.id){
                        this.state.bomComponents[g].alt_attributes.unshift({
                            'alt_id':data.data.id,
                            'code':stockCode,
                            'name':stockName,
                            'stock_id':data.data.relationships.stockitem.data.id,
                        })
                    }
                }

                resolve(data);
            },error => reject(error));
        })
    }
}