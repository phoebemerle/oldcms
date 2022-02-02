<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Customer Accounts</span>
        </page-header>
        <div class="main-sections__content">
            <customer-list v-show="view ==='account-list'"/>
            <customer-main v-show="view ==='edit-account'" :customer="item[0]" :subview="view"/>
        </div>
    </section>
</template>

<script>
    import CustomerList from '@/components/customers/customerList';
    import CustomerMain from '@/components/customers/CustomerMain';
    import PageHeader from '@/components/shared/PageHeader';

    export default {

        props:['view', 'item'],

        components: {CustomerList,CustomerMain,PageHeader},
    }
</script>

<style scoped>

</style>