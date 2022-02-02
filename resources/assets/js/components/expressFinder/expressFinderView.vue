<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Express Finders</span>
        </page-header>

        <div class="main-sections__content">
            <express-finder-list v-if="subview === 'finder-list'" :finders="finders"></express-finder-list>
            <express-finder-create v-if="subview === 'finder-create'"></express-finder-create>
            <express-finder-edit v-if="subview === 'edit-express-finder'" :subview="subview" :finder="finders"></express-finder-edit>
        </div>
    </section>
</template>

<script>
    import ExpressFinderList from "./expressFinderList";
    import PageHeader from '@/components/shared/PageHeader';
    import ExpressFinderCreate from "./expressFinderCreate";
    import ExpressFinderEdit from "./expressFinderEdit";

    export default {
        name: "expressFinderView",

        components: {ExpressFinderEdit, ExpressFinderCreate, ExpressFinderList, PageHeader},

        props:['subview', 'finders'],

    }
</script>

<style scoped>

</style>