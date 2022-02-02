<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Delivery Types</span>
        </page-header>

        <div v-show="subview ==='delivery-types'">
                <a href="#!/delivery-types/create">
                    <button class="btn btn-app btn-primary btn-lg">Create a new Delivery Type</button>
                </a>
            </div>

        <div class="main-sections__content">
            <delivery-type-list :tableData="state" v-show="subview ==='delivery-types'" :subview="subview"/>
            <delivery-main v-show="subview ==='edit-delivery-type' || subview === 'create-delivery-type'" :view="view" :locations="locations" :delivery="deliverytype"/>
        </div>
    </section>
</template>

<script>
    import {event} from '@/services';
    import PageHeader from '@/components/shared/PageHeader';
    import DeliveryTypeList from '@/components/inventory/deliverytypes/DeliveryTypeList';
    import DeliveryTypeDetails from '@/components/inventory/deliverytypes/DeliveryTypeDetails';
    import DeliveryMain from '@/components/inventory/deliverytypes/DeliveryMain';
    import {deliveryTypeStore} from "../../../stores";


    export default {
        components: {PageHeader, DeliveryTypeList, DeliveryTypeDetails, DeliveryMain},

        props:['subview', 'deliverytype'],

        data(){
            return{
                view:this.subview,
                locations:[],
                state: deliveryTypeStore.state
            }
        },

        mounted(){
          this.getLocations();
        },

        methods:{
            async getLocations(){
                this.locations = await deliveryTypeStore.getDeliveryLocations();
            }
        },

        watch:{
            subview(){
                this.view = this.subview;
            },

        },

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>