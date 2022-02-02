<template>
    <div class="main-sections__editForm">
        <div v-show="subview === 'product-sash-details'" class="overviewTabs">
            <ul class="list-inline">
                <li v-bind:class="{ activeTab: tab === 'productSashDetails' }" @click="changeTab('productSashDetails')">Product Sash Details</li>
                <li v-bind:class="{ activeTab: tab === 'attachedProducts' }" @click="changeTab('attachedProducts')">Attached Products</li>
            </ul>
        </div>

        <div class="main-sections__editForm__container">
            <product-sash-details v-show="tab ==='productSashDetails'" :productsash="productsash" :type="subview"/>
            <sash-attached-products v-show="tab ==='attachedProducts'" :productsash="productsash" :attachedProducts="attachedProducts" :type="subview"/>
        </div>
    </div>
</template>

<script>
    import ProductSashDetails from '@/components/products/ProductSashDetails';
    import SashAttachedProducts from '@/components/products/SashAttachedProducts';
    import {productStore, productSashStore} from "@/stores";
    import {event} from '@/services';
    import {http} from '@/services';
    import Vue from 'vue';

    export default {
        name: "ProductSashMain",

        components:{ProductSashDetails, SashAttachedProducts},

        props:['subview', 'productsash'],

        data(){
            return{ 
                tab:'productSashDetails',
                attachedProducts: [],
            }
        },

        watch: {
            productsash(){
                if(this.productsash.products){
                    this.attachedProducts = this.productsash.products;
                }
            }
        },


        methods:{

            changeTab(tab){
                this.tab = tab;
            },

             async getAttachedProducts(id){
                let attached = await productStore.productByID(id);
                this.attachedProducts.push(attached);
            },
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>
