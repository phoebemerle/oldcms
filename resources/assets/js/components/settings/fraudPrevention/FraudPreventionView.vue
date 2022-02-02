<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Fraud Prevention</span>
        </page-header>
        <div class="main-sections__content">
            <fraud-prevention-main v-show="subview === 'view-all-fraud-types'" :subview="subview" />
        </div>
    </section>
</template>

<script>
    import PageHeader from '@/components/shared/PageHeader';
    import FraudPreventionMain from '@/components/settings/fraudPrevention/FraudPreventionMain';
   

    export default {
        name: "FraudPreventionView",

        components: {
            PageHeader, FraudPreventionMain,
            },

        props:['subview'],

        data(){
            return{

            }
        },

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>