import {http} from '@/services';
import {event} from '@/services';
import {supplierStore} from '@/stores';
import {endPoints} from '@/services';


export const stockSuppliersStore = {
    state: {
        stockItemSuppliers: [],
    },


    async checkSuppliers(stockItem){
        let stockItemSupplierInfo = [];
        for(let a =0; a < stockItem.relationships.suppliers.data.length; a++) {
            for(let i = 0; i < this.state.stockItemSuppliers.length; i++){
                if(stockItem.relationships.suppliers.data[a].id.toString() === this.state.stockItemSuppliers[i].id.toString()){
                    stockItemSupplierInfo.push(this.state.stockItemSuppliers[i]);
                }
            }
        }

        if(stockItemSupplierInfo.length === 0){
            for(let a =0; a < stockItem.relationships.suppliers.data.length; a++) {
                let info = await this.getStockItemSuppliersInfo(stockItem.relationships.suppliers.data[a].id);
                let stockItemInfo = this.getSupplierInfo(info);

                stockItemSupplierInfo.push(stockItemInfo);
                this.state.stockItemSuppliers.push(stockItemInfo);
            }
        }
        return stockItemSupplierInfo;
    },

    async getStockItemSuppliersInfo(id){
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'stockitem-suppliers/'+id, response => {
                resolve(response.data.data);
            }, error => reject(error));
        });
    },

    getSupplierInfo(data){

        let supplier = supplierStore.getStockSuppliers(data.relationships.supplier.data.id);
        data.relationships.supplier.data.attributes = supplier.attributes;
        return data;
    },


    storeStockSupplier(data){
        return new Promise ((resolve, reject) =>{
            http.post(endPoints.inventory + 'stockitem-suppliers', data, ({data})=>{
                let stockItemSupplierInfo = this.getSupplierInfo(data.data);
                this.state.stockItemSuppliers.push(stockItemSupplierInfo);

                resolve(stockItemSupplierInfo);
                event.emit(event.names.USER_MESSAGE, stockItemSupplierInfo.relationships.supplier.data.attributes.name + ' was added successfully', 'success');
            },error => reject(error));
        })
    },

    updateStockSupplier(stockData){
        return new Promise ((resolve, reject) =>{
            http.patch(endPoints.inventory + 'stockitem-suppliers/'+stockData.data.id, stockData, ({data})=>{
                for(let a = 0; a < this.state.stockItemSuppliers.length; a++){
                    if(this.state.stockItemSuppliers[a].id === data.data.id){
                        this.state.stockItemSuppliers[a] = data.data;
                    }
                }
                resolve(data);
                event.emit(event.names.USER_MESSAGE, data.data.relationships.supplier.data.attributes.name + ' was updated successfully', 'success');
            },error => reject(error));
        })
    },

    removeStockSupplier(supplier){
        return new Promise ((resolve, reject) =>{
            http.delete(endPoints.inventory + 'stockitem-suppliers/'+supplier.id, supplier.id, ({response}) =>{
                for(let a = 0; a < this.state.stockItemSuppliers.length; a++){
                    if(this.state.stockItemSuppliers[a].id === supplier.id){
                        this.state.stockItemSuppliers.splice(a,1);
                    }
                }
                resolve(response);
                event.emit(event.names.USER_MESSAGE,  supplier.relationships.supplier.data.attributes.name+ ' was successfully removed', 'success');
            },error => reject(error));
        })
    }
};