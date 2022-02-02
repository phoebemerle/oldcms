<template>
    <div class="main-sections__editForm">
        <div v-show="subview === 'view-all-fraud-types'" class="overviewTabs">
            <ul class="list-inline">
                <li v-bind:class="{ activeTab: tab === 'fraud-types' }" @click="changeTab('fraud-types')">Fraud Types</li>
                <li v-bind:class="{ activeTab: tab === 'fraud-info' }" @click="changeTab('fraud-info')" class="">Fraud Info</li>
            </ul>
        </div>
        <div class="main-sections__editForm__container">
        <fraud-types v-show="tab ==='fraud-types'" :fraudtypes="fraudTypes" :tab="tab"/> 
        <fraud-info v-show="tab ==='fraud-info'" :fraudtypes="fraudTypes" :tab="tab"/> 
        </div>
    </div>
</template> 

<script>
    import {event} from '@/services';
    import FraudTypes from '@/components/settings/fraudPrevention/FraudTypes';
    import FraudInfo from '@/components/settings/fraudPrevention/FraudInfo';
    import {fraudTypeStore} from '@/stores';
    import {fraudInfoStore} from '@/stores';

    export default {
        name: "FraudPreventionMain",

        components: {FraudTypes, FraudInfo},

        props:['subview'],

        data(){
            return{
                tab: 'fraud-types',
                fraudTypes: [],
                fraudInfo: [],
            }
        },

        watch:{

            async subview(){
                this.tab = 'fraud-types';
                
                if(this.subview === 'view-all-fraud-types'){
                    this.fraudTypes = fraudTypeStore.state.fraudtypes;
                }
            },

        },


        methods:{
            changeTab(tab){
                this.tab = tab;
            },
           
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>