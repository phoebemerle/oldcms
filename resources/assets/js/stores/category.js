import {http} from '@/services';
import {event} from '@/services';
import {productStore, UserLogStore} from "@/stores";
import {endPoints} from '@/services';
import {sharedStore} from "./shared";

export const categoryStore = {

    state: {
        categories: [],
        children: [],
        otherranges: [],
        search:[],
        pagination:[],
        featuredCategories:[]
    },

    async loadCheck(pageNumber){
        sharedStore.showLandingPage();

        let categories = [];

        if(!('page_'+pageNumber in this.state.categories)){
            categories =  await this.init(pageNumber);

        }else{
            categories = this.state.categories['page_'+pageNumber];
        }

        this.state.pagination.page['current-page'] = pageNumber;
        sharedStore.hideLoadingPage();
        return categories;
    },

    init(pageNumber) {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'categories?page[number]='+pageNumber+'&page[size]=50', response => {
                this.state.pagination = response.data.meta;
                this.state.categories['page_'+pageNumber] = response.data.data;
                this.state.search = this.state.search.concat(response.data.data);
                event.emit(event.names.CATEGORY_PAGINATION, this.state.pagination);
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },


    changePage(pageNumber)
    {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'categories?page[number]='+pageNumber+'&page[size]=50', response => {

                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    addToSearch(data){
        let array = this.state.search.concat(data);
        // if(this.state.search.length > 0){
        //     this.state.search[0].concat(data);
        // }else{
        //     this.state.search.concat(data);
        // }
    },

    create(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'categories', data, ({data}) => {
                UserLogStore.create(data, 'new', 2);
                window.location = '#!/categories/edit/'+data.data.id;
                event.emit(event.names.USER_MESSAGE, data.data.attributes.title+' was created successfully', 'success');
                resolve(data.data);
            }, error => reject(error));
        })
    },

    update(newData, oldData){
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.catalogue + 'categories/'+newData.data.id ,newData, ({data})=>{
                if(this.state.categories.filter(row => row.id === data.data.id).length > 0) {
                    let index = this.state.categories.indexOf(this.categoryByID(data.data.id));
                    this.state.categories.splice(index, 1);
                    this.state.categories.unshift(data.data);
                }
                UserLogStore.create(data, oldData, 2)
                sharedStore.hideLoadingPage();
                event.emit(event.names.USER_MESSAGE, 'Category was updated successfully', 'success');
                resolve(data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    detatchChildren(id) {
        return new Promise ((resolve, reject) => {
            http.get(endPoints.catalogue + 'categories/detach-children/'+id, response =>{
                resolve(response);
            }, error => reject(error));

        });
    },

    storeAttached(id, newData){
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.post(endPoints.catalogue + 'nodes' ,newData, ({data})=>{
                let returnData = {
                    'id': data.data.relationships.child.data.id,
                    'node_id': data.data.id,
                    'order': data.data.attributes.order,
                    'type': data.data.relationships.child.data.type
                };

                for(let i = 0; i < this.state.categories.length; i++){
                    if(this.state.categories[i].id === data.data.relationships.category.data.id){
                        this.state.categories[i].attributes.children.push(returnData);
                    }
                }

                sharedStore.hideLoadingPage();
                resolve(returnData);
            }, error => reject(error));

        });
    },

    removeChild(id){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.delete(endPoints.catalogue + 'nodes/'+id, id, ({data}) => {
                for(let u =0; u < this.state.children.length; u++){
                    if(this.state.children[u].id.toString() === id.toString()){
                        this.state.children.splice(u, 1);
                    }
                }
                sharedStore.hideLoadingPage();
                resolve(data);
                event.emit(event.names.USER_MESSAGE, 'Category was updated successfully', 'success');
            }, error => reject(error));
        })
    },

    updateProducts(data){
        return new Promise((resolve, reject)=>{
            http.patch(endPoints.catalogue + 'nodes', data, ({data})=>{
                // for(let i =0; i < this.state.children.length; i++){
                //     if(this.state.children.id === data.id){
                //         this.state.children[i].order = data.attributes.order;
                //     }
                // }
                event.emit(event.names.USER_MESSAGE, 'The new order was saved successfully', 'success');
            }, error => reject(error));
        })
    },

    updateFeatured(id, data){
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.catalogue + 'categories/'+id ,data, ({data})=>{
                let index = this.all.indexOf(this.categoryByID(data.data.id));
                this.all.splice(index, 1);
                this.all.unshift(data.data);
                resolve(data.data);

            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    async findProducts(products){
        return await productStore.productByID(products.id);
    },

    findCategories(category){
        for(let c=0; c < this.state.categories.length; c++){
            if(this.state.categories[c].id.toString() === category.relationships.children.data.id.toString()){
                return this.state.categories[c];
            }
        }
    },

    categoryByID(id){
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'categories/' + id, response => {
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },


    searchStore(searchTerm, active = 1){
        if(searchTerm.length > 0) {
            sharedStore.showLandingPage();

            return new Promise((resolve, reject) => {
                http.post(endPoints.catalogue + 'categories/search', {searchWord: searchTerm, active: active}, ({data}) => {
                    resolve(data.data);
                    sharedStore.hideLoadingPage()
                }, error => reject(error), sharedStore.hideLoadingPage());
            })
        }
        else{
            return this.state.categories['page_'+page];
        }
    },

    async findFeaturedCategories(){
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'categories/featured', response => {
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });

    },

    async findNavigationOrder() {
        return new Promise((resolve) => {
            let navigationOrder = [];
            http.get(endPoints.catalogue + 'categories/nav', response => {
                    navigationOrder = response.data.data;
                    resolve(navigationOrder);
                },
            );
        });
    },

    updateNavigation(id, data){
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.catalogue + 'categories/'+id ,data, ({data})=>{
                resolve(data.data);
                event.emit(event.names.USER_MESSAGE, 'The new order was saved successfully', 'success');
            }, error => reject(error));
        });
    },

    storeOtherRange(id, newData) {
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'otherranges', newData, async ({ data }) => {
                var otherRange = await this.categoryByID(data.data.attributes.other_range_id);
                sharedStore.hideLoadingPage();
                resolve(otherRange);
            }, error => reject(error));

        });
    },

    removeRange(id) {
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.delete(endPoints.catalogue + 'otherranges/' + id, id, ({ data }) => {
                for (let u = 0; u < this.state.otherranges.length; u++) {
                    if (this.state.otherranges[u].id.toString() === id.toString()) {
                        this.state.otherranges.splice(u, 1);
                    }
                }
                sharedStore.hideLoadingPage();
                resolve(data);
                event.emit(event.names.USER_MESSAGE, 'Product was removed successfully', 'success');
            }, error => reject(error));
        })
    },

    updateAttached(id, data) {
        return new Promise((resolve, reject) => {
            http.patch(endPoints.catalogue + 'otherranges/' + id, data, ({ data }) => {
                for (let i = 0; i < this.state.otherranges.length; i++) {
                    if (this.state.otherranges.id === data.id) {
                        this.state.otherranges[i].order = data.attributes.order;
                    }
                }
                event.emit(event.names.USER_MESSAGE, 'The new order was saved successfully', 'success');
            }, error => reject(error));
        })
    },

    uploadImage(data) {
        sharedStore.showLandingPage();
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        return new Promise((resolve, reject) => {
            axios.post('http://catalogue.dev.local/api/category/image/upload', data, config)
            .then(response => {
                sharedStore.hideLoadingPage();
                resolve(response.data);
            })
            .catch(error => {
                console.error(error);
                reject(error);
                sharedStore.hideLoadingPage()
            })
        })
    }

}