<template>
    <div class="details-form">
        <div class="details-form__body" >
            <div id="passwordSection" class="sections">
                <h2>Change Customer Password</h2>
                <div>
                    <div>
                        <label>New Password</label>
                        <input type="text" v-model="password"/>
                    </div>
                    <div>
                        <label>Confirm Password</label>
                        <input type="text" v-model="confirmPassword"/>
                    </div>
                    <div v-if="showError" class="errorMessage">
                        <p>The password do not match. Please try again or contact a developer</p>
                    </div>
                </div>
                <button class="btn btn-primary" @click="saveNewPassword()">Change Password</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {sharedStore} from '@/stores';
    import {customerStore} from '@/stores';
    import {http} from "@/services";
    import customerStub from '@/stubs/Customers';


    export default {

        props:['customer', 'tab', 'subview'],

        data() {
            return {
                password:'',
                confirmPassword:'',
                showError:false
            }
        },

        watch:{
            customer(){
                this.password = '';
                this.confirmPassword = '';
            }
        },

        methods: {
            async saveNewPassword(){
                this.showError = false;
                if(this.password === this.confirmPassword){

                    let data = {
                        id:this.customer.id,
                        Password1:this.password
                    };

                    try {

                        await customerStore.updatePassword(data);
                        this.password = '';
                        this.confirmPassword = '';
                    }catch(error){
                        console.log(error);
                    }

                }else{
                    this.showError = true;
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    .errorMessage{
        margin: 0;
        padding: 10px;
        color: white;
        font-weight: bold;
    }

</style>