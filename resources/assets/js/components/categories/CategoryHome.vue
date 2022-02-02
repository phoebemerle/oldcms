<template>
    <div class="homeView">
        <div class="row">
            <div class="col-lg-3 col-xs-6">
                <div class="small-box bg-info">
                    <div class="inner">
                        <h3>{{categories.categories.length}}</h3>

                        <p>Total Categories</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-xs-6">
                <div class="small-box bg-success">
                    <div class="inner">
                        <h3>{{activeCategory}}</h3>
                        <p>Active Categories</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-xs-6">
                <div class="small-box bg-danger">
                    <div class="inner">
                        <h3>{{inactiveCategory}}</h3>
                        <p>Inactive Categories</p>
                    </div>
                </div>
            </div>
        </div>
        <category-list/>
    </div>
</template>

<script>
    import {categoryStore} from '@/stores';
    import CategoryList from '@/components/categories/CategoryList';

    export default {
        components: {CategoryList},

        data() {
            return {
                categories:categoryStore.state,
                searchRequest:'',
            }
        },

        computed: {
            activeCategory: function () {
                let activeProduct = 0;

                for (let a = 0; a < categoryStore.state.categories.length; a++) {
                    if (categoryStore.state.categories[a].attributes.active === 1) {

                        activeProduct ++;
                    }
                }
                return activeProduct;
            },

            inactiveCategory: function(){
                let inactiveProducts = 0;

                for (let a = 0; a < categoryStore.state.categories.length; a++) {
                    if (categoryStore.state.categories[a].attributes.active === 0) {

                        inactiveProducts ++;
                    }
                }
                return inactiveProducts;
            }
        },

    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>