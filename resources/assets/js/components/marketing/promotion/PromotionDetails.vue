<template>
    <div class="details-form">
        <div class="details-form__body">
            <div>
                <h1>Promotion Info</h1>
                <hr>
                <div>
                    <label>Promotion type:</label>
                    <p>{{promotionType}}</p>
                </div>
                <div>
                    <label>Promotion Name:</label>
                    <p>{{promotionDetails.attributes.description}}</p>
                </div>
                <div v-if="promotionType === 'Discount Promotion'">
                    <label>Discount Type</label>
                    <p>{{discountType}}</p>
                </div>
                <div>
                    <label>Value:</label>
                    <p>{{promotionDetails.attributes.value}}<span v-if="promotionType === 'Discount Promotion' || promotionType === 'Multibuy Offer Promotion'">%</span></p>
                </div>
            </div>
            <!--<div>-->
                <!--<h1>Promotion Targets</h1>-->
                <!--<hr>-->
                <!--<div v-if="(brandTargets.length < 1) && (categoryTargets.length < 1) && (productPageTargets.length < 1) && (stockItemTargets.length < 1)">-->
                    <!--<h3 style="color:red;">There are currently no targets attached to this promotion. Go into the <span style="font-weight:bold;">"Promotion Targets"</span> tab to add some.</h3>-->
                <!--</div>-->
                <!--<div v-if="brandTargets.length > 0">-->
                    <!--<h2>Brands</h2>-->
                    <!--<div v-for="brand in brandTargets"></div>-->
                <!--</div>-->
                <!--<div v-if="categoryTargets.length > 0">-->
                    <!--<h2>Categories</h2>-->
                    <!--<div v-for="category in categoryTargets"></div>-->
                <!--</div>-->
                <!--<div v-if="productPageTargets.length > 0">-->
                    <!--<h2>Product Pages</h2>-->
                    <!--<div> v-for="productPage in productPageTargets"</div>-->
                <!--</div>-->
                <!--<div v-if="stockItemTargets.length > 0">-->
                    <!--<h2>Stock Items</h2>-->
                    <!--<div v-for="stockItem in stockItemTargets">-->

                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        </div>
    </div>
</template>

<script>
    import {inventoryStore} from "@/stores";
    import {productStore} from "@/stores";
    import {categoryStore} from "@/stores";
    import {brandsStore} from "@/stores";

    export default {
        name: "PromotionDetails",

        components:{},

        props:['promotion', 'targets'],

        data(){
            return{
                promotionDetails:{
                    'attributes':{
                        'description':'',
                        'value':'',
                        'discount_type':''
                    }
                },
                promotionType:'',
                discountType:'',
                brandTargets:[],
                categoryTargets:[],
                productPageTargets:[],
                stockItemTargets:[],
                primaryStockitem:null,
                secondaryStockitem:null
            }
        },

        watch:{
            async promotion(){
                if(this.promotion && this.promotion.type === 'promotions'){

                    this.promotionDetails = this.promotion;

                    if(this.promotion.attributes.promotion_type === 'discount_promotion'){
                        this.promotionType = 'Discount Promotion';
                        if(this.promotionDetails.attributes.discount_type === 'flat_discount'){
                            this.discountType = 'Money Off Discount';
                        }else if(this.promotionDetails.attributes.discount_type === 'percentage'){
                            this.discountType = 'Percentage Discount';
                    }else if(this.promotion.attributes.promotion_type === 'data_points_promotion') {
                        this.promotionType = 'Data Points Promotion'
                    }else if(this.promotion.attributes.promotion_type === 'bundle_discount') {
                        this.promotionType = 'Bundle Discount Promotion'
                    }else if(this.promotion.attributes.promotion_type === 'multibuy_offer') {
                        this.promotionType = 'Multibuy Offer Promotion';

                    }

                }
            }
        },

        methods:{
            // async getTargetInfo(target){
            //     let tempTarget = target;
            //     if(target.attributes.target_type === 'stockitems') {
            //         let stockItem = await inventoryStore.stockItemByID(tempTarget.attributes.target_id);
            //
            //         tempTarget.attributes.details = {
            //             'description': stockItem.attributes.description,
            //             'code': stockItem.attributes.code,
            //
            //         };
            //
            //         this.stockItemTargets.push(tempTarget);
            //
            //     }else if (target.attributes.target_type === 'products'){
            //         let product = await productStore.productByID(tempTarget.attributes.target_id);
            //
            //         tempTarget.attributes.details = {
            //             'title':product.attributes.title,
            //             'overview':product.attributes.overview,
            //
            //         };
            //
            //         this.productTargets.push(tempTarget);
            //     }else if (target.attributes.target_type === 'categories'){
            //
            //         let category = await categoryStore.categoryByID(tempTarget.attributes.target_id);
            //
            //         tempTarget.attributes.details = {
            //             'title':category.attributes.title,
            //             'contains':category.attributes.attached_type,
            //
            //         };
            //
            //         this.categoryTargets.push(tempTarget);
            //     }
            //     else if (target.attributes.target_type === 'brands'){
            //
            //         let brand = await brandsStore.brandByID(tempTarget.attributes.target_id);
            //
            //         tempTarget.attributes.details = {
            //             'name':brand.attributes.name,
            //         };
            //
            //         this.brandTargets.push(tempTarget);
            //     }
            },
        }
    }
</script>


<style lang="scss">
    @import "~#/variables";

.details-form{
    &__body{
        p{
            display:inline-block;
        }
    }
}

</style>