import stub from '@/stubs/product';
import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from "../services";
import {sharedStore} from "./shared";
import {UserLogStore} from './UserLogStore';
import {inventoryStore} from './inventory';

export const sageInfoStore = {
    state: {
        info: [],
        search:[],
        pagination:[]
    },

    async loadCheck(pageNumber){
        sharedStore.showLandingPage();
        let info = [];

        if(!('page_'+pageNumber in this.state.info)){
           info =  await this.init(pageNumber);
        }else{
            info = this.state.info['page_'+pageNumber];
        }

        this.state.pagination.page['current-page'] = pageNumber;
        sharedStore.hideLoadingPage();
        return info;
    },

    init(pageNumber) {
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'sage-info?page[number]='+pageNumber+'&page[size]=50', response => {
                this.state.pagination = response.data.meta;
                this.state.info['page_'+pageNumber] = response.data.data;
                this.state.search = this.state.search.concat(response.data.data);
                event.emit(event.names.SAGE_INFO_PAGINATION, this.state.pagination);
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    changePage(pageNumber)
    {
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'sage-info?page[number]='+pageNumber+'&page[size]=50', response => {

                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    create(data) {
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'sage-info', data, ({data}) => {
                resolve(data.data, event.emit(event.names.USER_MESSAGE, 'Sage info was updated successfully', 'success'))            
            }, error => reject(error));
        })
    },

    updateStock(data, id){
        return new Promise ((resolve, reject) => {
            http.post(endPoints.catalogue + 'product-stockitems/attach' ,data, async ({data})=>{
                let product = await this.productByID(id);
                event.emit(event.names.USER_MESSAGE, product.attributes.title + ' updated successfully', 'success');
                resolve(data.data);
            }, error => reject(error));
        });
    },

    addStockRelationToProduct(stockID, relationshipID, productID){
        for(let a =0; a < this.state.products.length;a++){
            if(this.state.products[a].id.toString() === productID.toString()){
                for(let y = 0; y < this.state.products[a].relationships.stockitems.data.length; y++){
                    if(this.state.products[a].relationships.stockitems.data[y].id === relationshipID){
                        this.state.products[a].relationships.stockitems.data[y].stockitem_id = stockID;
                    }
                }
            }
        }
    },

    removeStockItem(data, id){
        return new Promise((resolve,reject) => {
            http.post(endPoints.catalogue + 'product-stockitems/detach', data, ({data})=>{
                let index = this.all.indexOf(this.productByID(id));
                this.state.products[index].attributes.allstockitems.splice(data.data, 1);
                resolve(data.data);
                event.emit(event.names.USER_MESSAGE, 'Stock item was successfully removed', 'success');
            }, error => reject(error));

        });
    },

    updateProductImageRelationship(data, id){

    },

    sageInfoByID(id){
        return new Promise((resolve,reject) => {
            http.get(endPoints.inventory + 'sage-info/'+id, response => {
                resolve(response.data.data);
            }, error => reject(error));

        });
    },


    searchStore(searchTerm, page){
        if(searchTerm.length > 0) {
            return new Promise((resolve, reject) => {
                http.post(endPoints.catalogue + 'products/search', {searchWord: searchTerm}, ({data}) => {

                    resolve(data.data);
                }, error => reject(error));
            })
        }
        else{
            return this.state.products['page_'+page]
        }
    },

    /* All related product functions */
    updateAttached(id, data){
        return new Promise((resolve, reject)=>{
            http.patch(endPoints.catalogue + 'relatedproducts/'+id, data, ({data})=>{
                for(let i =0; i < this.state.relatedproducts.length; i++){
                    if(this.state.relatedproducts.id === data.id){
                        this.state.relatedproducts[i].order = data.attributes.order;
                    }
                }
                event.emit(event.names.USER_MESSAGE, 'The new order was saved successfully', 'success');
            }, error => reject(error));
        })
    },

    removeRelated(ProductID, relatedID){
        sharedStore.showLandingPage();
            return new Promise((resolve, reject) => {
                http.post(endPoints.catalogue + 'relatedproducts/detach', {
                    'product_id': ProductID,
                    'related_id': relatedID
                }, ({data}) => {
                    // for(let u =0; u < this.state.relatedproducts.length; u++){
                    //     if(this.state.relatedproducts[u].id.toString() === data.data.id.toString()){
                    //         this.state.relatedproducts.splice(u, 1);
                    //     }
                    // }

                    sharedStore.hideLoadingPage();
                    resolve(data.data);
                    event.emit(event.names.USER_MESSAGE, 'Product was removed successfully', 'success');
                }, error => reject(error));
            })
    },

    /* All Cost Effective Products Functions */

    attachCostEffective(id, newData){ 
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.post(endPoints.catalogue + 'costeffectiveproduct' ,newData, ({data})=>{
                let returnData = {
                    'attached_id': data.data.id,
                    'product_id': data.data.attributes.product_id,
                    'cost_effective_id': data.data.attributes.cost_effective_id,
                    'order': data.data.attributes.order,
                };

                for(let i = 0; i < this.state.products.length; i++){
                        this.state.products[i].attributes.costeffective.push(returnData);
                }

                sharedStore.hideLoadingPage();
                resolve(returnData);
            }, error => reject(error));

        });
    },

    removeCostEffectiveProduct(ceID, pID){
        sharedStore.showLandingPage();
        var data = {
            product_id: pID,
            cost_effective_id: ceID
        }
            return new Promise((resolve, reject) => {
                http.post(endPoints.catalogue + 'costeffectiveproduct/detach', data, ({data}) => {
                    for(let u =0; u < this.state.costeffective.length; u++){
                        if(this.state.costeffective[u].id.toString() === ceID.toString()){
                            this.state.costeffective.splice(u, 1);

                        }
                    }
                    this.state.costeffective.push(data.data);
                    this.state.search.push(data.data);
                    sharedStore.hideLoadingPage();
                    resolve(data);
                    event.emit(event.names.USER_MESSAGE, 'Product was removed successfully', 'success');
                }, error => reject(error));
            })
    },

    updateCostEffective(id, data){
        return new Promise((resolve, reject)=>{
            http.patch(endPoints.catalogue + 'costeffectiveproduct/'+id, data, ({data})=>{
                for(let i =0; i < this.state.costeffective.length; i++){
                    if(this.state.costeffective.id === data.id){
                        this.state.costeffective[i].order = data.attributes.order;
                    }
                }
                event.emit(event.names.USER_MESSAGE, 'The new order was saved successfully', 'success');
            }, error => reject(error));
        })
      },

      getProductPrice(){
        for(let y = 0; y < this.state.products.length; y++){
            if(this.state.products[y].attributes.default_stockitem) {

                let price = this.state.products[y].attributes.default_stockitem.price;

                this.state.products[y].attributes.price = price;
                this.state.search[y].attributes.price = price;
            }
        }
      }

      

};
