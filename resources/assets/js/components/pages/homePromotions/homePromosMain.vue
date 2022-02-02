<template>
    <section>
        <page-header>
            <span slot="title">Home Page Promotions</span>
        </page-header>
        <div class="main-sections__content">
             <div class="overviewTabs">
                    <ul style="margin-bottom:0;">
                        <li id="selectedTab1" value="1" v-bind:class="{ activeTab: tab === 1 }" @click="changeTab(1)">Promo 1</li>
                        <li id="selectedTab2" value="2" v-bind:class="{ activeTab: tab === 2 }" @click="changeTab(2)">Promo 2</li>
                        <li id="selectedTab3" value="3" v-bind:class="{ activeTab: tab === 3 }" @click="changeTab(3)">Promo 3</li>
                        <li id="selectedTab4" value="4" v-bind:class="{ activeTab: tab === 4 }" @click="changeTab(4)">Promo 4</li>
                    </ul>
                     <div class="main-sections__editForm__container">
                         <home-promos-details :promoInfo="promoInfo" :tab="tab" :subview="subview"></home-promos-details>
                     </div>
                </div>
        </div>
    </section>
</template>

<script>
import homePromosDetails from './homePromosDetails';
import PageHeader from '@/components/shared/PageHeader'
import {homePromosStore} from '@/stores';
export default {

    props: ['subview'],

    components: {
        homePromosDetails,
        PageHeader
    },

    data() {
        return {
            tab: 1,
            promoInfo: null,
            promos: [],
        }
    },
    watch: {
        tab() {
            this.promoTitle = this.promoInfo.attributes.title;
            this.promoDescription = this.promoInfo.attributes.description;
            this.promoLink = this.promoInfo.attributes.link;
            this.buttonText = this.promoInfo.attributes.button_text;
            this.promos = homePromosStore.state;
        }
    },

    async created() {
        this.promos = homePromosStore.state;
        this.promoInfo = homePromosStore.state.promos[0];

    },

    methods: {
        changeTab(active) {
            this.tab = active;
            this.promoInfo = homePromosStore.promoByID(active)
        },
    }
}
</script>

<style>

</style>
