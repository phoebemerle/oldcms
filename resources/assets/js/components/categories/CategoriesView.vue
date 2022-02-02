<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Categories</span>
        </page-header>
        <div class="main-sections__content">
            <category-home v-show="subview ==='categories-dashboard'"/>
            <category-list v-show="subview ==='view-all-categories'" :item="item" :page="pagenum" :view="subview"/>
            <category-main v-show="subview ==='edit-category' || subview ==='create-category'" :category="item" :subview="subview"/>
        </div>
    </section>
</template>

<script>
    import {event} from '@/services';
    import PageHeader from '@/components/shared/PageHeader';
    import CategoryHome from '@/components/categories/CategoryHome';
    import CategoryList from '@/components/categories/CategoryList';
    import CategoryMain from '@/components/categories/CategoriesMain';

    export default {
        components: {PageHeader, CategoryHome, CategoryList, CategoryMain},

        props:['subview' , 'item', 'pagenum'],

        data:function() {
            return {
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