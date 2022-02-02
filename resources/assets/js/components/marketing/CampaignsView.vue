<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Marketing Campaigns</span>
        </page-header>
        <div class="main-sections__content">
            <campaign-list :item="state" v-show="view === 'view-all-campaigns'" :page="pagenum"></campaign-list>
            <campaign-main v-show="view === 'edit-campaign' || view === 'create-campaign'" :campaign="campaign" :view="view"/>
            <promotion-main v-show="view === 'promotion-targets'" :promotion="campaign"></promotion-main>
        </div>
    </section>
</template>

<script>
    import {event} from '@/services';
    import PageHeader from '@/components/shared/PageHeader';
    import CampaignList from '@/components/marketing/campaigns/campaignList';
    import CampaignMain from '@/components/marketing/campaigns/campaignMain';
    import PromotionMain from '@/components/marketing/promotion/promotionMain';
    import {campaignStore} from '@/stores';

    export default {
        name: "MarketingView",

        components: {PageHeader, CampaignList, CampaignMain, PromotionMain},

        props:['subview', 'campaign', 'pagenum'],

        data(){
            return{
                view:this.subview,
                state: campaignStore.state
            }
        },

        created()
        {
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