<template>
    <div class="details-form">
        <div class="details-form__body">
            <div>
                <label>Brand Name</label>
                <input v-model="brandName" name="brandName" data-vv-as="Brand Name" v-validate="'required'" type="text"/>
            </div>
            <span v-for="error in errors.collect('brandName')" :key="error+'a'" class="error-message">{{ error }}</span>
            <div>
                <label>Brand number</label>
                <input type="text" v-model="brandNo" name="brandNo"/>
            </div>
            <div>
                <label>Contact Name</label>
                <input v-model="contactName" name="contactName" data-vv-as="Contact Name" v-validate="'required'" type="text"/>
            </div>
            <span v-for="error in errors.collect('contactName')" :key="error+'b'" class="error-message">{{ error }}</span>
            <div>
                <label>Contact Email</label>
                <input v-model="contactEmail" name="contactEmail" data-vv-as="Contact Email" v-validate="'required|email'" type="text"/>
            </div>
            <span v-for="error in errors.collect('contactEmail')" :key="error+'c'" class="error-message">{{ error }}</span>
            <div>
                <label>Contact Number</label>
                <input v-model="contactNumber" name="contactNumber" v-validate="'required|numeric'" type="text"/>
            </div>
                <span v-for="error in errors.collect('contactNumber')" :key="error+'d'" class="error-message">{{ error }}</span>
                <div>
                <label>Data Points Value</label>
                <input v-model="dataPointsValue" name="dataPointsValue" data-vv-as="Data Points Value" v-validate="'required|numeric'" type="text"/>
            </div>
            <span v-for="error in errors.collect('dataPointsValue')" :key="error+'e'" class="error-message">{{ error }}</span>

            <div>
                <label>Comms Partner </label>
                <input type="checkbox" v-model="partnered" name="partnered" data-vv-as="Partner" v-validate="'included:1,0'"/>
            </div>
        </div>
             <div>
                <span v-for="error in errors.collect('partnered')" :key="error+'h'" class="error-message">{{ error }}</span>
            </div>
            <br>
        <div class="details-form__cta">
            <div class="details-form__cta">
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveBrand()">Save Brand</button>
        </div>
    </div>
    </div>
</template>

<script>
    import {Datetime} from 'vue-datetime';
    import {brandsStore} from "@/stores";
    import {cdnStore} from "@/stores";
    import {sharedStore} from "@/stores";
    import {event} from '@/services';

    export default {
        components:{Datetime},

        props:['view'],

        data(){
            return{
                brandName: '',
                contactName: '',
                contactEmail: '',
                contactNumber: '',
                dataPointsValue: '',
                imageTitle: '',
                imageAltTag: '',
                Image: null,
                edit: false,
                errorResponse: null,
                newImageTemp: null,
                loadedImage: null,
                partnered: 0,
                brandNo:''
            }
        },

        watch:{
            view()
            {
                this.$validator.reset();
            },
        },



        methods:{
            pickFiles(files, type){
                this.newImageTemp = URL.createObjectURL(files.target.files[0]);
                if(this.Image === null) {
                    this.Image = {
                        'attributes': {
                            'target': files.target.files[0],
                            'alt_tag': '',
                            'title': '',
                            'url':''
                        }
                    }
                    if(this.view === 'edit-freegifts') {
                        this.edit = true;
                    }

                }else{
                    this.Image.attributes.url = '';
                    this.Image.attributes.target = files.target.files[0];
                }
            },


           async saveBrand()
           {
               await this.$validator.validateAll();
               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
                let newBrand;
                let data = {
                    'data':{
                        'type':'brands',
                        'attributes':{
                            'name': this.brandName,
                            'contact_name': this.contactName,
                            'contact_email': this.contactEmail,
                            'contact_number': this.contactNumber,
                            'brandNo':this.brandNo,
                            'image_id': null
                        }
                    }
                };

                try{
                    newBrand = await brandsStore.storeBrandInfo(data);
                }catch(error){
                    console.log(error);
                }

                let newDataPoints = this.dataPointsValue * 100;

                let brandData = {
                    'data':{
                        'type':'brandconfig',
                        'attributes':{
                            'text_overview_colour': '#000000',
                            'brand_colour': '#ffffff',
                            'brand_id': newBrand.id,
                            'comms_partner': this.partnered,
                            'featured': 0,
                            'data_points_value': newDataPoints,
                        }
                    }
                }
                try{
                    brandsStore.saveNewBrandConfig(brandData);
                    sharedStore.hideLoadingPage();
                    event.emit(event.names.USER_MESSAGE, 'Brand info has been created', 'success');
                    window.location="/#!/brands/edit/"+newBrand.id
                }catch(error){
                    console.log(error);
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

    .details-form__body input[name=dataPointsValue]{
        width: 10%;
    }


</style>