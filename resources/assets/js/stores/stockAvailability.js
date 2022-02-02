import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";

export const stockAvailabilityStore = {
    state: {
        availability: [],
        search: []
    },

    async checkLoading(){
        if(this.state.availability.length === 0){
            sharedStore.showLandingPage();
            await this.init();
        }

        return this.state.availability;
    },

    init(){
        return new Promise((resolve, reject) => {
            http.get(endPoints.inventory + 'stock-availability', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.availability;
    },

    set all(value) {
        this.state.availability = value;
        this.state.search = value;
        return this.state.availability;
    },

    getStockAvailabilityByID(id){
        for(let a = 0; a < this.state.availability.length; a ++){
            if(id.toString() === this.state.availability[a].id.toString()){
                return this.state.availability[a];
            }
        }
    },

    update(data, id){
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.inventory + 'stock-availability/'+id ,data, ({data})=>{
                event.emit(event.names.USER_MESSAGE, data.data.attributes.availability+' was updated successfully', 'success');
                resolve(data.data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    create(data) {
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'stock-availability', data, ({data}) => {
                this.all.push(data.data);
                window.location="/#!/stock-availability";
                event.emit(event.names.USER_MESSAGE, data.data.attributes.availability+' was created successfully', 'success');
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        })
    },

    searchStore(searchTerm){
        if(searchTerm.length > 0) {
            let searchResults = [];
            let upperSearch = searchTerm.toUpperCase();

            for (let a = 0; a < this.all.length; a++) {
                let upperTitle = this.all[a].attributes.availability.toUpperCase();
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