<template>
    <div class="details-form__body" style="border:1px solid #c9c9c9; border-radius:5px; padding:10px; margin-bottom:10px;">
        <div>
            <label for="promoDataPointsDescription">Promotion Description</label>
            <input v-model="discountPromotion.attributes.description" name="promoDataPointsDescription" v-validate="'required'" data-vv-as="Description">
        </div>
        <span class="error-message" v-for="error in errors.collect('promoDataPointsDescription')" :key="error+'a'">{{ error }}</span>
        <div>
            <label for="promoType">Promotion Type</label>
            <select v-model="discountPromotion.attributes.discount_type" id="promoType" name="discountType" v-validate="'required|included:flat_discount,percentage'">
                <option value="flat_discount">Money Off</option>
                <option value="percentage">% Discount</option>
            </select>
        </div>
        <span class="error-message" v-for="error in errors.collect('discountType')" :key="error+'b'">{{ error }}</span>
        <div>
            <label for="promoValue">Value</label>
            <input v-model="discountPromotion.attributes.value" name="promoValue" v-validate="'required|decimal'" data-vv-as="Value">
        </div>
        <span class="error-message" v-for="error in errors.collect('promoValue')" :key="error+'c'">{{ error }}</span>
        <div>
            <label for="hasPromoCode">Has Promo Code</label>
            <input type="checkbox" name="hasPromoCode" v-model="hasPromoCode">
            <div v-if="hasPromoCode">
                <label for="promoCode">Promo Code</label>
                <input v-model="discountPromotion.attributes.coupon" name="promoCode">
            </div>
        </div>
        <div>
            <label>Start Date Range Needed?</label>
            <input v-model="dateRangeNeeded" type="checkbox" name="dateRangeNeeded" />
        </div>
        <span class="error-message" v-for="error in errors.collect('dateRangeNeeded')" :key="error+'d'">{{ error }}</span>
        <div v-show="dateRangeNeeded">
            <label>Start Date</label>
            <datetime v-model="discountPromotion.attributes.start_date" type="datetime" name="startDate" v-validate="'required_if:dateRangeNeeded,true'" data-vv-as="Start Date"></datetime>
        </div>
        <span class="error-message" v-for="error in errors.collect('startDate')" :key="error+'e'">{{ error }}</span>
        <div v-if="dateRangeNeeded">
            <label>End Date</label>
            <datetime v-model="discountPromotion.attributes.end_date" type="datetime" name="endDate" v-validate="'required_if:dateRangeNeeded,true'" data-vv-as="End Date"></datetime>
        </div>
        <span class="error-message" v-for="error in errors.collect('endDate')" :key="error+'f'">{{ error }}</span>
        <div>
            <label>Active</label>
            <input v-model="discountPromotion.attributes.active" type="checkbox" name="active" />
        </div>
        <span class="error-message" v-for="error in errors.collect('active')" :key="error+'d'">{{ error }}</span>
        <div>
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveDiscountPromo()">Save Promotion</button>
            <div style="display:inline-block;">
                <a :href="'#!/marketing/promotion-targets/'+this.discountPromotion.id"><button v-if="this.discountPromotion.id" class="btn btn-warning">Promotion Targets</button></a>
            </div>
            <button class="btn btn-danger" @click="deleteDiscountPromo()">Delete Promotion</button>
        </div>

         <span v-if="!this.discountPromotion.id"> You cannot edit targets before you save the promotion </span>
    </div>
</template>

<script>
    // import {Datetime} from 'vue-datetime';
    import {promotionsStore} from "@/stores";
    import {event} from '@/services';
    import {http} from '@/services';


    export default {
        // components:{Datetime},

        props:['promotion', 'campaign' ,'arrayKey'],

        data(){
            return{
                dateRangeNeeded:false,
                discountPromotion:this.promotion,
                hasPromoCode: false
            }
        },

        created() {
            if(this.promotion.attributes.coupon) {
                this.hasPromoCode = true;
            }
        },

        watch:{
            dateRangeNeeded(){
                if(this.dateRangeNeeded === true){
                    let startDate = new Date();
                    let endDate = new Date();

                    this.discountPromotion.attributes.start_date = startDate.toISOString();
                    this.discountPromotion.attributes.end_date = endDate.toISOString();
                }else{
                    this.discountPromotion.attributes.start_date = this.campaign.attributes.start_date;
                    this.discountPromotion.attributes.end_date = this.campaign.attributes.end_date;
                }
            },

            view() {
                this.$validator.reset();
            },

            hasPromoCode(hasPromo) {
                if(!hasPromo) {
                    this.discountPromotion.coupon = '';
                }
            },

            promotion(){
                if(this.promotion != null){
                    if(this.promotion.attributes.coupon) {
                        this.hasPromoCode = true;
                    }
                    let currentPromotion = JSON.parse(JSON.stringify(this.promotion));

                    if((currentPromotion.attributes.start_date != null) &&(currentPromotion.attributes.end_date != null)) {
                        // let startDate = new Date(this.promotion.attributes.start_date);
                        // let endDate = new Date(this.promotion.attributes.end_date);
                        //
                        // currentPromotion.attributes.start_date = startDate.toISOString();
                        // currentPromotion.attributes.end_date = endDate.toISOString();

                        this.dateRangeNeeded = true;
                    }
                   this.discountPromotion = currentPromotion;
                }

                this.$validator.reset();
            }
        },


        methods:{
            async saveDiscountPromo(){
                let data = http.createData(this.discountPromotion); 

                if(data.data.attributes.start_date != null && data.data.attributes.end_date != null){

                data.data.attributes.end_date = data.data.attributes.end_date.replace('Z', '').replace('T', ' ').replace('.000', '');
                data.data.attributes.start_date = data.data.attributes.start_date.replace('Z', '').replace('T', ' ').replace('.000', '');

                let startDate = new Date(this.discountPromotion.attributes.start_date);
                let endDate = new Date(this.discountPromotion.attributes.end_date);


                this.discountPromotion.attributes.start_date = startDate.toISOString();
                this.discountPromotion.attributes.end_date = endDate.toISOString();

                }

                try{
                    if(data.data.id) {
                        this.discountPromotion =  await promotionsStore.updatePromo(data);

                    }else{
                       this.discountPromotion =  await promotionsStore.savePromo(data);

                    }
                }catch(error){
                    console.log(error);
                }

            },

            viewPromoTargets(){

            },

            deleteDiscountPromo(){
                event.emit(event.names.UPDATE_PROMOTIONS, this.discountPromotion, this.arrayKey);
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>