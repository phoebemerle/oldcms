<template>
    <div class="main-sections__editForm">
        <div v-show="subview === 'edit-category'" class="overviewTabs">
            <ul class="list-inline">
                <li v-bind:class="{ activeTab: tab === 'categoryDetails' }" @click="changeTab('categoryDetails')">Category Info</li>
                <li v-bind:class="{ activeTab: tab === 'metaInfo' }" @click="changeTab('metaInfo')">Meta Information</li>
                <li v-bind:class="{ activeTab: tab === 'categoryImages' }" @click="changeTab('categoryImages')">Category Images</li>
                <li v-bind:class="{ activeTab: tab === 'attached' }" @click="changeTab('attached')" class="">Assigned {{attachedType}}</li>
                <li v-bind:class="{ activeTab: tab === 'otherRanges' }" @click="changeTab('otherRanges')" class="">Other Ranges Available</li>
            </ul>
        </div>
        <div class="main-sections__editForm__container">
            <category-edit v-show="tab === 'categoryDetails'" :category="category" :tab="tab" :view="subview" :attachedchildren="attachedChildren"/>
            <category-meta-info v-show="tab === 'metaInfo'" :metaInfo="metaInfo" :tab="tab"/>
            <attached-objects v-show="tab === 'attached'" :category="category" :childtype="attachedType" :attachedchildren="attachedChildren"/>
            <category-image v-show="tab === 'categoryImages'" :category="category" :tab="tab"/>
            <other-ranges v-show="tab === 'otherRanges'" :category="category" :tab="tab" :range="otherRanges"/>
        </div>
    </div>
</template>

<script>
    import CategoryEdit from '@/components/categories/CategoryEdit';
    import AttachedObjects from '@/components/categories/products/AttachedObjects';
    import CategoryImage from '@/components/categories/CategoryImage';
    import CategoryMetaInfo from '@/components/categories/CategoryMetaInfo';
    import OtherRanges from '@/components/categories/OtherRanges';
    import {categoryStore} from '@/stores';
    import {productStore} from '@/stores';
    import Vue from 'vue';
    export const EventBus = new Vue();

    export default {

        components: {CategoryEdit, AttachedObjects, CategoryImage, CategoryMetaInfo, OtherRanges},

        name: "CategoriesMain",

        props:['subview', 'category'],

        data(){
            return{
                tab:'categoryDetails',
                attachedChildren:[],
                otherRanges: [],
                attachedType:'',
                metaInfo:{
                    'description':"",
                    'keywords':"",
                    'title':""
                }
            }
        },

        watch:{
            subview(){
                categoryStore.state.search = categoryStore.state.categories
                this.tab = 'categoryDetails';
            },

            async category(){
                this.attachedChildren = [];
                if(this.category) {
                    if (this.category.type === 'categories') {
                        this.metaInfo = this.category.attributes.meta_info;

                        if(this.category.attributes.attached_type === 'category'){
                            this.attachedType = 'Categories';
                        }
                        else if(this.category.attributes.attached_type === 'product') {
                            this.attachedType = 'Products';
                        }

                        if(this.category.attributes.children.length > 0){
                            this.getChildren();
                        }

                        if(this.category.attributes.otherranges.length > 0){
                            this.getOtherRanges();
                        }
                    }
                }
            }
        },

        mounted() {
            EventBus.$on('Categories', (attachedType) => {
                this.attachedType = attachedType;
                this.attachedChildren = [];
            })
            
        },

        methods:{
            changeTab(tab){
                this.tab = tab;
            },

            async getChildren(){
                try{
                    for(let i = 0; i < this.category.attributes.children.length; i++) {
                        let data = {
                            attributes: this.category.attributes.children[i],
                            id: this.category.attributes.children[i].id
                        }
                        this.attachedChildren.push(data)
                    }

                }catch(error){
                    console.log(error);
                }
            },

            async getOtherRanges(){
                    for(let i = 0; i < this.category.attributes.otherranges.length; i++) {
                        this.otherRanges.push(await categoryStore.categoryByID(this.category.attributes.otherranges[i].other_range_id));
                    }

                    for(let x = 0; x < this.otherRanges.length; x++){
                        let ranges = this.findRangeOrder(this.otherRanges[x].id);
                        this.otherRanges[x].order = ranges.order;
                    }
            },

            findRangeOrder(id){
                for(let i = 0; i < this.category.attributes.otherranges.length; i++){
                    if(id.toString() === this.category.attributes.otherranges[i].other_range_id.toString()){
                        return this.category.attributes.otherranges[i];
                    }
                }
            },
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>