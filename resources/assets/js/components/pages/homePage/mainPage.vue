<template>
    <div class="main-sections__editForm">
        <page-header>
            <span slot="title">Home Page Content</span>
        </page-header>
        <div class="main-sections__content">
            <div class="overviewTabs">
                <ul class="list-inline">
                    <li v-bind:class="{ activeTab: tab === 'homeText'}" @click="changeTab('homeText')">Home Page Text</li>
                    <li v-bind:class="{ activeTab: tab === 'mainBanner'}" @click="changeTab('mainBanner')">Main Banner</li>
                    <li v-bind:class="{ activeTab: tab === 'homeBanners'}" @click="changeTab('homeBanners')">Home Page Banners</li>
                    <li v-bind:class="{ activeTab: tab === 'featuredBrands'}" @click="changeTab('featuredBrands')">Featured Brands</li>
                    <li v-bind:class="{ activeTab: tab === 'featuredCategories'}" @click="changeTab('featuredCategories')" class="">Featured Categories</li>
                    <li v-bind:class="{ activeTab: tab === 'navigationOrder'}" @click="changeTab('navigationOrder')" class="">Navigation Order</li>
                </ul>
            </div>
            <div class="main-sections__editForm__container">
                <edit-home-text :content="content[0]" v-show="tab === 'homeText'"></edit-home-text>
                <main-banner :mainBanners="mainBanners" v-show="tab === 'mainBanner'"></main-banner>
                <home-page-banners :content="content[0]" v-show="tab === 'homeBanners'"></home-page-banners>
                <featured-brands :content="content[0]" v-show="tab === 'featuredBrands'" :featuredBrands="featuredBrands"></featured-brands>
                <featured-categories :content="content[0]" v-show="tab === 'featuredCategories'" :featuredCategories="featuredCategories"></featured-categories>
                <navigation-order :content="content[0]" v-show="tab === 'navigationOrder'" :navigationOrder="navigationOrder"></navigation-order>
            </div>
        </div>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {brandsStore} from '@/stores';
    import PageHeader from '@/components/shared/PageHeader';
    import editHomeText from '@/components/pages/homePage/editHomeText';
    import mainBanner from '@/components/pages/homePage/mainBanner';
    import homePageBanners from '@/components/pages/homePage/homePageBanners';
    import featuredBrands from '@/components/pages/homePage/featuredBrands';
    import featuredCategories from '@/components/pages/homePage/featuredCategories';
    import navigationOrder from '@/components/pages/homePage/navigationOrder';
    import {categoryStore} from "@/stores";
    import {mainBannerStore} from '@/stores';
    import {imageStore} from '@/stores';
    import {cdnStore} from '@/stores';

    export default {
        name: "mainPage",

        components:{editHomeText, PageHeader, homePageBanners, mainBanner, featuredBrands, featuredCategories, navigationOrder},

        props:['content'],

        watch:{
            content(){
                if(this.content[0] != null) {
                    if (this.content[0].type === 'home-page-contents') {
                        this.getFeaturedBrands();
                        this.getFeaturedCategories();
                        this.getNavigationOrder();
                        this.getMainBanner();
                    }
                }
            }
        },

        data(){
            return{
                tab:'homeText',
                featuredBrands:[],
                featuredCategories:[],
                navigationOrder: [],
                mainBanners: [],
            }
        },

        methods:{
            changeTab(tab){
                this.tab = tab;
            },

            async getFeaturedBrands(){
                this.featuredBrands = await brandsStore.findFeaturedBrands();
            },

            async getFeaturedCategories(){
                this.featuredCategories = await categoryStore.findFeaturedCategories();
            },

            async getNavigationOrder(){
                this.navigationOrder = await categoryStore.findNavigationOrder();
            },

            async getMainBanner(){
                this.mainBanners = await mainBannerStore.state.mainbanner;

                 for (let p = 0; p < this.mainBanners.length; p++){

                let tempFSub = await imageStore.loadImages(this.mainBanners[p].attributes.image_id, 'banners');

                let cdnImage = null;

                if(tempFSub.attributes.source === 'CDN') {
                    cdnImage = await this.getCdnImage(tempFSub.attributes.source_id);
                }

                this.mainBanners[p].attributes.url = cdnImage.data[0].attributes.url;

                }
            },

             async getCdnImage(id){
                return await cdnStore.checkCDN(id);
            },

        },
    }
</script>

<style lang="scss">
    @import "~#/variables";

    .details-form__body{

        label {
            min-width: 15%;
        }

        input, textarea{
           width: 70%;
        }

        textarea{
            min-height:120px;
        }
    }


</style>