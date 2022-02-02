<template>
    <div class="details-form">
        <div class="details-form__body form-sections" >
            <div>
                <h2>Promo Details</h2>
            </div>
             <div id="promoTypeContainer">
                <label for="promoType">Promo Type: </label>
                <select :disabled="tab == null" v-model="promoType" id="promoType">
                    <option :disabled="true" value="0">Select a Promo Type</option>
                    <option v-for="(promo, p) in promoTypeList" :key="p" :value="p+1">
                        {{promo}}
                    </option>
                </select>
            </div>
        <text-promotion
        v-show="promoType == 1"
        :promoInfo="promoInfo"
        :subview="subview"
        :promoType="promoType"
        :tab="tab"
        ></text-promotion>
        <product-promotion
        v-show="promoType == 2"
        :promoInfo="promoInfo"
        :subview="subview"
        :promoType="promoType"
        :tab="tab"
        ></product-promotion>
                <banner-promotion
        v-show="promoType == 3"
        :promoInfo="promoInfo"
        :subview="subview"
        :promoType="promoType"
        :tab="tab"
        ></banner-promotion>
        </div>
    </div>
</template>

<script>
    import {homePromosStore} from '@/stores';
    import {event} from '@/services';
    import textPromotion from './promo_types/textPromotion';
    import bannerPromotion from './promo_types/bannerPromotion';
    import productPromotion from './promo_types/productPromotion';

    export default {

        components: {
            textPromotion, 
            bannerPromotion, 
            productPromotion
            },

        props:['subview', 'promoInfo', 'tab'],

        data(){
            return{
                promoType: 0,
                promoTitle: null,
                promoDescription: null,
                promoLink: null,
                buttonText: null,
                buttonTitle: null,
                showSearch:false,
                promoImageID: null,
                promos: [],
                promoTypeList: [
                    'Text Promotion',
                    'Product Promotion',
                    'Banner Promotion'

                ]
            }
        },
        watch: {
            promoInfo() {
                this.promoType = this.promoInfo.attributes.promo_type;
            }
        },
        created() {
            this.promos = homePromosStore.state
        },
    }
</script>

<style lang="scss">
    @import "~#/variables";

    #productSelectedStockItems{
        li {
            font-size: 1.4rem;
        }

        span{
            font-size:1.2rem;
        }
    }


    .productOverviewContainter{
        textarea{
            width:80rem;
            height:10rem;
        }

        label{
            vertical-align: top;
        }

    }

</style>