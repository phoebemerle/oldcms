import stub from '@/stubs/productGroup';
import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from "../services";
import {sharedStore} from "./shared";

export const productGroupsStore = {
    state: {
        productGroups: [],
        search:[],
        pagination:[]
    },

    async checkLoad(){
        if(this.state.productGroups.length === 0){
            sharedStore.showLandingPage();
            await this.init();
        }

        return this.state.productGroups;
    },

    init(){
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'productgroup', response => {
                this.state.productGroups = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    async loadCheck(pageNumber){
        sharedStore.showLandingPage();
        let productGroups = [];

        if(!('page_'+pageNumber in this.state.productGroups)){
            productGroups =  await this.initPage(pageNumber);
        }else{
            productGroups = this.state.productGroups['page_'+pageNumber];
        }

        this.state.pagination.page['current-page'] = pageNumber;
        sharedStore.hideLoadingPage();
        return productGroups;
    },

    initPage(pageNumber) {
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'productgroup?page[number]='+pageNumber+'&page[size]=50', response => {
                this.state.pagination = response.data.meta;
                this.state.productGroups['page_'+pageNumber] = response.data.data;
                this.state.search = this.state.search.concat(response.data.data);
                event.emit(event.names.INVENTORY_GROUP_PAGINATION, this.state.pagination);
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    changePage(pageNumber)
    {
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'productgroup?page[number]='+pageNumber+'&page[size]=50', response => {

                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },


    // async checkLoad(){
    //     if(this.state.search.length === 0){
    //         sharedStore.showLandingPage();
    //         await this.init();

    //     }
    //     return this.state.productGroups;
    // },

    // init(productGroup) {
    //     return new Promise((resolve, reject) => {
    //         http.get(endPoints.inventory + 'productgroup', response => {
    //             this.all = response.data.data;
    //             resolve(this.all);
    //             sharedStore.hideLoadingPage();
    //         }, error => reject(error, sharedStore.hideLoadingPage()));
    //     });
    // },

     create(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'productgroup', data, ({data}) => {
                this.all.unshift(data.data);
                event.emit(event.names.USER_MESSAGE, data.data.attributes.name+' was created successfully', 'success');
                window.location = '#!/groups/edit/'+data.data.id;
                resolve(data.data);
            }, error => reject(error));
        })
    },

    edit(data, id){
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.inventory + 'productgroup/'+id ,data, ({data})=>{
                let index = this.all.indexOf(this.byGroupID(data.data.id));
                this.all.splice(index, 1);
                this.all.unshift(data.data);
                event.emit(event.names.USER_MESSAGE, 'Product group data has been updated successfully', 'success');
                resolve(data.data);
            }, error => reject(error));
        });
    },

    editAssociatedInventory(data, id){
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.inventory + 'stockitem/'+id ,data, ({data})=>{
                let index = this.all.indexOf(this.byGroupID(data.data.id));
                this.all.splice(index, 1);
                this.all.unshift(data.data);
                sharedStore.hideLoadingPage();
                event.emit(event.names.USER_MESSAGE, 'Associated Stock Items was updated successfully', 'success');
                resolve(data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.productGroups;
    },

    set all(value) {
        this.state.search = value;
        this.state.productGroups = value;
        return this.state.productGroups;
    },

    // searchStore(searchTerm){
    //     if(searchTerm.length > 0) {
    //         var searchResults = [];
    //         var upperSearch = searchTerm.toUpperCase();
    //         for (var a = 0; a < this.all.length; a++) {

    //             var upperCode = this.all[a].attributes.code.toUpperCase();
    //             var upperName = this.all[a].attributes.name.toUpperCase();

    //             if ((upperCode.includes(upperSearch)) || (upperName.includes(upperSearch))) {
    //                 searchResults.push(this.all[a]);
    //             }
    //         }

    //         this.state.search = searchResults;
    //     }
    //     else{
    //         this.state.search = this.all;
    //     }
    // },

    searchStore(searchTerm, page){
        if(searchTerm.length > 0) {
            sharedStore.showLandingPage();
            return new Promise((resolve, reject) => {
                http.post(endPoints.inventory + 'productgroup/search', {searchTerm: searchTerm}, ({data}) => {
                
                    resolve(data.data);
                }, error => reject(error, sharedStore.hideLoadingPage()));
            })
        } else {
            return this.state.productGroups['page_'+page]
        }
    },

    byGroupID(id){
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'productgroup/'+id, response => {
                resolve(response.data.data);
            }, error => reject(error));
        })
    }

};