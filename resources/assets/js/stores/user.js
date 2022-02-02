import {http, CDN} from '@/services';
import {endPoints, ls, event} from '@/services';
import {sharedStore} from "./shared";

export const userStore = {
    state: {
        user: [],
        search: []
    },

    async checkLoading(){
        if(this.state.user.length === 0){
            sharedStore.showLandingPage();
            await this.init();
        }
    },


    init() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'user', response => {
                for(let u = 0; u < response.data.data.length; u++) {
                    if(response.data.data[u].attributes.user_permissions) {
                        response.data.data[u].attributes.user_permissions = response.data.data[u].attributes.user_permissions[0]
                    }
                }
                this.all = response.data.data;
                resolve(this.all);
                sharedStore.hideLoadingPage();
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    getAdminRights(id) {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'user-permissions/'+id, response => {
                resolve(response.data.data.attributes.admin_rights)
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

    getActiveUsers() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'user?active=1', response => {
                resolve(response.data.data)
            }, error => reject(console.log(error)))
        })
    },

    getInactiveUsers() {
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'user?active=0', response => {
                resolve(response.data.data)
            }, error => reject(console.log(error)))
        })
    },

    getUserByID(id) {
        const stringID = id.toString();
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'user/'+id, response => {
                resolve(response.data.data)
            }, error => reject(console.log(error)))
        })
    },

    get all() {
        return this.state.user;
    },

    set all(value) {
        this.state.user = value;
        this.state.search = value;
        return this.state.user;
    },

    createUser(data) {
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'user', data, ({data}) => {
                this.all.push(data.data);
                event.emit(event.names.USER_MESSAGE, data.data.attributes.name+' was created successfully', 'success');
                resolve(data.data)
                window.location = '#!/settings/user-permissions';
            }, error => reject(error));
        })
    },

    createUserPermissions(data) {
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'user-permissions', data, ({data}) => {
                // event.emit(event.names.USER_MESSAGE, data.data.attributes.title+' was created successfully', 'success');
                http.get(endPoints.catalogue + 'user/'+data.data.attributes.user_id, response => {
                    let index = this.all.indexOf(this.getUserByID(response.data.data.id));
                    var user = response.data.data;
                    this.all.splice(index, 1);
                    user.attributes.user_permissions = user.attributes.user_permissions[0];
                    this.all.push(user);
                    resolve(user)
                })

            }, error => reject(error));
        })
    },

    updateUser(data){
        if(data.data.attributes.password == '') {
            var old_user = this.getUserByID(data.data.id);
            data.data.attributes.password = old_user.attributes.password
        }
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.catalogue + 'user/'+data.data.id, data, ({data})=>{
                let index = this.all.indexOf(this.getUserByID(data.data.id));
                this.all.splice(index, 1);
                // data.data.attributes.user_permissions = data.data.attributes.user_permissions[0]
                this.all.push(data.data);
                event.emit(event.names.USER_MESSAGE, data.data.attributes.name+' was updated successfully', 'success');
                resolve(data.data);
                window.location = '#!/settings/user-permissions';
		        sharedStore.hideLoadingPage();
            }, error => reject(error));
        });
    },

    updateUserPermissions(data){
        return new Promise ((resolve, reject) => {
            http.patch(endPoints.catalogue + 'user-permissions/'+data.data.id ,data, ({data})=>{
                // event.emit(event.names.USER_MESSAGE, data.data.attributes.title+' was updated successfully', 'success');
                resolve(data.data);
		sharedStore.hideLoadingPage();
            }, error => reject(error));
        });
    },

    async login(email, password) {
        sharedStore.showLandingPage();
        return new Promise(((resolve, reject) => {
            http.post(endPoints.catalogue + 'login',
                {email, password},
                async({data}) => {
                await this.checkLoading();
                    ls.set('user', data.authenticated_user.id);
                    let user = await this.getUserByID(data.authenticated_user.id);
                    const pages = user.attributes.user_permissions.department.pages;
                    ls.set('pages', pages);
                    resolve(data);
                    sharedStore.hideLoadingPage();
                }, error => {
                    console.log(error)
                    reject(error)});
        }));
    },

    async refreshAuthDetails(id) {
        await this.checkLoading()
        return new Promise(((resolve, reject) => {
            http.get(endPoints.catalogue + 'user/'+ id, response => {
                response.data.data.attributes.user_permissions = response.data.data.attributes.user_permissions[0]
                var pages = response.data.data.attributes.user_permissions.department.pages;
                ls.remove('pages')
                ls.set('pages', pages);
                let index = this.all.indexOf(this.getUserByID(id));
                this.all.splice(index, 1);
                this.all.push(response.data.data);
                resolve(pages)
            }, error => {
                console.log(error)
                reject(error)
            })
        }))
    },

    logout() {
        return new Promise((resolve, reject) => {
            http.delete(endPoints.catalogue + 'logout', {}, ({data}) => {
                ls.clear()
                resolve(data);
            }, error => reject(error));
        });
    },

    toggleActiveUser(data){
        return new Promise((resolve, reject) => {
            http.patch(endPoints.catalogue + 'user/toggle-activate-user/'+ data.id, data, ({data}) => {

                // let index = this.all.indexOf(this.getUserByID(data.data.id));
                // this.all.splice(index, 1);
                // this.all.push(data.data)
                resolve(data.data);
                window.location = '#!/settings/user-permissions';
                event.emit(event.names.USER_MESSAGE, 'User active status successfully changed', 'success');
                sharedStore.hideLoadingPage();
            }, error => reject(error));
        });
    },
};