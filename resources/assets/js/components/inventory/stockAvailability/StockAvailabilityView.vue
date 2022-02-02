<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Stock Availability</span>
        </page-header>
        <div class="main-sections__content">
             <div v-show="subview ==='stock-availability-list'">
                <a href="#!/stock-availability/create">
                    <button class="btn btn-app btn-primary btn-lg">Create New Stock Availability</button>
                </a>
            </div>
            <stock-availability-list v-show="subview === 'stock-availability-list'"></stock-availability-list>
            <stock-availability-details :stockAvailability="stockAvailability" :view="subview" v-show="subview === 'stock-availability-create' || subview === 'stock-availability-edit'"></stock-availability-details>
        </div>
    </section>
</template>

<script>
    import {event} from '@/services';
    import PageHeader from '@/components/shared/PageHeader';
    import StockAvailabilityList from '@/components/inventory/stockAvailability/StockAvailabilityList';
    import StockAvailabilityDetails from '@/components/inventory/stockAvailability/StockAvailabilityDetails';

    export default {
        components: {PageHeader, StockAvailabilityList, StockAvailabilityDetails},

        props:['subview' , 'stockAvailability'],

        data:function() {
            return {
                view:this.subview,
            }
        },

        watch:{
            subview(){
                this.view = this.subview;
            }
        },

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";
</style>