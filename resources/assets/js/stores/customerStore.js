import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";

export const customerStore = {
    state: {
        customers: [],
        search: [],
    },

    async searchState(searchTerm, type){
        sharedStore.showLandingPage();
        let found = [];

        for(let i = 0; i < this.state.customers.length; i++){
            if(type === 'id'){
                if(this.state.customers[i].id.toString() === searchTerm.toString()){
                    found.push(this.state.customers[i]);
                }
            }else{
                if(this.state.customers[i].attributes.type === searchTerm){
                    found.push(this.state.customers[i]);
                }
            }
        }
        sharedStore.hideLoadingPage();

        if(found.length === 0 ){
            return await this.searchStore(searchTerm.toString(), type);
        }else{
            return found;
        }
    },

    searchStore(searchTerm, type){
        if(searchTerm.length > 0) {
            return new Promise((resolve, reject) => {
                http.post(endPoints.accounts + 'details/search', {searchWord: searchTerm, type: type}, ({data}) => {
                    for (let u = 0; u < data.data.length; u++) {
                        this.state.customers.push(data.data[u]);
                    }
                    resolve(data.data);
                }, error => reject(error));
            });
        }
    },

    updateCustomer(data){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
                http.patch(endPoints.accounts + 'customer-details/update/'+data.data.id ,data, ({data})=>{
                    let customerAccount = this.state.customers.find(customer => customer.id === data.data.id);
                    customerAccount = data.data;
                    event.emit(event.names.USER_MESSAGE, 'User details have successfully been saved', 'success');
                    resolve(data.data);
                    sharedStore.hideLoadingPage();
                }, error => reject(error, sharedStore.hideLoadingPage(),  event.emit(event.names.USER_MESSAGE, 'Something went wrong!', 'error')));
            });
    },

    updatePassword(data){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.patch(endPoints.accounts + 'change-password' ,data, ({data})=>{
                resolve(data.data);
                event.emit(event.names.USER_MESSAGE, 'Password has been successfully changed', 'success');
                sharedStore.hideLoadingPage()
            }, error => reject(error, sharedStore.hideLoadingPage(),  event.emit(event.names.USER_MESSAGE, 'Something went wrong!', 'error')));
        });
    },

    updateAddress(data) {
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.patch(endPoints.accounts + 'customer-addresses/'+data.address_id,data, ({data})=>{
                let customerAccount = this.state.customers.filter(customer => customer.attributes.AccountNumber === data.data.attributes.AccountNumber);
                for(let x = 0; x < customerAccount.length; x++){
                   this.updateStateAddress(customerAccount[x], data.data);
                };
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage(),  event.emit(event.names.USER_MESSAGE, 'Something went wrong!', 'error')));
        });
    },

    updateMarketingPref(data) {
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.patch(endPoints.accounts + 'customer-details/marketing',{data:data}, ({data})=>{
                let customerAccount = this.state.customers.find(customer => customer.id === data.data.attributes.user_id.toString());
                customerAccount.attributes.marketing_preferences = data.data.attributes;
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage(),  event.emit(event.names.USER_MESSAGE, 'Something went wrong!', 'error')));
        });

    },

    saveMarketingPref(data) {
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.post(endPoints.accounts + 'marketing-preference',{data:data}, ({data})=>{
                let customerAccount = this.state.customers.find(customer => customer.id === data.data.attributes.user_id.toString());
                customerAccount.attributes.marketing_preferences = data.data.attributes;
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage(),  event.emit(event.names.USER_MESSAGE, 'Something went wrong!', 'error')));
        });

    },

    updateStateAddress(account, newAddress){
        let type = 'deliveryaddresses';
        if(newAddress.attributes.Type === "invoice"){
            type = 'invoiceaddresses';
        }

        for(let i = 0; i < account.attributes[type].length; i++){
            if(account.attributes[type][i].address_id.toString() === newAddress.id.toString() ){
                account.attributes[type][i] = newAddress.attributes;
                account.attributes[type][i].address_id = newAddress.id;
            }
        }
    },

    async checkAdditionalUsers(AccountNumber, id){
        let customerAccounts = this.state.customers.filter(customer => customer.attributes.AccountNumber === AccountNumber);

        if(customerAccounts.length <= 1){
            customerAccounts = await this.searchStore(AccountNumber, 'AccountNumber');
        }

        for(let x = 0; x < customerAccounts.length; x++){
            if(customerAccounts[x].id.toString() === id.toString()){
                customerAccounts.splice(x, 1);
            }
        }

        return customerAccounts;
    }

};