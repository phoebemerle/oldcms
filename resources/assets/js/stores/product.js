import stub from '@/stubs/product';
import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from "../services";
import {sharedStore} from "./shared";
import {UserLogStore} from './UserLogStore';
import {inventoryStore} from './inventory';

export const productStore = {
    state: {
        products: [],
        relatedproducts: [],
        costeffective: [],
        search:[],
        pagination:[]
    },

    async countProducts(){
            return new Promise((resolve, reject) => {
                http.get(endPoints.catalogue + 'products/count', response => {
                    resolve(response.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    async loadCheck(pageNumber){
        sharedStore.showLandingPage();
        let products = [];

        if(!('page_'+pageNumber in this.state.products)){
            products = await this.init(pageNumber);
        }else{
            products = this.state.products['page_' + pageNumber];
        }

        this.state.pagination.page['current-page'] = pageNumber;
        sharedStore.hideLoadingPage();
        return products;
    },

    init(pageNumber) {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'products',
            // {page: {number: pageNumber, size: 50}}, 
            response => {
                this.state.pagination = response.data.meta;
                this.state.products['page_' + pageNumber] = response.data.data;
                this.state.search = this.state.search.concat(response.data.data);
                event.emit(event.names.PRODUCT_PAGINATION, this.state.pagination);
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    changePage(pageNumber)
    {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'products?page[number]='+pageNumber+'&page[size]=50', response => {

                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    create(data) {
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'products', data, ({data}) => {
                UserLogStore.create(data, 'new', 1)
                window.location = '#!/products/edit/' + data.data.id;
                event.emit(event.names.USER_MESSAGE, data.data.attributes.title+' was created successfully', 'success');
            }, error => reject(error));
        })
    },

    update(data, old_product){
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.catalogue + 'products/'+data.data.id ,data, ({data})=>{           
                UserLogStore.create(data, old_product, 1)
                event.emit(event.names.USER_MESSAGE, data.data.attributes.title+' was updated successfully', 'success');
                resolve(data.data);
		sharedStore.hideLoadingPage();
            }, error => reject(error));
        });
    },

    updateStock(data, id){
        sharedStore.showLandingPage();

        return new Promise ((resolve, reject) => {
            http.post(endPoints.catalogue + 'product-stockitems/attach' ,data, async ({data})=>{
                let product = await this.productByID(id);
                sharedStore.hideLoadingPage();

                event.emit(event.names.USER_MESSAGE, product.attributes.title + ' updated successfully', 'success');
                resolve(data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    updatePivotBulk(data){
        return new Promise ((resolve, reject) => {
            http.post(endPoints.catalogue + 'product-stockitems/bulk/attach' ,data, async ({data})=>{
                event.emit(event.names.USER_MESSAGE, 'Stock Items Updated Successfully', 'success');
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
            http.post(endPoints.catalogue + 'product-stockitems/detach', data, ({ data }) => {
                resolve(data.data);
                event.emit(event.names.USER_MESSAGE, 'Stock item was successfully removed', 'success');
            }, error => reject(error));

        });
    },

    updateProductImageRelationship(data, id){

    },

    productByID(id){
        return new Promise((resolve,reject) => {
            http.get(endPoints.catalogue + 'products/'+id, response => {
                resolve(response.data.data);
            }, error => reject(error));

        });
    },


    searchStore(searchTerm, searchType){
        if(searchTerm.length > 0) {
            sharedStore.showLandingPage();
            return new Promise((resolve, reject) => {
                http.post(endPoints.catalogue + 'products/search', {searchWord: searchTerm, searchType:searchType}, ({data}) => {
                    resolve(data.data);
                }, error => reject(error, sharedStore.hideLoadingPage()));
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

    storeAttached(id, newData){ 
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.post(endPoints.catalogue + 'relatedproducts' ,newData, async ({data})=>{
                var relatedProduct = await this.productByID(data.data.id);
                sharedStore.hideLoadingPage();
                resolve(relatedProduct);
            }, error => reject(error));

        });
    },

    storeLicence(id, newData){
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.post(endPoints.catalogue + 'product-license' ,newData, async ({data})=>{
                var productLicense = await this.productByID(data.data.id);
                sharedStore.hideLoadingPage();
                resolve(productLicense);
            }, error => reject(error));

        });
    },

    removeLicence(ProductID, LicenceID){
        sharedStore.showLandingPage();
            return new Promise((resolve, reject) => {
                http.post(endPoints.catalogue + 'product-license/detach', {
                    'product_id': ProductID,
                    'license_id': LicenceID
                }, ({data}) => {
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
        let data = {
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

    getSavedSections(){
        return new Promise((resolve, reject)=>{
            http.get(endPoints.catalogue + 'saved-product-sections', response => {
                resolve(response.data.data);
            }, error => reject(error));
        })
    },

    saveProductSections(data, productID){
        return new Promise((resolve, reject)=> {
            http.post(endPoints.catalogue + 'product-page-sections', data, ({data}) => {
                resolve(data.data);
                event.emit(event.names.USER_MESSAGE, 'Section Saved Successfully', 'success');
            }, error => reject(error));
        });
    },

    updateProductSections(data, id){
        return new Promise((resolve, reject)=>{
            http.patch(endPoints.catalogue + 'product-page-sections/'+id, data, ({data})=>{
                event.emit(event.names.USER_MESSAGE, 'The new order was saved successfully', 'success');
            }, error => reject(error));
        })
    },

    deleteSection(id, key){
        return new Promise((resolve, reject) => {
            http.delete(endPoints.catalogue + 'product-page-sections/'+id, id, ({data}) => {
                event.emit(event.names.REMOVE_SECTION, key);
                resolve(id);
                event.emit(event.names.USER_MESSAGE, 'Product Section was deleted successfully', 'success');
            }, error => reject(error));
        })
    },

      getProductPrice(){
        for(let y = 0; y < this.state.products.length; y++){
            if(this.state.products[y].attributes.allstockitems.length > 0) {

                let price = this.state.products[y].attributes.allstockitems[0].price;

                this.state.products[y].attributes.price = price;
                this.state.search[y].attributes.price = price;
            }
        }
      },


      

};
