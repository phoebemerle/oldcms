import {http} from '@/services';
import {event} from '@/services';
import stub from '@/stubs/image';
import {cdnStore} from '@/stores';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";
import image from "../stubs/image";

export const imageStore = {

    state: {
        images:[],
    },

    uploadImage(data)
    {
        return new Promise((resolve, reject) => {
            http.post('https://comms-cdn.azurewebsites.net/upload', data, response => {
                resolve(response);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    async loadImages(imageInfo, type){

        let image = null;
        let id = '';

        if((type === 'banners') || (type === 'socialIcons')){
            id = imageInfo;
        }else{
            id = imageInfo.id;
        }
        if(this.state.images.length > 0){
            image = this.checkState(id);
        }

        if(image === null){

            image = await this.getImages(id);

            if(type === 'product'){
                image.attributes.gallery = imageInfo.gallery;
                image.attributes.order = imageInfo.order;
            }
            this.state.images.push(image);
        }

        return image;

    },

    async brandImage(imageInfo){
        if(imageInfo.source === 'CDN') {
            let cdnInfo = await cdnStore.getFromCDN(imageInfo.source_id);
            if(cdnInfo.length !== 0) {
                imageInfo.url = cdnInfo.data.attributes.url;
            }
        }
        return imageInfo;
    },

    getImages(id) {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'images/'+id, response => {
                resolve(response.data.data[0]);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    checkState(imageID){
        let image = null;

        for(let g =0; g < this.state.images.length; g++){
            if(this.state.images[g].id.toString() === imageID.toString()){
                image =  this.state.images[g];
            }
        }
        return image;
    },

    create(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'images', data, ({data}) => {
                this.state.images.push(data.data);
                event.emit(event.names.USER_MESSAGE, data.data.attributes.title + ' was successfully created', 'success');
                resolve(data.data);

            }, error => reject(error, sharedStore.hideLoadingPage()));
        })
    },

    update(id, data){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.put(endPoints.catalogue + 'images', data, ({data}) => {
                event.emit(event.names.USER_MESSAGE, 'Image was updated successfully', 'success');
                resolve(data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        })
    },

    saveImageToProduct(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'product-images', data, ({data}) => {
                resolve(data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        })
    },


    delete(id){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.delete(endPoints.catalogue + 'images/'+id, id, ({data}) => {
                for(let x =0; x < this.state.images.length; x++){
                    if(this.state.images[x].id === id){
                        this.state.images.splice(x, 1);
                    }
                }
                event.emit(event.names.USER_MESSAGE, 'Your image was deleted successfully', 'success');
                resolve(data);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        })
    },

}