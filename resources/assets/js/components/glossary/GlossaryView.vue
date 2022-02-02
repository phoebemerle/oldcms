<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Glossary Terms</span>
        </page-header>
        <div class="main-sections__content">
            <glossary-list v-show="subview ==='list-terms'" :terms="terms[0]"/>
            <glossary-definition-edit v-show="subview ==='edit-glossary-definitions'" :definition="terms[0]"/>
        </div>
    </section>
</template>

<script>
    import GlossaryList from '@/components/glossary/glossaryList';
    import GlossaryDefinitionEdit from '@/components/glossary/GlossaryDefinitionEdit';
    import PageHeader from '@/components/shared/PageHeader';

    export default {

        props:['subview', 'terms'],

        components: {GlossaryList,PageHeader, GlossaryDefinitionEdit},
    }
</script>

<style scoped>

</style>