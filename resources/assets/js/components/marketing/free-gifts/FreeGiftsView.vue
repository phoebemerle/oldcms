<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Free Gifts</span>
        </page-header>

        <div class="main-sections__content">

            <div v-show="subview ==='view-all-freegifts'">
                <a href="#!/marketing/free-gifts/create">
                    <button class="btn btn-app btn-primary btn-lg">Create a new Free Gift</button>
                </a>
            </div>
            <free-gifts-details v-show="subview === 'edit-freegifts' || subview === 'create-freegifts'" :freeGift="freeGift" :view="subview"/>
            <free-gifts-list :tableData="state" v-show="subview === 'view-all-freegifts'"/>
        </div>
    </section>
</template>

<script>
    import {freeGiftStore} from '@/stores';
    import PageHeader from '@/components/shared/PageHeader';
    import FreeGiftsList from '@/components/marketing/free-gifts/FreeGiftsList';
    import FreeGiftsDetails from '@/components/marketing/free-gifts/FreeGiftsDetails';

    export default {
        components: {FreeGiftsList, PageHeader, FreeGiftsDetails},

        props:['subview', 'freegifts', 'freeGift'],

        data() {
            return {
                state: freeGiftStore.state
            }
        },
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>