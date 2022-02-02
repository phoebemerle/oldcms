import stub from '@/stubs/inventory';
import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";

export const inventoryStore = {
    state: {
        inventory: [stub],
        search:[],
        pagination:[]
    },

    async loadCheck(pageNumber){
        sharedStore.showLandingPage();
        let inventory = [];

        if(!('page_'+pageNumber in this.state.inventory)){
           inventory =  await this.init(pageNumber);
        }else{
           inventory = this.state.inventory['page_'+pageNumber];
        }

        this.state.pagination.page['current-page'] = pageNumber;
        sharedStore.hideLoadingPage();
        return inventory;
    },

    init(pageNumber) {
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'stockitems?page[number]='+pageNumber+'&page[size]=50', response => {
                this.state.pagination = response.data.meta;
                this.state.inventory['page_'+pageNumber] = response.data.data;
                this.state.search = this.state.search.concat(response.data.data);
                event.emit(event.names.INVENTORY_PAGINATION, this.state.pagination);
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    changePage(pageNumber)
    {
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'stockitems?page[number]='+pageNumber+'&page[size]=50', response => {
                this.state.pagination = response.data.meta;
                this.state.inventory['page_'+pageNumber] = response.data.data;
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    create(data) {
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'stockitems', data, ({data}) => {
                window.location = '#!/inventory/edit/'+data.data.id;
                event.emit(event.names.USER_MESSAGE, data.data.attributes.description+' was created successfully', 'success');
                resolve(data.data);
            }, error => reject(error));
        })
    },
 
    edit(data, id){
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.inventory + 'stockitems/'+id ,data, ({data})=>{
                resolve(data.data)
                event.emit(event.names.USER_MESSAGE, data.data.attributes.description+' was updated successfully', 'success');
           }, error => reject(error));
        });
    },

    stockItemByID (id){
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'stockitems/'+id, response => {
                resolve(response.data.data);
            }, error => reject(error));
        })
    },

    checkInventorySearch(stockItems, type){
        let tempStockItems = [];

            for (let i = 0; i < this.state.inventory.length; i++) {
                tempStockItems.push(this.state.inventory[i]);
            }
        if(type === 'stockItem') {
            for (let y = 0; y < stockItems.length; y++) {
                for (let x = 0; x < tempStockItems.length; x++) {
                    if(tempStockItems[x].id) {
                        if (stockItems[y].id.toString() === tempStockItems[x].id.toString()) {
                            tempStockItems.splice(x, 1);
                        }
                    }
                }
            }
        }else if(type === 'bom'){
            for (let y = 0; y < stockItems.length; y++) {
                for (let x = 0; x < tempStockItems.length; x++) {
                    if (stockItems[y].bom_attributes.stock_id.toString() === tempStockItems[x].id.toString()) {
                        tempStockItems.splice(x, 1);
                    }
                }
            }
        }
            this.state.search = tempStockItems;
    },

    filter(searchTerm){
        if(searchTerm.length > 0) {
            return new Promise((resolve, reject) => {
                http.post(endPoints.inventory + 'stockitems/search', {searchTerm: searchTerm}, ({data}) => {
                
                    resolve(data.data);
                }, error => reject(error));
            })
        } else {
            return [];
        }
    },

    searchStore(searchTerm, page){
        if(searchTerm.length > 0) {
            sharedStore.showLandingPage();
            return new Promise((resolve, reject) => {
                http.post(endPoints.inventory + 'stockitems/search', {searchTerm: searchTerm}, ({data}) => {

                    resolve(data.data);
                    sharedStore.hideLoadingPage();
                }, error => reject(error, sharedStore.hideLoadingPage()));
            })
        } else {
            return this.state.inventory['page_'+page];
            
        }
    },

    getGroups(groupId){
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'stockitems/bygroup/'+groupId, response => {
                resolve(response.data.data);
            }, error => reject(error));
        })
    },


    getStockItem(stockId){
        let stockItem = [];
        for(let a = 0; a < stockId.length; a++){
           let ID = stockId[a].id.toString();
           for(let s = 0; s < this.all.length; s++){
               if(ID === this.all[s].id){
                   stockItem.push(this.all[s]);
               }
           } 
        }
        return stockItem;
    },

    updateAttributesRelationships(data, type){
        let inventoryID = data.data.relationships.stockitem.data.id;
        let attributeID = data.data.id;

        for(let a = 0; a < this.state.inventory.length; a++){
            if(this.state.inventory[a].id.toString() === inventoryID.toString()){

                if(type === 'remove'){
                    for(let i = 0; 0 < this.state.inventory[a].relationships.attributes.data.length; i++){
                        if(this.state.inventory[a].relationships.attributes.data[i].id === attributeID){
                            this.state.inventory[a].relationships.attributes.data.splice(i, 1);
                            break;
                        }
                    }
                }else if(type === 'add'){
                    this.state.inventory[a].relationships.attributes.data.push({
                        'id':attributeID,
                        'type':'attributes'
                    })
                }
            }
        }
    },


    //gets the stock ID
    getStockID(id){
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'product-stockitems/'+id, response => {
                resolve(response.data.data.attributes.stockitem_id);
            }, error => reject(error));
        })
    },

    findProductPrice(id){
                for(let i = 0; i < this.state.inventory.length; i++){

                    if(id.toString() === this.state.inventory[i].id.toString()){
                        return this.state.inventory[i].attributes.prices[0];
                    }
                }
            }

    };

