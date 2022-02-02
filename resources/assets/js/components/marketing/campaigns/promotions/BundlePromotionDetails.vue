<template>
    <div class="details-form__body" style="border:1px solid #c9c9c9; border-radius:5px; padding:10px; margin-bottom:10px;">
        <div>
            <label for="promoDataPointsDescription">Promotion Description</label>
            <input v-model="bundlePromotion.attributes.description" name="promoBundleDescription" data-vv-as="description" v-validate="'required'">
        </div>
        <span class="error-message" v-for="error in errors.collect('promoBundleDescription')" :key="error+'a'">{{ error }}</span>
        <div>
            <label for="hasPromoCode">Has Promo Code</label>
            <input type="checkbox" name="hasPromoCode" v-model="hasPromoCode">
            <div v-if="hasPromoCode">
                <label for="promoCode">Promo Code</label>
                <input v-model="bundlePromotion.attributes.coupon" name="promoCode">
            </div>
        </div>
        <div>
            <label for="promoType">Discount Type</label>
            <select v-model="bundlePromotion.attributes.discount_type" id="promoType" name="discountType" v-validate="'required|included:flat_discount,percentage'">
                <option value="flat_discount">Money Off</option>
                <option value="percentage">% Discount</option>
            </select>
        </div>
        <span class="error-message" v-for="error in errors.collect('discountType')" :key="error+'b'">{{ error }}</span>
        <div>
            <label for="promoBundleDiscountAmount">Discount Amount</label>
            <input v-model="bundlePromotion.attributes.value" name="promoBundleDiscountAmount" v-validate="'required'">
        </div>
        <span class="error-message" v-for="error in errors.collect('promoBundleDiscountAmount')" :key="error+'a'">{{ error }}</span>
        <div>
            <label>Start Date Range Needed?</label>
            <input v-model="dateRangeNeeded" type="checkbox" name="dateRangeNeeded" data-vv-as="Date Range" v-validate="'included:0,1'"/>
        </div>
        <span class="error-message" v-for="error in errors.collect('dateRangeNeeded')" :key="error+'c'">{{ error }}</span>
        <div v-if="dateRangeNeeded">
            <label>Start Date</label>
            <datetime v-model="bundlePromotion.attributes.start_date" type="datetime" name="startDate" v-validate="'required_if:dateRangeNeeded,true'" data-vv-as="Start Date"></datetime>
        </div>
        <span class="error-message" v-for="error in errors.collect('startDate')" :key="error+'d'">{{ error }}</span>
        <div v-if="dateRangeNeeded">
            <label>End Date</label>
            <datetime v-model="bundlePromotion.attributes.end_date" type="datetime" name="endDate" v-validate="'required_if:dateRangeNeeded,true'" data-vv-as="End Date"></datetime>
        </div>
        <span class="error-message" v-for="error in errors.collect('endDate')" :key="error+'e'">{{ error }}</span>
        <div>
            <label>Active</label>
            <input v-model="bundlePromotion.attributes.active" type="checkbox" name="active" />
        </div>
        <span class="error-message" v-for="error in errors.collect('active')" :key="error+'d'">{{ error }}</span>
        <div>
            <button class="btn btn-primary" :key="$validator.errors.any()" @click="saveBundlePromo()">Save Promotion</button>
            <div style="display:inline-block;">
                <a :href="'#!/marketing/promotion-targets/'+this.bundlePromotion.id"><button class="btn btn-warning">Promotion Targets</button></a>
            </div>
            <button class="btn btn-danger" @click="removeBundlePromotion()">Delete Promotion</button>
        </div>
    </div>
</template>

<script>
    // import {Datetime} from 'vue-datetime';
    import {promotionsStore, inventoryStore} from "@/stores";
    import {event} from '@/services';
    import {http} from '@/services';


    export default {

        // components:{Datetime},

        props:['promotion', 'campaign', 'arrayKey'],

        data(){
            return{
                dateRangeNeeded:false,
                bundlePromotion:this.promotion,
                // primaryStockitem:null,
                // secondaryStockitem:null,
                modal: false,
                hasPromoCode: false
            }
        },

        async created()
        {
            // event.on(event.names.SELECT_MODAL_STOCK, (stock, type) => {
                // if(type === 'primary') {
                //     this.primaryStockitem = stock.attributes.description;
                //     this.bundlePromotion.attributes.details.primary_stockitem = stock.id;
                // } else if(type === 'secondary') {
                //     this.secondaryStockitem = stock.attributes.description;
                //     this.bundlePromotion.attributes.details.secondary_stockitem = stock.id;
                // }
            // });
            if(this.promotion.attributes.coupon) {
                this.hasPromoCode = true;
            }

            // if(this.promotion.attributes.details.primary_stockitem) {
            //     let primary = await inventoryStore.stockItemByID(this.promotion.attributes.details.primary_stockitem);
            //     this.primaryStockitem = primary.attributes.description
            // }
            // if(this.promotion.attributes.details.secondary_stockitem) {
            //     let secondary = await inventoryStore.stockItemByID(this.promotion.attributes.details.secondary_stockitem);
            //     this.secondaryStockitem = secondary.attributes.description
            // }
        },

        watch:{
            dateRangeNeeded(){
                if(this.dateRangeNeeded === true){
                    let startDate = new Date();
                    let endDate = new Date();

                    this.bundlePromotion.attributes.start_date = startDate.toISOString();
                    this.bundlePromotion.attributes.end_date = endDate.toISOString();
                }else{
                    this.bundlePromotion.attributes.start_date = this.campaign.attributes.start_date;
                    this.bundlePromotion.attributes.end_date = this.campaign.attributes.end_date;
                }
            },

            view() {
                this.$validator.reset();
            },

            async promotion(){
                if(this.promotion != null){
                    if(this.promotion.attributes.coupon) {
                        this.hasPromoCode = true;
                    }

                    let currentPromotion = JSON.parse(JSON.stringify(this.promotion));

                    if((currentPromotion.attributes.start_date != null) && (currentPromotion.attributes.end_date != null)) {
                        let startDate = new Date(this.promotion.attributes.start_date);
                        let endDate = new Date(this.promotion.attributes.end_date);

                        currentPromotion.attributes.start_date = startDate.toISOString();
                        currentPromotion.attributes.end_date = endDate.toISOString();

                        this.dateRangeNeeded = true;
                    }
                    this.bundlePromotion = currentPromotion;
                    // this.primaryStockitem = await inventoryStore.stockItemByID(this.bundlePromotion.attributes.details.primary_stockitem)['attributes']['description'];
                    // this.secondaryStockitem = await inventoryStore.stockItemByID(this.bundlePromotion.attributes.details.secondary_stockitem)['attributes']['description'];

                }
                this.$validator.reset();
            }
        },

          


        methods:{
            openModal(type) {
                event.emit(event.names.OPEN_STOCK_MODAL, true, type)
            },
            // addPrimary(stock) {
            //     this.bundlePromotion.attributes.details.primary_stockitem = stock.id;
            //     this.primaryStockitem = stock.attributes.description;
            //     this.primaryStockSearch = [];

            // },

            async saveBundlePromo(){

                await this.$validator.validateAll();

               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }

                let data = http.createData(this.bundlePromotion);;

               try{
                   if(data.data.id != null) {
                       this.bundlePromotion = await promotionsStore.updatePromo(data)
                   }else {
                       this.bundlePromotion = await promotionsStore.savePromo(data);
                   }
               }catch(error){
                    console.log(error);
               }

            },

            removeBundlePromotion(){
                event.emit(event.names.UPDATE_PROMOTIONS, this.bundlePromotion , this.arrayKey);
            }
        }
    }
</script>

<style scoped>

</style>