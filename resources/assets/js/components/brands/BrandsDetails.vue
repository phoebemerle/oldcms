<template>
    <div class="details-form">
        <div class="details-form__body form-sections" id="brandDetails">
            <div>
                <label>Brand Name:</label>
                <p>{{brand.attributes.name}}</p>
            </div>
            <div>
                <label>Brand Colour (Hexadecimal):</label>
                <input v-model="brandColour" type="color" name="brandColour" v-validate="'regex:[a-zA-Z0-9\s]+|required|max:7'" data-vv-as="Brand Color"/>
                <input type="text" v-model="brandColour"/>
            </div>
            <span class="error-message" v-for="error in errors.collect('brandColour')" :key="error+'a'">{{ error }}</span>
            <div>
                <label>Brand Colour for Overview Text (Hexadecimal):</label>
                <input style="height:25px; width:40px; padding:0;" v-model="textColour" type="color" name="textColor" v-validate="'regex:[a-zA-Z0-9\s]+|required|max:7'" data-vv-as="Brand Color"/>
                <input type="text" v-model="textColour"/>
            </div>
            <span class="error-message" v-for="error in errors.collect('textColor')" :key="error+'b'">{{ error }}</span>
            <div>
                <label>Data Points Value</label>
                <input v-model="dataPointsValue" name="dataPointsValue" data-vv-as="Data Points Value" v-validate="'required'" type="text"/>
            </div>
            <span v-for="error in errors.collect('dataPointsValue')" :key="error+'e'" class="error-message">{{ error }}</span>
            <div>
                <label>Comms Express Partner?</label>
                <input type="checkbox" v-model="partner" name="partner" data-vv-as="Partner" v-validate="'included:1,0'"/>
            </div>
            <span class="error-message" v-for="error in errors.collect('partner')" :key="error+'c'">{{ error }}</span>
            <div>
                <label>Featured In Slider</label>
                <input type="checkbox" v-model="featured" name="featured" data-vv-as="Featured" v-validate="'included:0,1'"/>
            </div>
            <span class="error-message" v-for="error in errors.collect('featured')" :key="error+'d'">{{ error }}</span>
            <div>
                <label>Featured Slider Link</label>
                <input class="featuredSliderLink" type="text" v-model="featuredLink" name="featuredLink"/>
            </div>
        </div>
        <div>
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveBrandInfo()">Save new brand info</button>
        </div>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {http} from '@/services';

    export default {
        name: "BrandsDetails",

        props:['brand', 'view', 'brandInfo'],

        data(){
            return{
                brandColour:'#ffffff',
                textColour:'#888888',
                partner:false,
                contact_name:'',
                contact_email:'',
                contact_number:'',
                featured:0,
                dataPointsValue: '',
                featuredLink:''
            }
        },

         watch:{
            view()
            {
                this.$validator.reset();
            },
            brandInfo(){
                    if(this.brandInfo.id != null) {
                        this.brandColour = this.brandInfo.attributes.brand_colour;
                        this.textColour = this.brandInfo.attributes.text_overview_colour;
                        this.partner = this.brandInfo.attributes.comms_partner;
                        this.featured = this.brandInfo.attributes.featured;
                        this.dataPointsValue = this.brandInfo.attributes.data_points_value / 100;
                        this.featuredLink = this.brandInfo.attributes.featured_link;
                    }else{
                        this.brandColour = '#ffffff';
                        this.textColour = '#888888';
                        this.partner = false;
                        this.featured = 0;
                        this.dataPointsValue = "0";
                        this.featuredLink = '';
                    }
                deep: true
            }
        },

        methods:{
            async saveBrandInfo(){

                await this.$validator.validateAll();

               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
                let tempBrand = http.createData(this.brandInfo);
                tempBrand.data.attributes.brand_colour = this.brandColour;
                tempBrand.data.attributes.text_overview_colour = this.textColour;
                tempBrand.data.attributes.comms_partner = this.partner;
                tempBrand.data.attributes.brand_id = this.brand.id;
                tempBrand.data.attributes.featured = this.featured;
                tempBrand.data.attributes.featured_link = this.featuredLink;
                tempBrand.data.attributes.data_points_value = this.dataPointsValue * 100;


                event.emit(event.names.UPDATE_BRAND, tempBrand);
            }
        },

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

    #brandDetails{
        label{
            min-width:unset;
        }

        input[type="text"]{
            width:100px;
        }

        input[type="color"]{
            height:25px;
            width:40px;
            padding:0;
            margin:0 10px;
        }
        input.featuredSliderLink{

            width:70%;
        }
    }


</style>