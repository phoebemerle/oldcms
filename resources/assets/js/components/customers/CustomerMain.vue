<template>
    <div class="main-sections__editForm">
        <div v-show="subview === 'edit-account'" class="overviewTabs">
            <ul class="list-inline">
                <li v-bind:class="{ activeTab: tab === 'mainCustomerDetails' }" @click="changeTab('mainCustomerDetails')">Customer Info</li>
                <li v-bind:class="{ activeTab: tab === 'changePassword' }" @click="changeTab('changePassword')">Change Password</li>
                <li v-bind:class="{ activeTab: tab === 'savedAddresses' }" @click="changeTab('savedAddresses')">Saved Address</li>
                <li v-bind:class="{ activeTab: tab === 'additionalUsers' }" @click="changeTab('additionalUsers')">Additional Users</li>
                <li v-bind:class="{ activeTab: tab === 'marketingPref' }" @click="changeTab('marketingPref')">Marketing Preferences</li>
<!--                <li v-bind:class="{ activeTab: tab === 'dataPoints' }" @click="changeTab('dataPoints')">DataPoints</li>-->
<!--                <li v-bind:class="{ activeTab: tab === 'orders' }" @click="changeTab('orders')">Orders</li>-->
<!--                <li v-bind:class="{ activeTab: tab === 'CreditAccount' }" @click="changeTab('CreditAccount')">Credit Account Info</li>-->
            </ul>
        </div>
        <div class="main-sections__editForm__container">
            <customer-details v-show="tab === 'mainCustomerDetails'" :customer="customer" :tab="tab" :subview="subview"/>
            <customer-password v-show="tab === 'changePassword'" :customer="customer"/>
            <customer-addresses v-show="tab === 'savedAddresses'" :customer="customer"/>
            <customer-users v-show="tab === 'additionalUsers'" :customer="customer" :additional="additionalAccounts"/>
            <marketing  v-show="tab === 'marketingPref'" :customer="customer"/>
        </div>
    </div>
</template>

<script>
    import {event} from '@/services';
    import CustomerDetails from '@/components/customers/customerDetails';
    import CustomerPassword from '@/components/customers/customerPassword';
    import CustomerAddresses from '@/components/customers/customerAddresses';
    import CustomerUsers from '@/components/customers/customerUsers';
    import Marketing from '@/components/customers/marketingPreferences';
    import {customerStore} from '@/stores';
    import customerStub from '@/stubs/Customers';
    import {http} from "@/services";


    import Vue from 'vue';
    export const EventBus = new Vue();

    export default {

        components: {CustomerDetails, CustomerPassword, CustomerAddresses, CustomerUsers, Marketing},

        props:['subview', 'customer'],

        data(){
            return{
                tab:'mainCustomerDetails',
                additionalAccounts:[],
                primeCustomer: customerStub,
            }
        },

        watch:{
            subview(){
                this.tab = 'mainCustomerDetails';
            },


            customer(){
                if(this.customer) {
                    if (this.customer.type === 'customer-details') {
                        this.primeCustomer = this.customer;
                        this.getAdditionalAccounts();
                    }
                }
            }
        },

        mounted() {
            event.on(event.names.MOVE_TAB, (type, tab) => {
                if(type === 'Customers'){
                    this.tab = tab;
                }
            });
        },

        methods:{
            changeTab(tab){
                this.tab = tab;
            },

            async getAdditionalAccounts(){
                if ((this.customer.type === 'customer-details') && (this.customer.id)) {
                    this.additionalAccounts = await customerStore.checkAdditionalUsers(this.customer.attributes.AccountNumber, this.customer.id);
                }
            }

        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>