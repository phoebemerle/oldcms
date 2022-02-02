<template>
    <div id="navigationOrderContainer">
        <div class="attached_container" id="navigationOrderSection">
            <table  class="table table-hover attachedTable navigationOrder">
                <tr>
                    <th class="navigationOrder__title">Title</th>
                    <th class="navigationOrder__view"><span>View</span></th>
                    <th class="navigationOrder__remove"><span>Remove</span></th>
                </tr>
                <tr v-if="categories.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No Categories Found</span>
                    </td>
                </tr>
                <draggable @change="setNewNavigationOrder()" v-model="categories">
                    <tr v-show="categories.length > 0" v-for="(navigation, key) in categories" :key="key">
                        <td class="navigationOrder__title">{{navigation.attributes.title}}</td>
                        <a :href="'/#!/categories/edit/'+navigation.id">
                            <td class="navigationOrder__view attachedTableView"><i class="fas fa-eye"></i></td>
                        </a>
                         <td class="navigationOrder__remove attachedTableRemove" @click="removeAttached(key)"></td>
                    </tr>
                </draggable>
            </table>
            <button class="btn btn-primary" @click="saveNewOrder()">Update Order</button>
        </div>
         <category-search type="navigationOrder" :category="categories"/>
    </div>
</template>

<script>
    import draggable from 'vuedraggable';
    import {http} from '@/services';
    import {homePageStore} from '@/stores';
    import {event} from '@/services';
    import {categoryStore} from "@/stores";
    import CategorySearch from '@/components/categories/CategorySearch';

    export default {
        name: "navigationOrder",

        components: {draggable, CategorySearch},

        props:['navigationOrder'],

        data(){
            return{
                categories:[],
                changedCategories:[]
            }
        },

        watch:{
            navigationOrder() {
                this.categories = this.navigationOrder;
            }
        },

        mounted(){
            event.on(event.names.UPDATE_NAVIGATION_CATEGORIES, (selected) =>{
                    let check = this.checkCategories(selected);
                    if (!check) {
                        selected.attributes.top_nav = 1;
                        selected.attributes.nav_order = this.categories.length + 1;

                        let data = http.createData(selected);

                        this.addNewNavigationCategory(data);
                    }else{
                        event.emit(event.names.USER_MESSAGE, 'Category could not be added because it is already added', 'error');
                    }
            });
        },

        methods:{

             async addNewNavigationCategory(data){
                this.categories.push(await categoryStore.updateNavigation(data.data.id, data));
            },

             async removeAttached(key){
                this.categories[key].attributes.top_nav = 0;
                this.categories[key].attributes.nav_order = null;

                let data = http.createData(this.categories[key]);

                await categoryStore.updateNavigation(data.data.id, data);

                this.categories.splice(key,1);
            },

            setNewNavigationOrder(){
                for(let y = 0; y < this.categories.length; y++){
                    let oldOrder = this.categories[y].attributes.nav_order;
                    let newOrder = y+1;
                    this.categories[y].attributes.nav_order = newOrder;

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
                    await categoryStore.updateNavigation(data.data.id, data);
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

    .navigationOrder{

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