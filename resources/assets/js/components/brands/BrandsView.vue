<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Brands</span>
        </page-header>     
            <div v-show="subview ==='view-all-brands'">
                <a href="#!/brands/create">
                    <button class="btn btn-app btn-primary btn-lg">Create a new Brand</button>
                </a>
            </div>
        <div class="main-sections__content">
            <brands-list v-show="view === 'view-all-brands'" :page="pagenum"></brands-list>
            <brands-main v-show="view === 'brand-details'" :brands="brands" :view="view"></brands-main>
            <brands-create v-show="view === 'brands-create'"></brands-create>
        </div>
    </section>
</template>

<script>
    import {event} from '@/services';
    import PageHeader from '@/components/shared/PageHeader';
    import BrandsList from '@/components/brands/BrandsList';
    import BrandsMain from '@/components/brands/BrandsMain';
    import BrandsCreate from '@/components/brands/BrandsCreate';
    import BrandStub from '@/stubs/brands';



    export default {
        name: "BrandsView",

        components: {PageHeader, BrandsList, BrandsMain, BrandsCreate},

        props:['subview', 'brand', 'pagenum'],

        data(){
            return{
                view:this.subview,
                brands:BrandStub
            }
        },

        watch:{
            subview(){
                this.view = this.subview;
            },

            brand(){
                if(this.brand){
                    if(this.brand.type === 'brands'){
                        this.brands = this.brand;
                    }
                }

            }
        },

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>