<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Predefined Attributes</span>
        </page-header>
        <div class="main-sections__content">
            <predefined-attributes-list :tableData="state" v-show="subview === 'view-all-predefined-attributes'"></predefined-attributes-list>
            <predefined-attribute-details :attribute="attribute[0]" :subview="subview" v-show="subview === 'edit-predefined-attributes' || subview === 'create-predefined-attributes'"></predefined-attribute-details>
        </div>
    </section>
</template>

<script>
    import PageHeader from '@/components/shared/PageHeader';
    import PredefinedAttributesList from '@/components/PredefinedAttribute/PredefinedAttributeList';
    import PredefinedAttributeDetails from '@/components/PredefinedAttribute/PredefinedAttributeDetails';
    import {attributeTypeStore} from '@/stores'

    export default {
        components: {
            PageHeader, 
            PredefinedAttributesList,
            PredefinedAttributeDetails
            },

        props: [
            'attribute',
            'subview'
        ],


        data() {
            return {
                state: attributeTypeStore.state,
            }
        },

         watch: {

        },

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>