<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Email Templates</span>
        </page-header>     
        <div class="main-sections__content">
            <templates-list v-if="view === 'view-all-templates'"></templates-list>
            <template-edit v-show="view === 'template-edit' || view === 'template-create'" :template="template[0]" :view="subview" />
        </div>
    </section>
</template>

<script>
    import PageHeader from '@/components/shared/PageHeader';
    import TemplatesList from '@/components/Templates/TemplatesList';
    import TemplateEdit from '@/components/Templates/TemplateEdit';



    export default {
        name: "BrandsView",

        components: {PageHeader, TemplatesList, TemplateEdit},

        props:['subview', 'template'],

        data(){
            return{
                view:this.subview,
            }
        },
        watch:{
            subview(){
                this.view = this.subview;
            }
        },

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>