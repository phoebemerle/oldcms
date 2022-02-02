import stub from '@/stubs/supplier';
import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";

export const supplierStore = {
    state: {
        suppliers: [stub],
        search:[]
    },

    async checkLoading(){
        if(this.state.suppliers[0].attributes.id === 0){
            sharedStore.showLandingPage();
            await this.init();
        }
        return this.state.suppliers;
    },


    init(supplier) {
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'supplier', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.suppliers;
    },

    set all(value) {
        this.state.suppliers = value;
        this.state.search = value;
        return this.state.suppliers;
    },

    getStockSuppliers(supplierID){
        for(let a = 0; a < this.state.suppliers.length; a++){
            if(this.state.suppliers[a].id.toString() === supplierID.toString()){
                return this.state.suppliers[a];
            }

        }
    },

    checkSearch(suppliers){
        let tempSuppliers = [];
        for(let i = 0; i < this.state.suppliers.length; i ++){
            tempSuppliers.push(this.state.suppliers[i]);
        }
        for(let y = 0; y < suppliers.length; y++){
            for(let x = 0; x < tempSuppliers.length; x++){
                if(suppliers[y].id.toString() === tempSuppliers[x].id.toString()){
                    tempSuppliers.splice(x, 1);
                }
            }
        }
        this.state.search = tempSuppliers;
    },

    searchSuppliers(searchTerm, suppliers){

        if(searchTerm.length > 0) {
            let search = searchTerm.toUpperCase();
            let searchResults = [];

            for (let a = 0; a < this.all.length; a++) {
                let upperName = this.all[a].attributes.name.toUpperCase();
                if (upperName.includes(search)) {
                    searchResults.push(this.all[a]);
                }
            }
            for(let u = 0; u < searchResults.length; u++){
                for(let y = 0; y < suppliers.length; y++){
                    if(suppliers[y].id.toString() === searchResults[u].id.toString()){
                        searchResults.splice(u,1);
                    }
                }
            }

            this.state.search = searchResults;
        }else{
            this.checkSearch(suppliers);
        }
    }

};