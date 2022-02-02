<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Products</span>
        </page-header>

        <div class="main-sections__content">

            <div v-show="subview ==='view-all-products'">
                <a href="#!/products/create">
                    <button class="btn btn-app btn-primary btn-lg">Create a new Product</button>
                </a>
            </div>

            <product-home v-show="subview ==='product-dashboard'" :page="pagenum"/>
            <product-list v-show="subview ==='view-all-products'"/>
            <product-main v-show="subview ==='edit-product' || subview === 'create-product'" :subview="subview" :product="product"/>
<!--            <product-badges-list v-show="subview === 'view-all-product-badges'"/>-->
<!--            <product-badge-details v-show="subview === 'product-badge-details' | subview === 'create-product-badge'"  :type="subview" :productbadge="product"/>-->
            <product-sashes-list v-show="subview === 'view-all-product-sashes'"/>
            <product-sash-main v-show="subview === 'product-sash-details' | subview === 'create-product-sash'"  :subview="subview" :productsash="product"/>

        </div>
    </section>
</template>


<script>
    import {productStore} from '@/stores';
    import {productBadgesStore} from '@/stores';
    import PageHeader from '@/components/shared/PageHeader';
    import ProductHome from '@/components/products/ProductHome';
    import ProductList from '@/components/products/ProductList';
    import CreateProduct from '@/components/modals/CreateProduct';
    import ProductDetails from '@/components/products/ProductDetails';
    import ProductMain from '@/components/products/ProductMain';
    import ProductBadgesList from '@/components/products/ProductBadgesList';
    import ProductBadgeDetails from '@/components/products/ProductBadgeDetails';
    import ProductBadgeStub from '@/stubs/productBadge';
    import ProductSashesList from '@/components/products/ProductSashesList';
    import ProductSashMain from '@/components/products/ProductSashMain';

    export default {
        components: {PageHeader, ProductHome, ProductList, CreateProduct, ProductDetails, ProductMain, ProductBadgesList, ProductBadgeDetails, ProductSashesList, ProductSashMain},

        props:['subview', 'product', 'productbadge', 'pagenum', 'productsash'],

        data() {
            return {
                state: productStore.state,
                productbadges: ProductBadgeStub,
            }
        },

         watch: {
            //
            // productbadge(){
            //     if(this.productbadge.length > 0){
            //         if(this.productbadge[0].type === 'productbadges'){
            //             this.productbadges = this.productbadge[0];
            //         }
            //     }
            //
            // }
            
        },

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>