import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';
import {sharedStore} from "./shared";
import {productStore} from "./product";

export const videoStore = {
    state: {
        videos: [],
        search:[]
    },


    storeVideoInfo(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'product-videos', data, ({data}) => {
                event.emit(event.names.USER_MESSAGE, 'Your videos were updated successfully', 'success');
                resolve(data.data);
            }, error => reject(error));
        });
    },

    deleteVideo(data) {
        return new Promise((resolve, reject) => {
            http.delete(endPoints.catalogue + 'product-videos/' + data.id, data.id, ({ response }) => {
                event.emit(event.names.USER_MESSAGE, 'Your video was successfully deleted', 'success');
                // let index = this.all.indexOf(this.bannerByID(data.id));
                resolve(response);
            }, error => reject(error));
        });
    },

};