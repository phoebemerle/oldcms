<template>
    <div class="details-form__body" style="border:1px solid #c9c9c9; border-radius:5px; padding:10px; margin-bottom:10px;">
        <div>
            <label for="promoNewPrice">Description</label>
            <input v-model="multibuyPromotion.attributes.description" data-vv-scope="mb" name="promoDescription" v-validate="'required'"  data-vv-as="New Price">
        </div>
        <span class="error-message" v-for="error in errors.collect('mb.promoDescription')" :key="error+'a'">{{ error }}</span>
        <div>
            <label for="promoNewPrice">New Price</label>
            <input v-model="multibuyPromotion.attributes.value" data-vv-scope="mb" type="number" name="promoNewPrice" v-validate="'required|decimal'"  data-vv-as="New Price">
        </div>
        <span class="error-message" v-for="error in errors.collect('mb.promoNewPrice')" :key="error+'a'">{{ error }}</span>
        <div>
            <label for="promoMinQty">Minimum Quantity</label>
            <input v-model="multibuyPromotion.attributes.minimum_quantity" name="promoMinQty" data-vv-scope="mb" v-validate="'required|numeric'" type="number" data-vv-as="Minimum Quantity">
        </div>
         <span class="error-message" v-for="error in errors.collect('mb.promoMinQty')" :key="error+'b'">{{ error }}</span>
        <div>
            <label for="promoActive">Active</label>
            <input v-model="multibuyPromotion.attributes.active" name="promoActive" data-vv-scope="mb" type="checkbox" data-vv-as="Active">
        </div>
        <span class="error-message" v-for="error in errors.collect('mb.promoPriority')" :key="error+'b'">{{ error }}</span>
        <div>
            <label>Start Date Range Needed?</label>
            <input v-model="dateRangeNeeded" type="checkbox" name="dateRangeNeeded" data-vv-scope="mb" data-vv-as="Date Range" v-validate="'included:0,1'"/>
        </div>
        <span class="error-message" v-for="error in errors.collect('mb.dateRangeNeeded')" :key="error+'c'">{{ error }}</span>
        <div v-if="dateRangeNeeded">
            <label>Start Date</label>
            <datetime v-model="multibuyPromotion.attributes.start_date" type="datetime" data-vv-scope="mb" name="startDate" v-validate="'required_if:dateRangeNeeded,true'" data-vv-as="Start Date"></datetime>
        </div>
        <span class="error-message" v-for="error in errors.collect('mb.startDate')" :key="error+'d'">{{ error }}</span>
        <div v-if="dateRangeNeeded">
            <label>End Date</label>
            <datetime v-model="multibuyPromotion.attributes.end_date" data-vv-scope="mb" type="datetime" name="endDate" v-validate="'required_if:dateRangeNeeded,true'" data-vv-as="End Date"></datetime>
        </div>
        <span class="error-message" v-for="error in errors.collect('mb.endDate')" :key="error+'e'">{{ error }}</span>
        <div>
            <button class="btn btn-primary" :key="$validator.errors.any('mb')" @click="saveMultibuyPromo()">Save Promotion</button>
            <div style="display:inline-block;">
                <a :href="'#!/marketing/promotion-targets/'+multibuyPromotion.id"><button v-if="multibuyPromotion.id" class="btn btn-warning">Promotion Targets</button></a>
            </div>
            <button class="btn btn-danger" @click="removeMultibuyPromotion()">Delete Promotion</button>
        </div>

        <span v-if="!this.multibuyPromotion.id"> You cannot edit targets before you save the promotion </span>
    </div>
</template>

<script>
    // import {Datetime} from 'vue-datetime';
    import {promotionsStore, inventoryStore} from "@/stores";
    import {event} from '@/services';
    import {http} from '@/services';
    import Vue from 'vue';


    export default {

        // components:{Datetime},

        props:['promotion', 'campaign', 'tab', 'arrayKey'],

        data(){
            return{
                dateRangeNeeded:false,
                multibuyPromotion:this.promotion,
                stockitem:''
            }
        },

        created()
        {
            // event.on(event.names.SELECT_MODAL_STOCK, (stock, type) => {
            //         this.multibuyPromotion.attributes.details.stockitem_id = stock.attributes.stock_id
            //         console.log(stock)
            //         Vue.set(this.multibuyPromotion.attributes.details, 'stockitem', stock.attributes.description)
            // });
        },

        watch:{
            async dateRangeNeeded(){
                if(this.dateRangeNeeded === true){
                    let startDate = new Date();
                    let endDate = new Date();

                    this.multibuyPromotion.attributes.start_date = startDate.toISOString();
                    this.multibuyPromotion.attributes.end_date = endDate.toISOString();
                }else{
                    this.multibuyPromotion.attributes.start_date = this.campaign.attributes.start_date;
                    this.multibuyPromotion.attributes.end_date = this.campaign.attributes.end_date;
                }
            },
            
            view() {
                this.$validator.reset();
            },

            async tab()
            {
                if(this.promotion != null){

                    let currentPromotion = JSON.parse(JSON.stringify(this.promotion));
                    // this.stockitem = await inventoryStore.getStockItem(currentPromotion.attributes.details.stockitem_id)

                    if((currentPromotion.attributes.start_date != null) && (currentPromotion.attributes.end_date != null)) {
                        let startDate = new Date(this.promotion.attributes.start_date);
                        let endDate = new Date(this.promotion.attributes.end_date);

                        currentPromotion.attributes.start_date = startDate.toISOString();
                        currentPromotion.attributes.end_date = endDate.toISOString();

                        this.dateRangeNeeded = true;
                    }
                    this.multibuyPromotion = currentPromotion;
                }
                this.$validator.reset();
            },

            async promotion(){
                if(this.promotion != null){

                    let currentPromotion = JSON.parse(JSON.stringify(this.promotion));
                    // this.stockitem = await inventoryStore.getStockItem(currentPromotion.attributes.details.stockitem_id)

                    if((currentPromotion.attributes.start_date != null) && (currentPromotion.attributes.end_date != null)) {
                        let startDate = new Date(this.promotion.attributes.start_date);
                        let endDate = new Date(this.promotion.attributes.end_date);

                        currentPromotion.attributes.start_date = startDate.toISOString();
                        currentPromotion.attributes.end_date = endDate.toISOString();

                        this.dateRangeNeeded = true;
                    }
                    this.multibuyPromotion = currentPromotion;
                }
                this.$validator.reset();
            },
        },

          


        methods:{
            openModal(type) {
                event.emit(event.names.OPEN_STOCK_MODAL, true, type)
            },
            async saveMultibuyPromo(){

                await this.$validator.validateAll('mb');

               if(this.$validator.errors.any('mb')) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }

                let data = http.createData(this.multibuyPromotion);

               try{
                   if(data.data.id != null) {
                       this.multibuyPromotion = await promotionsStore.updatePromo(data)
                   }else {
                       this.multibuyPromotion = await promotionsStore.savePromo(data);
                   }
               }catch(error){
                    console.log(error);
               }

            },

            removeMultibuyPromotion(){
                event.emit(event.names.UPDATE_PROMOTIONS, this.multibuyPromotion , this.arrayKey);
            }
        }
    }
</script>

<style scoped>

</style>