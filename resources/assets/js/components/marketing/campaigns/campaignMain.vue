<template>
    <div class="main-sections__editForm">
        <div v-show="view === 'edit-campaign'" class="overviewTabs">
            <ul class="list-inline" style="margin-bottom:0;">
                <li v-bind:class="{ activeTab: tab === 'details' }" @click="changeTab('details')">Campaign Info</li>
                <li v-bind:class="{ activeTab: tab === 'promotions' }" @click="changeTab('promotions')">Promotions</li>
            </ul>
        </div>
        <div class="main-sections__editForm__container">
            <campaign-details v-show="tab === 'details'" :campaign="campaign" :view="view"/>
            <promotion-main v-show="tab === 'promotions'" :promotions="promotions" :campaign="campaign"/>
        </div>
    </div>
</template>

<script>
    import CampaignDetails from '@/components/marketing/campaigns/campaignDetails';
    import PromotionMain from '@/components/marketing/campaigns/promotions/promotionMain';
    import {promotionsStore} from "@/stores";

    export default {

        components:{CampaignDetails, PromotionMain},

        props:['campaign', 'view'],

        data(){
            return{
                tab:'details',
                promotions:[]
            }
        },

        watch:{
            campaign() {
                this.promotions = [];
                this.tab = 'details';
                if (this.campaign != null) {
                    if (this.campaign.type === 'campaigns' && this.campaign.relationships.promotions.data.length >= 1) {
                        this.getPromotions();
                    }
                }
            }
        },

        methods:{
            changeTab(tab){
                this.tab = tab;
            },

            async getPromotions(){
                this.promotions = await promotionsStore.checkPromotions(this.campaign.id);

            },
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>