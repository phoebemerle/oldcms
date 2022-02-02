<template>
    <div class="main-sections__editForm">
        <div v-show="view === 'edit-stock'" class="overviewTabs">
            <ul class="list-inline" style="margin-bottom:0;">
                <li v-bind:class="{ activeTab: tab === 'details' }" @click="changeTab('details')">Product Info</li>
                <li v-show="productType === 'BOM'" v-bind:class="{ activeTab: tab === 'BOM' }" @click="changeTab('BOM')">Bom Products</li>
                <li v-bind:class="{ activeTab: tab === 'supplier' }" @click="changeTab('supplier')">Supplier Info</li>
                <li v-bind:class="{ activeTab: tab === 'attributes' }" @click="changeTab('attributes')">Attributes</li>
                <li v-bind:class="{ activeTab: tab === 'features' }" @click="changeTab('features')">Key Features</li>
                <li v-bind:class="{ activeTab: tab === 'sage-info' }" @click="changeTab('sage-info')">Sage Info</li>
                <li v-bind:class="{ activeTab: tab === 'google-profile' }" @click="changeTab('google-profile')">Google Shopping Profile</li>
                <li v-bind:class="{ activeTab: tab === 'configurable' }" v-show="stock_type === 'Configurable'" @click="changeTab('configurable')">Configuration</li>
            </ul>
        </div>
        <div class="main-sections__editForm__container">
            <inventory-details v-show="tab === 'details'" :view="view" :stockitem="stockitem"/>
            <bom-products v-show="tab === 'BOM'" :stockitem="stockitem" :type="view"/>
            <supplier-info v-show="tab === 'supplier'" :view="view" :stockitem="stockitem"/>
            <attributes-main v-show="tab === 'attributes'" :view="view" :stockitem="stockitem"/>
            <stock-key-features v-show="tab === 'features'" :view="view" :stockitem="stockitem"/>
            <google-profile v-show="tab === 'google-profile'" :view="view" :stockitem="stockitem"/>
            <sage-info v-show="tab === 'sage-info'" :view="view" :stockitem="stockitem"/>
            <configurable-product v-show="tab === 'configurable'" :stockitem="stockitem" :stockid="stockid"></configurable-product>
        </div>
    </div>
</template>

<script>
    import {event} from '@/services';
    import InventoryDetails from '@/components/inventory/InventoryItems/InventoryDetails';
    import BomProducts from '@/components/inventory/InventoryItems/BomProducts';
    import ConfigurableProduct from '@/components/inventory/InventoryItems/ConfigurableProduct';
    import StockKeyFeatures from '@/components/inventory/InventoryItems/StockKeyFeatures';
    import SupplierInfo from '@/components/inventory/Suppliers/SupplierInfoMain';
    import AttributesMain from "@/components/inventory/Attributes/AttributesMain";
    import SageInfo from '@/components/inventory/SageInfo/SageInfoDetails';
    import GoogleProfile from "@/components/inventory/GoogleProfiles/GoogleProfileDetails";


    export default {

        components: {AttributesMain, InventoryDetails, BomProducts, SupplierInfo, StockKeyFeatures, GoogleProfile, SageInfo, ConfigurableProduct},

        props:['view' ,'stockitem'],

        data:function() {
            return {
                tab:'details',
                productType: 'standard',
                stock_type: null,
                configurable: [],
                stockid:null
            }
        },

        watch:{
            stockitem(){
                if(this.stockitem.attributes) {
                    this.stock_type = this.stockitem.attributes.stock_type;
                    if(this.stockitem.type === 'InventoryView') {
                        this.productType = this.stockitem.attributes.stock_type;
                    }
                    this.stockid = this.stockitem.attributes.stock_id
                }
            },

            view(){
                this.tab = 'details';
                if(this.view === 'create-stock'){
                    this.productType = 'standard';
                }
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