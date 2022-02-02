<template>
    <div class="details-form">
        <div class="details-form__body">
            <div>
                <label>User Name</label>
                <input v-model="name" data-vv-as="Name" name="name" v-validate="'required'" type="text"/>
            </div>
            <span v-for="error in errors.collect('name')" :key="error+'a'" class="error-message">{{ error }}</span>
             <div>
                <label>User E-Mail</label>
                <input v-model="email" data-vv-as="E-mail" name="email" v-validate="'email|required'" type="text"/>
            </div>
            <span v-for="error in errors.collect('email')" :key="error+'b'" class="error-message">{{ error }}</span>

             <div>
                <label>User Password</label>
                <input v-model="password" data-vv-as="Password" @input="noPasswordError()" autocomplete="new-password" placeholder="•••••••••" name="password" v-validate="'min:8|max:20|secure_password'" type="password"/>
            </div>
            <span v-for="error in errors.collect('password')" :key="error+'c'" class="error-message">{{ error }}</span>
            <span v-if="noPassword" class="error-message">{{ noPassword }}</span>

           <div>
            <label for="department">Department</label>
            <select name="department" v-model="department" data-vv-as="Department" v-validate="'included:1,2,3,4,5,6,7|required'">
                <option v-show="subview == 'create-user-permissions'" value="">Select One</option>
                <option value="1">Dev Team</option>
                <option value="2">Marketing</option>
                <option value="3">Content</option>
                <option value="4">Customer Service</option>
                <option value="5">Sales</option>
                <option value="6">Purchasing</option>
                <option value="7">IT</option>
            </select>
           </div>
            <span v-for="error in errors.collect('department')" :key="error+'d'" class="error-message">{{ error }}</span>

           <div>
                <label for="admin_rights">Admin Rights</label>
                <select name="admin_rights" v-model="admin_rights" data-vv-as="Admin Rights" v-validate="'included:0,1|required'">
                <option v-if="subview == 'create-user-permissions'" value="">Select One</option>
                    <option value="0">Standard User</option>
                    <option value="1">Admin</option>
                </select>
           </div>
            <span v-for="error in errors.collect('admin_rights')" :key="error+'e'" class="error-message">{{ error }}</span>
           
        <div class="details-form__cta">
            <div class="details-form__cta">
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveUser()">Save</button>
            <div v-if="subview == 'edit-user-permissions'">
                <button class="btn btn-danger" v-if="user.attributes.active == 1" @click="toggleActiveUser()">Deactivate</button>
                <button class="btn btn-success" v-if="user.attributes.active == 0" @click="toggleActiveUser()">Activate</button>
            </div>
        </div>
        </div>
    </div>
    </div>
</template>

<script>
    import {userStore} from "@/stores";
    import {event} from '@/services';

    export default {

        props:['user', 'subview'],

        data(){
            return{
                name: '',
                email: '',
                admin_rights: '',
                password: '',
                department: '',
                noPassword:''
                
            }
        },

        watch:{
            subview()
            {
                if(this.subview === 'create-user-permissions'){
                    this.name = '',
                    this.email = '',
                    this.password = '',
                    this.admin_rights = '',
                    this.department = ''
                }
                this.$validator.reset();
            },
            user() {
                if (this.subview === 'edit-user-permissions') {
                    this.name = this.user.attributes.name;
                    this.email = this.user.attributes.email;
                    this.admin_rights =this.user.attributes.user_permissions.admin_rights
                    this.department = this.user.attributes.user_permissions.department.id;

                }else{
                    this.name = '';
                    this.email = '';
                    this.password = '';
                    this.admin_rights = 99;
                    this.department = 99;
                }
            },

        },



        methods:{

            noPasswordError() {
                if(!this.password && this.subview === 'create-user-permissions') {
                       this.noPassword = 'Password is a required field!'
                } else {
                    this.noPassword = null
                }

            },

            toggleActiveUser() {

                    try{
                        userStore.toggleActiveUser(this.user);
                    }catch(error){
                        console.log(error);
                    }
            },


           async saveUser()
           {
                if(this.subview === 'create-user-permissions'){
                     await this.$validator.validateAll();
               if(this.$validator.errors.any() || !this.password) {
                   if(!this.password) {
                       this.noPassword = 'Password is a required field!'
                   }
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
                var user = {
                        data: {
                            type:'user',
                            attributes: {
                                name: this.name,
                                email: this.email,
                                password: this.password,
                                department: {
                                id: this.department
                                },
                                user_permissions: {
                                    admin_rights: this.admin_rights
                                },
                                active: 1

                            }
                        }
                    };

                      try{
                       var new_user = await userStore.createUser(user);
                   }catch(error){
                       console.log(error);
                   }
                var user_permissions = {
                    data: {
                        type: 'user-permissions',
                        attributes: {
                            user_id: new_user.id,
                            department_id: this.department,
                            admin_rights: this.admin_rights
                        }
                    }
                }

                   try{
                       await userStore.createUserPermissions(user_permissions)
                   }catch(error){
                       console.log(error);
                   }
                
               } else if (this.subview === 'edit-user-permissions'){
 
                 await this.$validator.validateAll();
               if(this.$validator.errors.any()) {

                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
                if(this.password) {
                    var user = {
                        data: {
                            type:'user',
                            id: this.user.id,
                            attributes: {
                                name: this.name,
                                email: this.email,
                                password: this.password,
                                department: {
                                id: this.department
                                },
                                user_permissions: {
                                    admin_rights: this.admin_rights
                                }

                            }
                        }
                    };
                } else {
                    var user = {
                        data: {
                            type:'user',
                            id: this.user.id,
                            attributes: {
                                name: this.name,
                                email: this.email,
                                department: {
                                id: this.department
                                },
                                user_permissions: {
                                    admin_rights: this.admin_rights
                                }

                            }
                        }
                    };
                }
                var user_permissions = {
                    data: {
                        type: 'user-permissions',
                        id: this.user.attributes.user_permissions.id,
                        attributes: {
                            user_id: this.user.id,
                            department_id: this.department,
                            admin_rights: this.admin_rights
                        }
                    }
                }

                   try{
                       await userStore.updateUserPermissions(user_permissions)
                       userStore.updateUser(user);
                   }catch(error){
                       console.log(error);
                   }
                
               }
         }
      }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    .details-form__body label{
        min-width:150px;
    }


</style>