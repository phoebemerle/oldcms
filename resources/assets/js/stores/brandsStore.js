import {http} from '@/services';
import {event} from '@/services';
import stub from '@/stubs/brandInfo';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";

export const brandsStore = {
    state: {
        brands: [],
        brandConfig:[],
        search:[],
        featured:[],
        pagination:[]
    },

    async loadCheck(){
        sharedStore.showLandingPage();
        let brands = [];

        if(this.state.brands.length <= 0){
           brands =  await this.init();
        }else{
           brands = this.state.brands;
        }

        sharedStore.hideLoadingPage();
        return brands;
    },

    init() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'brands', response => {
                this.state.pagination = response.data.meta;
                this.state.brands= response.data.data;
                this.state.search = this.state.search.concat(response.data.data);
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    changePage(pageNumber)
    {
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'brands?page[number]='+pageNumber+'&page[size]=50', response => {

                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    brandByID(id){
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'brands/'+id, response => {
                resolve(response.data.data);
            }, error => reject(error));
        })
    },

    saveNewBrandConfig(data){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) =>{
            http.post(endPoints.catalogue + 'brands', data,({data}) => {
                this.state.brandConfig.push(data.data);
                resolve(data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error));
        })
    },

    getBrandConfig(id){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'brands/'+id, response => {
                this.state.brandConfig.push(response.data.data);
                resolve(response.data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, resolve(null), sharedStore.hideLoadingPage()));
        });
    },

    updateBrandConfig(data, id){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.patch(endPoints.catalogue + 'brands/'+id, data, ({data}) => {
                for(let x=0; x < this.state.brandConfig.length; x++){
                    if(this.state.brandConfig[x].id.toString() === data.data.id.toString()){
                        this.state.brandConfig[x] = data.data;
                    }
                }
                resolve(data.data);
                sharedStore.hideLoadingPage();
                event.emit(event.names.USER_MESSAGE, 'Brand info has been updated', 'success');
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    updateBrand(data, id){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.patch(endPoints.inventory + 'brands/'+id, data, ({data}) => {
                event.emit(event.names.USER_MESSAGE, 'Brand contact info has been updated', 'success');
                sharedStore.hideLoadingPage();
            }, error => reject(error));
        });
    },

    storeBrandInfo(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'brands', data, ({data}) => {

                resolve(data.data);
            }, error => reject(error));
        });
    },

    searchStore(searchTerm, page){
        if(searchTerm.length > 0) {
            return new Promise((resolve, reject) => {
                http.get(endPoints.inventory + 'brands/search?search='+searchTerm, ({data}) => {
                    resolve(data.data);
                }, error => reject(error));
            });
        } else {
            return this.state.brands['page_'+page];
        }
    },

    async findFeaturedBrands(){
        let featured = [];

        if(this.state.brands.length === 1 ){
            sharedStore.showLandingPage();
            await this.init(1);
        }

        if(this.state.featured.length > 0){
            featured = this.state.featured;
        }else{
            featured = await this.getFeaturedBrands();
        }

        for (let x = 0; x < featured.length; x++){
            for (let z = 0; z < this.state.search.length; z++){
                if(featured[x].attributes.brand_id.toString() === this.state.search[z].id.toString()){
                    featured[x].attributes.name = this.state.search[z].attributes.name;
                }
            }
        }

        this.state.featured = featured;
        sharedStore.hideLoadingPage();
        return featured;

    },

    async getFeaturedBrands(){
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'brands/featured-brands', ({data}) => {
                this.state.featured = data.data;
                resolve(data.data);
            }, error => reject(error));
        });
    }

};
