import {http} from '@/services';
import {event} from '@/services';
import {endPoints} from '@/services';

export const keyFeatureStore = {
    addFeatures(data)
    {
        return new Promise((resolve, reject) => {
            http.post(endPoints.inventory + 'key-features', data, ({data}) => {
                resolve(data.data);
                event.emit(event.names.USER_MESSAGE, 'Key features saved successfully', 'success');

            }, error => reject(error, event.emit(event.names.USER_MESSAGE, 'Failed to save key features', 'error')))
        })
    }
}