<template>
    <div class="main-sections__editForm">
        <div v-show="view === 'edit-delivery-type'" class="overviewTabs">
            <ul class="list-inline" style="margin-bottom:0;">
                <li v-bind:class="{ activeTab: tab === 'details' }" @click="changeTab('details')">Delivery Info</li>
                <li v-bind:class="{ activeTab: tab === 'exclusions' }" @click="changeTab('exclusions')">Exclusions Zones</li>
            </ul>
        </div>
        <div class="main-sections__editForm__container">
            <delivery-type-details  v-show='tab === "details"' :subview="view" :deliverytype="delivery[0]" :locations="locations"/>
            <delivery-exclusion-zones v-show='tab === "exclusions" ':delivery="delivery" :locations="locations"/>

        </div>
    </div>
</template>

<script>
    import {event} from '@/services';
    import DeliveryTypeDetails from '@/components/inventory/deliverytypes/DeliveryTypeDetails';
    import DeliveryExclusionZones from "./DeliveryExclusionZones";


    export default {

        components: {DeliveryTypeDetails, DeliveryExclusionZones},

        props:['view' ,'delivery','locations'],

        data:function() {
            return {
                tab:'details',
            }
        },

        watch:{
            view(){
                this.tab = 'details';
            }
        },

        methods:{
            changeTab(tab){
                this.tab = tab;
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
</style>