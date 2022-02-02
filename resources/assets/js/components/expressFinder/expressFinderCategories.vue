<template>
    <div>
        <div class="attached_container" id="productsStockItemSection">
            <h3>Attached categories</h3>
            <table class="table table-hover attachedTable productsStock">
                <tr>
                    <td class="productsStock-Code">Title</td>
                    <td class="productsStock-Remove">Remove</td>
                </tr>
                <tr v-if="attachedTargets.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No Categories Have Been Attached Yet</span>
                    </td>
                </tr>
                <tr v-show="attachedTargets.length > 0" v-for="(target, key) in attachedTargets" :key="key">
                    <td class="productsStock-Code">{{target.name}}</td>
                    <td class="productsStock-Remove attachedTableRemove" @click="removeTarget(target.id)"><i class="fas fa-trash"></i></td>
                </tr>
            </table>
        </div>

        <category-search type="attachToFinder" :category="[]"/>
    </div>
</template>

<script>
    import CategorySearch from "../categories/CategorySearch";
    import {event} from '@/services';
    import {finderStore} from '@/stores';


    export default {
        name: "expressFinderCategories",
        components: {CategorySearch},

        props:['finder'],

        data(){
            return{
                attachedTargets:[]
            }
        },

        watch:{
            finder(){
                if(this.finder){
                    if(this.finder.type === 'express-finder'){
                        this.attachedTargets = this.finder.attributes.categories;
                    }
                }


            }
        },

        mounted(){
            if(this.finder) {
                if (this.finder.type === 'express-finder') {
                    this.attachedTargets = this.finder.attributes.categories;
                }
            }

             event.on(event.names.UPDATE_FINDER_CATEGORY, (category) =>{

                 if(!this.finder.attributes.categories.find(row => row.category_id === Number(category.id))) {


                     let data = {
                         'data': {
                             'type': 'express-finder-categories',
                             'attributes': {
                                 'category_id': category.id,
                                 'finder_id': this.finder.id
                             }
                         }
                     };

                     this.saveNewCategory(data);
                 }else{
                     return event.emit(event.names.USER_MESSAGE, 'Category is already attached', 'error');

                 }

            });
        },


        methods:{
            async removeTarget(id){
                await finderStore.removeCategory(id, this.finder.id);
            },

            async saveNewCategory(data){
                await finderStore.saveNewFinderCategory(data);
            }

        }
    }
</script>
