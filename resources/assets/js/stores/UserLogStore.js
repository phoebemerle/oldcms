import {http} from '@/services';
import {event, ls} from '@/services';
import {inventoryStore} from '@/stores';
import {endPoints} from '@/services';
import {productStore} from './product';
import {O_NOFOLLOW} from 'constants';


export const UserLogStore = {

    state: {
        userLogs: [],
    },

    create(data, old_item, type){

        if(old_item == 'new') {
            var log = {
                user_id: ls.get('user'),
                item_id: data.data.id,
                log_page: type,
                changes: ['new entry.'],
                changed_at: this.formatted_date()
            }
        } else {
            var log = {
                user_id: ls.get('user'),
                item_id: data.data.id,
                log_page: type,
                changes: this.compare(data.data, old_item),
                changed_at: this.formatted_date()
            }
        }
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'user-logs', log, ({data}) => {
                this.state.userLogs.push(data);
                resolve(data);
            }, error => reject(error));
        });
    },
    
    formatted_date()
    {
    var result="";
    var d = new Date();
    result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() + 
                " "+ d.getHours()+":"+d.getMinutes()+":"+
                d.getSeconds();
    return result;
    },

    compare(new_item, old_item) {
        var rows = Object.getOwnPropertyNames(new_item.attributes)
        var changeCount = 0;
        if(rows.indexOf('created-at')) {
            var remove = rows.indexOf('created-at')
        }
        rows.splice(remove)
        var changes = [];
                for(let m = 0; m < rows.length; m++) {
                    if(old_item.attributes[rows[m]] != new_item.attributes[rows[m]]) {
                        changes.push(rows[m] + ' updated.');
                        changeCount++;
                    }
        }
        if(changeCount == 0) {
            changes.push('no changes detected');
        }
        return changes;
    },

    update(data, id){
        return new Promise((resolve, reject) => {
            http.patch(endPoints.catalogue + 'product-edit-log/'+id, data, ({data}) => {
                    for(let a = 0; a < this.state.attributes.length; a++){
                        if(this.state.attributes[a].id === data.data.id){
                            this.state.attributes[a] = data.data;
                        }
                    }
                event.emit(event.names.USER_MESSAGE, 'Your attribute was successfully updated', 'success');
                resolve(data);
            }, error => reject(error));
        });
    }
}