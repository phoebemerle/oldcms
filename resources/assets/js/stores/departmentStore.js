import {http} from '@/services';
import {event} from '@/services';
import {cdnStore} from '@/stores';
import {endPoints, ls} from '@/services';
import {sharedStore} from '@/stores';
import { userStore } from './user';

export const departmentStore = {

    state: {
        departments: [],
        search: []
    },

    async checkLoading(){
        if(this.state.departments.length === 0){
            sharedStore.showLandingPage();
            await this.init();
        }
    },


    init() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'departments', response => {
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    get all() {
        return this.state.departments;
    },

    set all(value) {
        this.state.departments = value;
        this.state.search = value;
        return this.state.departments;
    },

    departmentByID(id){
        for(let a = 0; a < this.state.departments.length; a ++){
             if(id.toString() === this.state.departments[a].id.toString()){
                 return this.state.departments[a];
             }
        }
    },

    attachPages(data) {
        userStore.checkLoading()
        return new Promise((resolve, reject) => {
        http.post(endPoints.catalogue + 'department/attach-pages', data.data, response => {
                    let index = this.all.indexOf(this.departmentByID(data.data.id));
                    const user = userStore.getUserByID(ls.get('user'));
                    userStore.refreshAuthDetails(user.id)
                    this.all.splice(index, 1);
                    this.all.push(response.data.data);
                    resolve(response.data.data)
                event.emit(event.names.USER_MESSAGE, 'Department Permissions Updated!', 'success');
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        })
    }
}