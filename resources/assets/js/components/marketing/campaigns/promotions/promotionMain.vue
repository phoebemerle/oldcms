<template>
    <div>
        <div>
            <div class="overviewTabs">
                <ul class="list-inline" style="margin-bottom:0;">
                    <li v-bind:class="{ activeTab: tab === 'discount' }" @click="changeTab('discount')">Discount Promotions</li>
                    <li v-bind:class="{ activeTab: tab === 'dataPoints' }" @click="changeTab('dataPoints')">Data Points Promotions</li>
                    <li v-bind:class="{ activeTab: tab === 'bundle' }" @click="changeTab('bundle')">Bundle Discounts</li>
                    <li v-bind:class="{ activeTab: tab === 'multibuy' }" @click="changeTab('multibuy')">Multibuy Offer</li>
                </ul>
            </div>
            <div class="details-form" style="border:1px solid #c9c9c9; border-radius:5px; padding:10px;">
                <button @click="addNewPromotion()" class="btn btn-success" style="margin-bottom:10px;">Add New Promotion</button>
                <div v-show="tab === 'discount'">
                    <h3 v-show="discountPromo.length === 0">There are no discount promotions currently attached to this campaign</h3>
                    <discount-promotions-details   v-for="(promotion, key) in discountPromo" :promotion="promotion" :arrayKey="key" :key="promotion.id" :campaign="campaign"/>
                </div>
                <div v-show="tab === 'dataPoints'">
                    <h3 v-show="dataPointsPromo.length === 0">There are no data points promotions currently attached to this campaign</h3>
                    <data-points-promotion-details   v-for="(promotion, key) in dataPointsPromo" :promotion="promotion" :arrayKey="key" :key="promotion.id" :campaign="campaign"/>
                </div>
                <div v-show="tab === 'bundle'">
                    <h3 v-show="bundlePromo.length === 0">There are no bundle promotions currently attached to this campaign</h3>
                    <bundle-promotion-details   v-for="(promotion, key) in bundlePromo" :promotion="promotion" :arrayKey="key" :key="promotion.id" :campaign="campaign"/>
                </div>
                <div v-show="tab === 'multibuy'">
                    <h3 v-show="multibuyPromo.length === 0">There are no multibuy offer promotions currently attached to this campaign</h3>
                    <multibuy-promotion-details   v-for="(promotion, key) in multibuyPromo" :promotion="promotion" :arrayKey="key" :tab="tab" :key="promotion.id" :campaign="campaign"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import DiscountPromotionsDetails from '@/components/marketing/campaigns/promotions/DiscountPromotionDetails';
    import DataPointsPromotionDetails from '@/components/marketing/campaigns/promotions/DataPointsPromotionDetails';
    import BundlePromotionDetails from '@/components/marketing/campaigns/promotions/BundlePromotionDetails';
    import MultibuyPromotionDetails from '@/components/marketing/campaigns/promotions/MultibuyPromotionDetails';
    import {promotionsStore} from "@/stores";
    import {event} from '@/services';
    import promoStub from '@/stubs/promotions';

    export default {
        name: "promotionMain",

        components:{DiscountPromotionsDetails, DataPointsPromotionDetails, BundlePromotionDetails, MultibuyPromotionDetails},

        props:['promotions', 'campaign'],

        data(){
            return{
                tab:'discount',
                dataPointsPromo:[],
                discountPromo:[],
                bundlePromo:[],
                multibuyPromo:[]
            }
        },

        watch:{
            promotions(){
                this.dataPointsPromo = this.sortPromotions('data_points_promotion');
                this.discountPromo = this.sortPromotions('discount_promotion');
                this.multibuyPromo = this.sortPromotions('multibuy_offer');
                this.bundlePromo = this.sortPromotions('bundle_discount');
            }
        },

        created() {
            event.on(event.names.UPDATE_PROMOTIONS, (data, key) => {
                if(data.id != null) {
                    this.removePromotions(data, key);
                }else{
                   this.removeFromPromotionArray(data,key);
                }
            });
        },

        methods:{
            addNewPromotion(){
                let data = promoStub;

                data.attributes.campaign_id = this.campaign.id;
                data.relationships.campaign.data.id = this.campaign.id;


                if(this.tab === 'discount'){

                    data.attributes.discount_type = 'flat_discount'
                    data.attributes.promotion_type = 'discount_promotion'
                    data.attributes.value = 0

                    this.discountPromo.push(data);

                }else if(this.tab === 'dataPoints'){

                    data.attributes.promotion_type = 'data_points_promotion'
                    data.attributes.value = 1

                    this.dataPointsPromo.push(data);
                }else if(this.tab === 'bundle'){

                    data.attributes.discount_type = 'flat_discount'
                    data.attributes.promotion_type = 'bundle_discount'
                    data.attributes.value = 0

                    this.bundlePromo.push(data);
                }else if(this.tab === 'multibuy'){

                    data.attributes.minimum_quantity = 1
                    data.attributes.promotion_type = 'multibuy_offer'
                    data.attributes.value = 0
                    data.attributes.priority = null

                    this.multibuyPromo.push(data);
                }
            },

            changeTab(tab){
              this.tab = tab;
            },

            sortPromotions(promoType){
                let promoArray = [];

                for(let a = 0; a < this.promotions.length; a++){
                    if(promoType === this.promotions[a].attributes.promotion_type){
                        promoArray.push(this.promotions[a]);
                    }
                }
                return promoArray;
            },
            removeFromPromotionArray(promo, key){
                if(promo.attributes.promotion_type === 'discount_promotion'){
                    this.discountPromo.splice(key, 1);
                }else if(promo.attributes.promotion_type === 'data_points_promotion'){
                    this.dataPointsPromo.splice(key,1);
                }else if(promo.attributes.promotion_type === 'bundle_discount'){
                    this.bundlePromo.splice(key,1);
                }else if(promo.attributes.promotion_type === 'multibuy_offer'){
                    this.multibuyPromo.splice(key,1);
                }
            },

            async removePromotions(promo, key){
                try{
                    await promotionsStore.deletePromo(promo.id);
                    this.removeFromPromotionArray(promo, key);
                }catch(error){
                    console.log(error);
                }
            }
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>