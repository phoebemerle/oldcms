<template>
    <div class="details-form__body" style="border:1px solid #c9c9c9; border-radius:5px; padding:10px; margin-bottom:10px;">
        <div>
            <label for="promoDataPointsDescription">Promotion Description</label>
            <input v-model="dataPointsPromotion.attributes.description" name="promoDataPointsDescription" data-vv-scope="datapoints" v-validate="'required'">
        </div>
        <span class="error-message" v-for="error in errors.collect('datapoints.promoDataPointsDescription')" :key="error+'a'">{{ error }}</span>
        <div>
            <label for="promoMultiplier">Multiplier</label>
            <input v-model="dataPointsPromotion.attributes.value" type="number" name="promoMultiplier" data-vv-scope="datapoints" v-validate="'decimal'" data-vv-as="Multiplier">
        </div>
        <span class="error-message" v-for="error in errors.collect('datapoints.promoMultiplier')" :key="error+'b'">{{ error }}</span>
        <div>
            <label for="hasPromoCode">Has Promo Code</label>
            <input type="checkbox" name="hasPromoCode" v-model="hasPromoCode">
            <div v-if="hasPromoCode">
                <label for="promoCode">Promo Code</label>
                <input v-model="dataPointsPromotion.attributes.coupon" name="promoCode">
            </div>
        </div>
        <div>
            <label>Start Date Range Needed?</label>
            <input v-model="dateRangeNeeded" type="checkbox" name="dateRangeNeeded" data-vv-as="Date Range" v-validate="'included:0,1'"/>
        </div>
        <span class="error-message" v-for="error in errors.collect('dateRangeNeeded')" :key="error+'c'">{{ error }}</span>
        <div v-if="dateRangeNeeded">
            <label>Start Date</label>
            <datetime v-model="dataPointsPromotion.attributes.start_date" type="datetime" name="startDate" v-validate="'required_if:dateRangeNeeded,true'" data-vv-as="Start Date"></datetime>
        </div>
        <span class="error-message" v-for="error in errors.collect('startDate')" :key="error+'d'">{{ error }}</span>
        <div v-if="dateRangeNeeded">
            <label>End Date</label>
            <datetime v-model="dataPointsPromotion.attributes.end_date" type="datetime" name="endDate" v-validate="'required_if:dateRangeNeeded,true'" data-vv-as="End Date"></datetime>
        </div>
        <span class="error-message" v-for="error in errors.collect('endDate')" :key="error+'e'">{{ error }}</span>
        <div>
            <label>Active</label>
            <input v-model="dataPointsPromotion.attributes.active" type="checkbox" name="active" />
        </div>
        <span class="error-message" v-for="error in errors.collect('active')" :key="error+'d'">{{ error }}</span>
        <div>
            <button class="btn btn-primary" :key="$validator.errors.any('datapoints')" @click="saveDataPointsPromo()">Save Promotion</button>
            <div style="display:inline-block;">
                <a :href="'#!/marketing/promotion-targets/'+this.dataPointsPromotion.id"><button v-if="this.dataPointsPromotion.id" class="btn btn-warning">Promotion Targets</button></a>
            </div>
            <button class="btn btn-danger" @click="removeDataPointsPromotion()">Delete Promotion</button>
        </div>
        <span v-if="!this.dataPointsPromotion.id"> You cannot edit targets before you save the promotion </span>
    </div>
</template>

<script>
    // import {Datetime} from 'vue-datetime';
    import {promotionsStore} from "@/stores";
    import {event} from '@/services';
    import {http} from '@/services';


    export default {

        // components:{Datetime},

        props:['promotion', 'campaign', 'arrayKey'],

        data(){
            return{
                dateRangeNeeded:false,
                dataPointsPromotion:this.promotion,
                hasPromoCode: false
            }
        },

        created(){
            if(this.promotion.attributes.coupon) {
                this.hasPromoCode = true;
            }
        },

        watch:{
            dateRangeNeeded(){
                if(this.dateRangeNeeded === true){
                    let startDate = new Date();
                    let endDate = new Date();

                    this.dataPointsPromotion.attributes.start_date = startDate.toISOString();
                    this.dataPointsPromotion.attributes.end_date = endDate.toISOString();
                }else{
                    this.dataPointsPromotion.attributes.start_date = this.campaign.attributes.start_date;
                    this.dataPointsPromotion.attributes.end_date = this.campaign.attributes.end_date;
                }
            },
            
            view() {
                this.$validator.reset();
            },

            promotion(){
                if(this.promotion != null){
                    let currentPromotion = JSON.parse(JSON.stringify(this.promotion));

                    if((currentPromotion.attributes.start_date != null) && (currentPromotion.attributes.end_date != null)) {
                        let startDate = new Date(this.promotion.attributes.start_date);
                        let endDate = new Date(this.promotion.attributes.end_date);

                        currentPromotion.attributes.start_date = startDate.toISOString();
                        currentPromotion.attributes.end_date = endDate.toISOString();

                        this.dateRangeNeeded = true;
                    }
                    this.dataPointsPromotion = currentPromotion;
                    if(this.dataPointsDiscount.attributes.discount_type === 'multiplier') {
                        this.dataPointsDiscount.attributes.value = this.dataPointsDiscount.attributes.value.toFixed(2)
                    }
                }
                this.$validator.reset();
            }
        },

          


        methods:{
            async saveDataPointsPromo(){

                await this.$validator.validateAll('datapoints');

               if(this.$validator.errors.any('datapoints')) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }

                let data = http.createData(this.dataPointsPromotion);;

               try{
                   if(data.data.id != null) {
                       this.dataPointsPromotion = await promotionsStore.updatePromo(data)
                        this.dataPointsPromotion.attributes.value = this.dataPointsPromotion.attributes.value.toFixed(2)
                   }else {
                       this.dataPointsPromotion = await promotionsStore.savePromo(data);
                   }
               }catch(error){
                    console.log(error);
               }

            },

            removeDataPointsPromotion(){
                event.emit(event.names.UPDATE_PROMOTIONS, this.dataPointsPromotion , this.arrayKey);
            }
        }
    }
</script>

<style scoped>

</style>