<template>
    <div id="featuredCategoryContainer">
        <div class="attached_container" id="featuredCategorySection">
            <table  class="table table-hover attachedTable featuredCategory">
                <tr>
                    <th class="featuredCategory__title">Title</th>
                    <th class="featuredCategory__view"><span>View</span></th>
                    <th class="featuredCategory__remove"><span>Remove</span></th>
                </tr>
                <tr v-if="categories.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No Featured Categories Selected</span>
                    </td>
                </tr>
                <draggable @change="setNewFeatureOrder()" v-model="categories">
                    <tr v-show="categories.length > 0" v-for="(featured, key) in categories" :key="key">
                        <td class="featuredCategory__title">{{featured.attributes.title}}</td>
                        <a :href="'/#!/categories/edit/'+featured.id">
                            <td class="featuredCategory__view attachedTableView"><i class="fas fa-eye"></i></td>
                        </a>
                        <td class="featuredCategory__remove attachedTableRemove" @click="removeAttached(key)"><i class="fas fa-trash"></i></td>
                    </tr>
                </draggable>
            </table>
            <button class="btn btn-primary" @click="saveNewOrder()">Update Order</button>
        </div>
        <category-search type="featuredCategories" :category="categories"/>
    </div>
</template>

<script>
    import draggable from 'vuedraggable';
    import {http} from '@/services';
    import {homePageStore} from '@/stores';
    import {event} from '@/services';
    import CategorySearch from '@/components/categories/CategorySearch';
    import {categoryStore} from "@/stores";

    export default {
        name: "featuredCategories",

        components: {CategorySearch, draggable},

        props:['featuredCategories'],

        data(){
            return{
                categories:[],
                changedCategories:[]
            }
        },

        watch:{
            featuredCategories() {
                this.categories = this.featuredCategories;
            }
        },

        mounted(){
            event.on(event.names.UPDATE_FEATURED_CATEGORIES, (selected) =>{
                if(this.categories.length < 16) {
                    let check = this.checkCategories(selected);
                    if (!check) {
                        selected.attributes.featured = 1;
                        selected.attributes.featured_order = this.categories.length + 1;

                        let data = http.createData(selected);

                        this.addNewFeaturedCat(data);
                    }else{
                        event.emit(event.names.USER_MESSAGE, 'Category could not be added because it is already a featured category', 'error');
                    }
                }
                else {
                    event.emit(event.names.USER_MESSAGE, 'Category could not be added because maximum categories already assigned', 'error');
                }
            });
        },

        methods:{
            async addNewFeaturedCat(data){
                this.categories.push(await categoryStore.updateFeatured(data.data.id, data));

                event.emit(event.names.USER_MESSAGE, 'Category was added successfully', 'success');
            },

            async removeAttached(key){
                this.categories[key].attributes.featured = 0;
                this.categories[key].attributes.featured_order = null;

                let data = http.createData(this.categories[key]);

                await categoryStore.updateFeatured(data.data.id, data);

                this.categories.splice(key,1);

                event.emit(event.names.USER_MESSAGE, 'Category was removed successfully', 'success');
            },

            setNewFeatureOrder(){
                for(let y = 0; y < this.categories.length; y++){
                    let oldOrder = this.categories[y].attributes.featured_order;
                    let newOrder = y+1;
                    this.categories[y].attributes.featured_order = newOrder;

                    if (oldOrder !== newOrder) {
                        this.addToChangedArray(this.categories[y]);
                    }

                }
            },

            addToChangedArray(category){
                let count = null;
                if(this.changedCategories.length > 0) {
                    for (let y = 0; y < this.changedCategories.length; y++) {
                        if(this.changedCategories[y].id === category.id){
                            count = y;
                        }
                    }
                }

                if(count != null){
                    this.changedCategories.splice(count, 1);
                }

                this.changedCategories.push(category);
            },

            async saveNewOrder(){
                for(let x = 0; x < this.changedCategories.length; x++){
                    let data = http.createData(this.changedCategories[x]);
                    await categoryStore.update(data.data.id, data);
                }

                this.changedCategories = [];
            },

            checkCategories(selected){
                let found = null;
                for(let x=0; x < this.categories.length; x++){
                    if(this.categories[x].id === selected.id){
                        found = 1;
                        break;
                    }
                }

                return found;
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    .featuredCategory{

        &__title{
            width:50%;
        }
        &__view{
            text-align: center;
            width:20%;
        }
        &__remove{
            text-align: center;
            width:20%;
        }

    }

</style>