<template>
    <div class="homeView">
        <div class="row">
            <div class="col-lg-3 col-xs-6">
                <div class="small-box bg-info">
                    <div class="inner">
                        <h3>{{active+inactive}}</h3>
                        <p>Total Product</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-xs-6">
                <div class="small-box bg-success">
                    <div class="inner">
                        <h3>{{active}}</h3>

                        <p>Active Products</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-xs-6">
                <div class="small-box bg-danger">
                    <div class="inner">
                        <h3>{{inactive}}</h3>
                        <p>Inactive Products</p>
                    </div>
                </div>
            </div>
        </div>
        <product-list :page="page" />
    </div>
</template>

<script>
    import {productStore} from '@/stores';
    import ProductList from '@/components/products/ProductList';

    export default {

        props:['page'],

        components: {ProductList},

        data() {
            return {
                products:productStore.state,
                searchRequest:'',
                inactive:0,
                active:0,
            }
        },

        created(){
          this.getCount();
        },

        methods:{
            async getCount(){
                let productCount = await productStore.countProducts();
                this.active = productCount.active;
                this.inactive = productCount.inactive;
            }
        }


    }
</script>

<style lang="scss">
    @import "~#/variables";

    .product-list {

        &__body {

            &__col {
                &--title {
                    width: 20%;
                }
                &--overview {
                    width: 80%;
                }
            }
        }
    }
</style>
