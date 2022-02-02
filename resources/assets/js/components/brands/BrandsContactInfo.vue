<template>
    <div class="details-form">
        <div class="details-form__body form-sections" id="brandContactInfo">
            <div>
                <label>Contact Name: </label>
                <input type="text" v-model="newBrandInfo.attributes.contact_name" name="contact_name" data-vv-as="Contact Name" v-validate="'required'"/>
            </div>
            <span class="error-message" v-for="error in errors.collect('contact_name')" :key="error+'a'">{{error}}</span>
            <div>
                <label>Contact Email: </label>
                <input type="text" v-model="newBrandInfo.attributes.contact_email" name="contact_email" data-vv-as="Contact Email" v-validate="'required|email'"/>
            </div>
            <span class="error-message" v-for="error in errors.collect('contact_email')" :key="error+'b'">{{error}}</span>
            <div>
                <label>Contact Number: </label>
                <input type="text" v-model="newBrandInfo.attributes.contact_number" name="contact_number" data-vv-as="Contact Number" v-validate="'required|numeric'" />
            </div>
             <span class="error-message" v-for="error in errors.collect('contact_number')" :key="error+'c'">{{error}}</span>
        </div>
        <div>
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveContactInfo()">Save brand contact info</button>
        </div>
    </div>
</template>

<script>
    import {brandsStore} from '@/stores';
    import {http, event} from '@/services';

    export default {
        name: "BrandsContactInfo",

        props:['brand', 'tab'],

        data(){
            return{
                newBrandInfo:{
                    'attributes':{
                        'contact_name':'',
                        'contact_email':'',
                        'contact_number':''
                    }
                }
            }
        },

        watch:{
            brand:{
                handler: function () {
                    this.newBrandInfo = this.brand;
                },
                deep: true
            },
            tab() {
                this.$validator.reset();
            }
        },


        methods:{
            async saveContactInfo(){
                await this.$validator.validateAll();
               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
                let data = http.createData(this.newBrandInfo);

                brandsStore.updateBrand(data, this.newBrandInfo.id);
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>