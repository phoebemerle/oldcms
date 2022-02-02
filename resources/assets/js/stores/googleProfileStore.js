import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";

export const googleProfileStore = {

    state: {
        profiles: [],
    },


    async checkStore(id){
        let profilesArray = null;
        sharedStore.showLandingPage();
        if(this.state.profiles.length > 0){
            for(let a = 0; a < this.state.profiles.length; a++){
                if(id.toString() === this.state.profiles[a].attributes.product_stockitems_id.toString()){
                    profilesArray = this.state.profiles[a];
                }
            }
        }

        if(profilesArray === null){
            try {
                    let tempProfile = await this.getProfiles(id);
                    if (tempProfile != null) {
                        this.state.profiles.push(tempProfile);
                        profilesArray = tempProfile;
                    }
                }catch(error){
                    console.log(error);
                }
        }
        sharedStore.hideLoadingPage();
        return profilesArray;
    },

    getProfiles(id){

        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'google-shopping-profile/' + id, response => {
                resolve(response.data.data[0]);
            }, error => reject(error));
        });
    },

    updateProfile(data, id){
        sharedStore.showLandingPage();
        return new Promise ((resolve, reject)=>{
            http.patch(endPoints.catalogue + 'google-shopping-profile/'+id, data, ({data})=>{

                event.emit(event.names.USER_MESSAGE, 'Google profile was updated successfully', 'success');
               resolve(data);
               sharedStore.hideLoadingPage();
                },
                error => reject(error, sharedStore.hideLoadingPage()));
        })
    },

    createProfile(data){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject)=>{
            http.post(endPoints.catalogue + 'google-shopping-profile', data, ({data})=>{
                    this.state.profiles.push(data.data);
                    event.emit(event.names.USER_MESSAGE, data.data.attributes.title+' was created successfully', 'success');
                    resolve(data.data);
                    sharedStore.hideLoadingPage();
                },
                error => reject (error, sharedStore.hideLoadingPage()));
        })
    },

    deleteProfile(id){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject)=>{
            http.delete(endPoints.catalogue + 'google-shopping-profile/'+ id, id, ({data})=>{
                for(let a =0; a < this.state.profiles.length; a++){
                    if(this.state.profiles[a].id.toString() === id.toString()){
                        this.state.profiles.splice(a, 1);
                    }
                }
                event.emit(event.names.USER_MESSAGE, 'Profile was deleted successfully', 'success');
                sharedStore.hideLoadingPage();
                resolve(data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    }
}