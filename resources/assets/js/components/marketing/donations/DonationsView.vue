<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Donations</span>
        </page-header>

        <div class="main-sections__content">

            <div v-show="subview ==='view-all-donations'">
                <a href="#!/marketing/donations/create">
                    <button class="btn btn-app btn-primary btn-lg">Create a new Donation</button>
                </a>
            </div>
            <donation-details v-show="subview === 'edit-donation' || subview === 'create-donation'" :donation="donation" :view="subview"/>
            <donations-list v-show="subview === 'view-all-donations'" :tableData="state"/>
        </div>
    </section>
</template>

<script>
    import {donationStore} from '@/stores';
    import PageHeader from '@/components/shared/PageHeader';
    import DonationsList from '@/components/marketing/donations/DonationsList';
    import DonationDetails from '@/components/marketing/donations/DonationDetails';

    export default {
        components: {DonationsList, PageHeader, DonationDetails},

        props:['subview', 'donation'],

        data() {
            return {
                state: donationStore.state
            }
        },
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>