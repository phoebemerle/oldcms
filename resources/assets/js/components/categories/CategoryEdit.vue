<template>
    <div class="details-form">
        <div class="details-form__body" >
            <div>
                <h2>Category Details</h2>
            </div>
            <div id="categoryTitleContainer">
                <label for="categoryTitle">Category Title: </label>
                <input id="categoryTitle" v-model="categoryData.title" type="text" title="Category Title" data-vv-as="Title" name="categoryTitle" v-validate="'required'" placeholder="Please Enter a Category Title" required>
            </div>
            <div id="categorynumberContainer">
                <label for="categoryNumber">Category Number: </label>
                <input id="categoryNumber" v-model="categoryData.title" type="text" title="Category Title" data-vv-as="Title" name="categoryTitle" v-validate="'required'" placeholder="Please Enter a Category Title" required>
            </div>
            <span class="error-message" v-for="error in errors.collect('categoryTitle')" :key="error+'a'">{{error}}</span>
            <div id="categoryActiveStatus">
                <label for="categoryActive">Live Publish?</label>
                <input id="categoryActive" v-model="categoryData.active" type="checkbox">
            </div>
            <div id="categoryTestStatus">
                <label for="categoryTestActive">Test Publish?</label>
                <input id="categoryTestActive" v-model="categoryData.test_publish" type="checkbox">
            </div>
            <div id="categoryFeatureStatus">
                <label for="categoryFeatureActive">Feature On Home Page</label>
                <input id="categoryFeatureActive" v-model="categoryData.featured" type="checkbox">
            </div>
            <div id="categoryTopNavigationStatus">
                <label for="categoryTopNavigationStatus">Shown on Home Page Navigation?</label>
                <input id="categoryTopNavigationStatus" v-model="categoryData.top_nav" type="checkbox">
            </div>
            <div>
                <label for="catPageSupplier">Supplier</label>
                <select id="catPageSupplier" v-model="categoryData.supplier_id">
                    <option value="-1">Please Select</option>
                    <option v-for="(supplier, s) in suppliers" :value="supplier.id" :key="s">{{supplier.attributes.name}}</option>
                </select>
            </div>
            <div id="categoryAttachments">
                <label for="categoryAttachmentDropDown">What will this Category Contain?</label>
                <select required v-model="categoryData.attached_type" id="categoryAttachmentDropDown">
                    <option value="category">Categories</option>
                    <option value="product">Products</option>
                </select>
            </div>
            <div>
                <label for="catDescArea">Long Description</label>
                <tinymce :id="'catDescArea'" v-model="categoryData.long_desc" data-vv-as="Long Description" name="categoryData" v-validate="'required'"></tinymce>
            </div>
            <span class="error-message" v-for="error in errors.collect('categoryData')" :key="error+'b'">{{error}}</span>
            <div>
                <label for="catPageDescArea">Page Description</label>
                <tinymce :id="'catPageDescArea'" v-model="categoryData.page_desc" name="catPageDescArea" data-vv-as="Page Description" v-validate="'required'"></tinymce>
            </div>
            <span class="error-message" v-for="error in errors.collect('catPageDescArea')" :key="error+'c'">{{error}}</span>
        </div>
        <div class="details-form__cta">
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="updateCategory()">{{buttonTitle}}</button>
        </div>
        <children-model ref="childModal"/>
    </div>
</template>

<script>
    import {categoryStore} from '@/stores';
    import {event} from '@/services';
    import childrenModel from '@/components/modals/removeAllChildrenModal';
    import {supplierStore} from "@/stores";
    import { EventBus } from '@/components/categories/CategoriesMain';
    import {productStore} from '@/stores';
    import axios from "axios";

    export default {
        name: "CategoryEdit",

        components:{childrenModel},

        props:['view', 'category', 'attachedchildren', 'tab'],

        data(){
            return{
                categoryData: {
                    'title': '',
                    'attached_type':'category',
                    'active':false,
                    'long_desc':'',
                    'page_desc':'',
                    'supplier_id':'-1',
                    'test_publish':0,
                    'featured': 0,
                    'top_nav': 0,
                    'CategoryNo':'',
                    'meta_info':{
                        'description':'',
                        'keywords':'',
                        'title':''
                    }
                },
                buttonTitle:'',
                suppliers:supplierStore.state.suppliers
            }
        },

        watch:{
            tab() {
                this.$validator.reset();
            },

            category(){
                if(this.view.includes('category')){
                    this.setSuppliers()
                }

                if(this.view === 'edit-category') {
                    this.setData();
                    this.setSuppliers()
                    this.buttonTitle = 'Update'
                }
                this.$validator.reset();
            },

            view(){
                if(this.view === 'create-category'){
                    this.buttonTitle = 'Create';
                    this.categoryData = {
                        'title':'',
                        'attached_type':'category',
                        'active':false,
                        'long_desc':'',
                        'page_desc':'',
                        'supplier_id':'-1',
                        'test_publish':0,
                        'featured': 0,
                        'top_nav': 0,
                        'CategoryNo':'',
                        'meta_info':{
                            'description':'',
                            'keywords':'',
                            'title':''
                        }
                    }
                }
                this.$validator.reset();
            }
        },

        mounted(){
            event.on(event.names.UPDATE_CATEGORY_INFORMATION, (metaInfo) =>{
                this.categoryData.meta_info.description = metaInfo.description;
                this.categoryData.meta_info.keywords = metaInfo.keywords;
                this.categoryData.meta_info.title = metaInfo.title;

                this.updateCategory();
            });
            this.errors.clear(); 
        },

		// computed: {
		// 	getSearchURL: function () {
		// 		return  axios.get("/get_search_url_staging").then((res) => {
		// 			return res.data;
		// 		});
		// 	}
		// },

        methods:{
            setData(){
                if(this.category) {
                    this.categoryData.title = this.category.attributes.title;
                    this.categoryData.active = this.category.attributes.active;
                    this.categoryData.attached_type = this.category.attributes.attached_type;
                    this.categoryData.long_desc = this.category.attributes.long_desc || '';
                    this.categoryData.page_desc = this.category.attributes.page_desc || '';
                    this.categoryData.supplier_id = this.category.attributes.supplier_id;
                    this.categoryData.test_publish = this.category.attributes.test_publish;
                    this.categoryData.meta_info.description = this.category.attributes.meta_info.description;
                    this.categoryData.meta_info.keywords = this.category.attributes.meta_info.keywords;
                    this.categoryData.meta_info.title = this.category.attributes.meta_info.title;
                    this.categoryData.featured = this.category.attributes.featured;
                    this.categoryData.CategoryNo = this.category.attributes.CategoryNo;
                }
            },

            async setSuppliers(){
                this.suppliers = await supplierStore.checkLoading();
            },

            async updateCategory() {

                await this.$validator.validateAll();
               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }

                if(this.categoryData.meta_info.title === ''){
                    this.categoryData.meta_info.title = this.categoryData.title + ' | Comms Express'
                }

                if(this.categoryData.meta_info.description === ''){
                    this.categoryData.meta_info.description = 'Explore the range of '+ this.categoryData.title+' available from Comms Express. Visit our online store today and shop for your IT network supplies to assist your needs.'
                }

                let data = {
                    'data': {
                        'type': 'categories',
                        'attributes':{
                            'title':this.categoryData.title,
                            'attached_type':this.categoryData.attached_type,
                            'active':this.categoryData.active,
                            'long_desc':this.categoryData.long_desc,
                            'page_desc':this.categoryData.page_desc,
                            'supplier_id':this.categoryData.supplier_id,
                            'meta_description':this.categoryData.meta_info.description,
                            'meta_keywords':this.categoryData.meta_info.keywords,
                            'meta_title':this.categoryData.meta_info.title,
                            'test_publish':this.categoryData.test_publish,
                            'featured':this.categoryData.featured,
                            'top_nav':this.categoryData.top_nav,
                            'CategoryNo':this.categoryData.CategoryNo
                        }
                    }
                };
                

                if (this.view === 'edit-category') {

                    data.data.id = this.category.id;
                    
                    this.categoryContainsTab();

                    if(this.categoryData.attached_type != this.category.attributes.attached_type){
                        this.$refs.childModal.openChildrenModal(this.category.id, data, this.category);
                        
                    }else{
                        try {
                            await categoryStore.update(data, this.category);
                            
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
                else if(this.view === 'create-category'){
                    try {
                        data.data.attributes.overwrite_meta_title = 0;
                        data.data.attributes.overwrite_meta_description = 0;

                        await categoryStore.create(data);

                    } catch (error) {
                        event.emit(event.names.USER_MESSAGE, 'There was a problem creating this category. Please make sure all boxes are filled in', 'error');
                        console.log(error);
                    }
                }

                // Update Category For ES Index
                // if (this.category.id !== undefined) {
				// 	this.searchUpdate(this.category.id);
				// }
            },

            
            

            categoryContainsTab(){
                if(this.category) {
                        if(this.categoryData.attached_type === 'category')
                        {
                            this.attachedType = "Categories"

                            EventBus.$emit('Categories', this.attachedType);
                        }

                        else if(this.categoryData.attached_type === 'product'){

                            this.attachedType = "Products"

                             EventBus.$emit('Categories', this.attachedType);

                        }
                }
            },
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>