<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Footer Information</span>
        </page-header>
        <div class="main-sections__content">
            <footer-main v-show="subview ==='edit-footer'" :subview="subview" :footerinfo="footerinfo"/>
        </div>
    </section>
</template>

<script>
    import {event} from '@/services';
    import PageHeader from '@/components/shared/PageHeader';
    import FooterMain from '@/components/footer/FooterMain';


    export default {
        components: {PageHeader, FooterMain},

        props:['subview', 'footerinfo'],

        data(){
            return{
                view:this.subview
            }
        },

        watch:{
            subview(){
                this.view = this.subview;
            },
        },

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>