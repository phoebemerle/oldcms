<template>
    <div>
        <div class="overviewTabs">
            <ul class="list-inline" style="margin-bottom:0;">
                <!-- <li v-bind:class="{ activeTab: tab === 'productPage' }" @click="changeTab('productPage')">Product Page</li> -->
                <li v-bind:class="{ activeTab: tab === 'stockItem' }" @click="changeTab('stockItem')">Stock Item</li>
                <li v-bind:class="{ activeTab: tab === 'categories' }" @click="changeTab('categories')">Categories</li>
                <li v-bind:class="{ activeTab: tab === 'brands' }" @click="changeTab('brands')">Brands</li>
                <li v-bind:class="{ activeTab: tab === 'product-groups' }" @click="changeTab('product-groups')">Product Groups</li>
            </ul>
        </div>
        <div>
            <!-- <product-target v-show="tab === 'productPage'" :targets="productTargets" :promotion="promotion"/> -->
            <stock-item-target v-show="tab === 'stockItem'"  :targets="stockItemTargets" :promotion="promotion"/>
            <category-target v-show="tab === 'categories'" :targets="categoryTargets" :promotion="promotion"/>
            <brand-target v-show="tab === 'brands'" :targets="brandTargets" :promotion="promotion"/>
            <product-group-target v-show="tab === 'product-groups'" :targets="productGroupTargets" :promotion="promotion"/>
        </div>
    </div>
</template>

<script>
    import BrandTarget from '@/components/marketing/promotion/targets/BrandTarget';
    import CategoryTarget from '@/components/marketing/promotion/targets/CategoryTarget';
    import ProductTarget from '@/components/marketing/promotion/targets/ProductTarget';
    import ProductGroupTarget from '@/components/marketing/promotion/targets/ProductGroupTarget';
    import StockItemTarget from '@/components/marketing/promotion/targets/StockItemTarget';
    import {inventoryStore} from "@/stores";
    import {productStore} from "@/stores";
    import {categoryStore} from "@/stores";
    import {brandsStore} from "@/stores";
    import {productGroupsStore} from '@/stores';
    import {event} from '@/services';
    
    export default {
        name: "PromotionTargets",

        components:{BrandTarget, CategoryTarget, ProductTarget, StockItemTarget, ProductGroupTarget},

        props:['promotion', 'targets'],

        data(){
            return{
                tab:'stockItem',
                stockItemTargets:[],
                productTargets:[],
                productGroupTargets:[],
                categoryTargets:[],
                brandTargets:[],
                view:''
            }
        },

        created()
        {
            event.on(event.names.UPDATE_NAVIGATION_VIEW, (view) => {
                this.view = view;
            })
        },

        watch:{
            view()
            {
                this.tab = 'stockItem';
            },
            targets(){
                this.stockItemTargets = [];
                this.productTargets = [];
                this.categoryTargets = [];
                this.brandTargets = [];
                this.productGroupTargets = [];

                this.sortTargets();
            },
            tab() {
                event.emit('tab', this.tab);
            }
        },

        methods:{
            async sortTargets(){
                for(let a =0; a < this.targets.length; a++){
                    this.getTargetInfo(this.targets[a]);
                }
            },

            async getTargetInfo(target){
                let tempTarget = target;
                if(target.attributes.target_type === 'stockitems') {
                    let stockItem = await inventoryStore.stockItemByID(tempTarget.attributes.target_id);

                    tempTarget.attributes.details = {
                        'description': stockItem.attributes.description,
                        'code': stockItem.attributes.code,

                    };

                    this.stockItemTargets.push(tempTarget);

                }else if (target.attributes.target_type === 'products'){
                    let product = await productStore.productByID(tempTarget.attributes.target_id);

                    tempTarget.attributes.details = {
                        'title':product.attributes.title,
                        'short_desc':product.attributes.short_desc,
                        'overview':product.attributes.long_desc,

                    };

                    this.productTargets.push(tempTarget);
                }else if (target.attributes.target_type === 'categories'){

                    let category = await categoryStore.categoryByID(tempTarget.attributes.target_id);

                    tempTarget.attributes.details = {
                        'title':category.attributes.title,
                        'contains':category.attributes.attached_type,

                    };

                    this.categoryTargets.push(tempTarget);
                }
                else if (target.attributes.target_type === 'brands'){

                    let brand = await brandsStore.brandByID(tempTarget.attributes.target_id);

                    tempTarget.attributes.details = {
                        'name':brand.attributes.name,
                    };

                    this.brandTargets.push(tempTarget);
                }else if (target.attributes.target_type === 'productgroup'){

                    let productgroup = await productGroupsStore.byGroupID(tempTarget.attributes.target_id);

                    tempTarget.attributes.details = {
                        'name':productgroup.attributes.name,
                        'code':productgroup.attributes.code,
                        'sage_id':productgroup.attributes.sage_id
                    };

                    this.productGroupTargets.push(tempTarget);
                }
            },

            changeTab(tab){
                this.tab = tab;
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";


</style>