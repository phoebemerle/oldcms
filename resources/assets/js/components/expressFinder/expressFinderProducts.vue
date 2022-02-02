<template>
    <div id="costEffectiveAltContainer">
        <div class="attached_container" id="costEffectiveAltSection">
            <div>
                <h3>Attached Products</h3>
                <a :href="'http://catalogue.dev.local/api/express-finder/populate_attributes/'+finder.id" @click="populateFinder(finder.id)" class="btn btn-primary">Populate Finder</a>
            </div>
            <table class="table table-hover attachedTable costEffectiveAlt">
                <tr>
                    <th class="costEffectiveAlt-Name">Title</th>
                    <th class="costEffectiveAlt-Remove"><span>Remove</span></th>
                </tr>
                <tr v-if="attachedTargets.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No Products Added Yet</span>
                    </td>
                </tr>
                <tr v-if="attachedTargets.length > 0" v-for="(product, key) in attachedTargets" :key="key">
                    <td class="costEffectiveAlt-Name">{{ product.title}}</td>
                    <td class="costEffectiveAlt-Remove attachedTableRemove" @click="removeTarget(target.id)"><i class="fas fa-trash"></i></td>
                </tr>
            </table>
        </div>
        <product-search  type="attachToFinder" />
    </div>
</template>

<script>
    import ProductSearch from "../products/ProductSearch";
    import {event} from '@/services';
    import {finderStore} from '@/stores';

    export default {
        name: "expressFinderProducts",
        components: {ProductSearch},

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
                        this.attachedTargets = this.finder.attributes.products;
                    }
                }


            }
        },

        mounted(){
            if(this.finder) {
                if (this.finder.type === 'express-finder') {
                    this.attachedTargets = this.finder.attributes.products;
                }
            }

            event.on(event.names.UPDATE_FINDER_PRODUCTS, (product) =>{

                if(!this.finder.attributes.products.find(row => Number(row.product_id) === Number(product.id))) {


                    let data = {
                        'data': {
                            'type': 'express-finder-categories',
                            'attributes': {
                                'product_id': product.id,
                                'finder_id': this.finder.id
                            }
                        }
                    };

                    this.saveNewProduct(data);
                }else{
                    return event.emit(event.names.USER_MESSAGE, 'Category is already attached', 'error');

                }

            });
        },


        methods:{
            async removeTarget(id){
                await finderStore.removeCategory(id, this.finder.id);
            },

            async saveNewProduct(data){
                await finderStore.saveNewFinderProduct(data);
            },

            async populateFinder(){

            }

        }
    }
</script>

<style>


    th.costEffectiveAlt-Name,td.costEffectiveAlt-Name{
        width:500px;
    }
</style>