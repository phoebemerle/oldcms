
import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from "../services";
import {sharedStore} from "./shared";

export const homePromosStore = {
    state: {
        promos: [],
        search:[]
    },

    async loadCheck(){
        if(this.state.search.length === 0){
            sharedStore.showLandingPage();
            await this.init();
        }
    },

    init() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'home-page-promos', response => {
                this.all = response.data.data
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    update(data, id){
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.catalogue + 'home-page-promos/'+id ,data, ({data})=>{
                let index = this.all.indexOf(this.promoByID(id));
                this.all.splice(index, 1);
                this.all.push(data.data);
                this.all = this.sortArray(this.all);
                event.emit(event.names.USER_MESSAGE, data.data.attributes.title+' was updated successfully', 'success');
                resolve(data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error));
        });
    },

    sortArray(all) {
    function compare(a, b) {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    }

    return all.sort(compare)
    },

    get all() {
        return this.state.promos;
    },


    set all(value) {
        this.state.promos = value;
        this.state.search = value;
        return this.state.promos;
    },

    promoByID(id){
        const stringID = id.toString();
        return this.all.find(promos => promos.id === stringID);

    },

    searchStore(searchTerm){
        if(searchTerm.length > 0) {
            let searchResults = [];
            let upperSearch = searchTerm.toUpperCase();

            for (let a = 0; a < this.all.length; a++) {

                let upperTitle = this.all[a].attributes.title.toUpperCase();

                if (upperTitle.includes(upperSearch)) {
                    searchResults.push(this.all[a]);
                }
            }

            this.state.search = searchResults;
        }
        else{
            this.state.search = this.all;
        }
    },
};