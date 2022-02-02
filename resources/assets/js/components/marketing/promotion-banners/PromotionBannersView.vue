<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Promotion Banners</span>
        </page-header>

        <div class="main-sections__content">

            <div v-show="subview ==='view-all-promotion-banners'">
                <a href="#!/marketing/promotion-banners/create">
                    <button class="btn btn-app btn-primary btn-lg">Create a new Promotion Banner</button>
                </a>
            </div>
             <promotion-banner-list :tableData="state" v-show="subview === 'view-all-promotion-banners'"/>
             <promotion-banner-details v-show="subview === 'edit-promotion-banner' || subview === 'create-promotion-banner'" :banner="banner[0]" :view="subview"/>
          
        </div>
    </section>
</template>

<script>
    import {promotionBannerStore} from '@/stores';
    import PageHeader from '@/components/shared/PageHeader';
    import PromotionBannerList from '@/components/marketing/promotion-banners/PromotionBannerList';
    import PromotionBannerDetails from '@/components/marketing/promotion-banners/PromotionBannerDetails';

    export default {
        components: {PageHeader, PromotionBannerList, PromotionBannerDetails},

        props:['subview', 'banner'],

        data() {
            return {
                state: promotionBannerStore.state
            }
        },
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>