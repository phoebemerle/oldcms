<template>
    <div id="relatedProductContainer">
        <div class="attached_container" id="relatedProductSection">
            <h3>Related Products</h3>
            <table class="table table-hover attachedTable relatedProducts">
                <tr>
                    <th class="relatedProducts-Name">Product Name</th>
                    <th class="relatedProducts-Remove"><span>Remove</span></th>
                </tr>
                <tr v-if="relatedProducts.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No Related Products Added Yet</span>
                    </td>
                </tr>
                <draggable @change="setNewAttachedOrder()" v-model="relatedProducts">
                <tr v-show="relatedProducts.length > 0" v-for="(related, key) in relatedProducts" :key="key">
                    <td class="relatedProducts-Name">{{ related.attributes.title}}</td>
                    <td class="relatedProducts-Remove attachedTableRemove" @click="removeAttached(key)"><i class="fas fa-trash"></i></td>
                </tr>
                </draggable>
            </table>
            <button class="btn btn-primary" @click="updateAttachedOrder()">Update Order</button>
        </div>
        <product-search type="attachRelatedProduct" :product="product"/>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {productStore} from '@/stores';
    import ProductSearch from '@/components/products/ProductSearch';
    import {sharedStore} from "@/stores";
    import draggable from 'vuedraggable';

    export default {
        name: "RelatedProducts",

        components:{ProductSearch, draggable},

        props:['product', 'related'],

        data(){
            return{

                type:'attachRelatedProduct',
                relatedProducts: [],
                updated: []
            }
        },

        watch:{

            related(){
                this.relatedProducts = this.related;

                if(this.relatedProducts.length > 0) {
                    this.relatedProducts = this.sortRelatedProducts(this.relatedProducts);
                }
            },

        },

        mounted(){
                event.on(event.names.UPDATE_RELATED_PRODUCT, (selected) =>{
                let count = 0;
                    for (let i = 0; i < this.relatedProducts.length; i++) {
                        if (this.relatedProducts[i].id.toString() === selected.id.toString()) {
                            count = 1;
                        }
                    }

                if(count === 1){
                    console.log('Already attached you melt');
                    event.emit(event.names.USER_MESSAGE, selected.attributes.title + ' could not be attached', 'error');
                }
                else{
                    this.storeAttached(selected);
                }
            });      
        }, 

        methods:{

            sortRelatedProducts(related) {

                return related.slice().sort(function(a, b) {
                    return a.order - b.order;
                });
            },

            updateAttachedOrder(){
                for(let i =0; i < this.updated.length; i++){
                    this.updateAttached(this.updated[i]);
                }
            },

            setNewAttachedOrder(){
                for(let y = 0; y < this.relatedProducts.length; y++){
                    let oldOrder = this.relatedProducts[y].order;
                    let newOrder = y+1;
                    this.relatedProducts[y].order = newOrder;
                    

                    if(oldOrder !== newOrder){
                        this.addToUpdateArray(this.relatedProducts[y]);
                        this.addAttachedID();
                    }
                }
            },

            addAttachedID(){
                for(let y = 0; y < this.relatedProducts.length; y++){

                let related = this.findRelatedProduct(this.relatedProducts[y].id);

                this.relatedProducts[y].attached_id = related.attached_id;

                }
            },

            addToUpdateArray(product){
                let count = null;
                if(this.updated.length > 0) {
                    for (let y = 0; y < this.updated.length; y++) {
                        if(this.updated[y].id === product.id){
                            count = y;
                        }
                    }
                }
                if(count != null){
                    this.updated.splice(count, 1);
                }
                this.updated.push(product);

            },

            async storeAttached(selectedProduct) {
                let data = {
                    'data': {
                        'type': 'relatedproducts',
                        'attributes': {
                            'product_id':this.product.id,
                            'related_id':selectedProduct.id,
                            'order':this.related.length + 1
                        }
                    }
                };

                try{
                    let newSavedProduct = await productStore.storeAttached(this.product.id, data);

                    this.relatedProducts.push(newSavedProduct);

                    event.emit(event.names.USER_MESSAGE, 'Product was attached successfully', 'success');
                }catch(error){
                    sharedStore.hideLoadingPage();
                    console.log(error);
                }
            },

            async removeAttached(key){
                let related = this.relatedProducts[key];
                try {
                    await productStore.removeRelated(this.product.id, related.id);
                    this.relatedProducts.splice(key,1);
                    this.rearrangeAttached(key);
                    event.emit(event.names.USER_MESSAGE, 'Product was detached successfully', 'success')
                } catch (error) {
                    sharedStore.hideLoadingPage();
                    console.log(error);
                }
            },

            updateAttached(related){
                let data = {
                    'data':{
                        'type':'relatedproducts',
                        'id': related.attached_id.toString(),
                        'attributes': {
                            'related_id':related.related_id,
                            'product_id':this.product.id,
                            'order': related.order,
                        }
                    }
                }

                productStore.updateAttached(related.attached_id, data);
            },

            rearrangeAttached(key){
                let newAttachedOrder = [];
                let related={};

                for(let t = key; t < this.relatedProducts.length;t++){
                    let relatedproductID = this.relatedProducts[t].id;
                    related = this.findRelatedProduct(relatedproductID);
                    related.order = t+1;
                    newAttachedOrder.push(related);
                }

                for(let i =0; i < newAttachedOrder.length; i++){
                    this.updateAttached(newAttachedOrder[i]);
                }

            },

            findRelatedProduct(id){
                for(let i = 0; i < this.product.attributes.related.length; i++){
                    if(id.toString() === this.product.attributes.related[i].related_id.toString()){
                        return this.product.attributes.related[i];
                    }
                }
            },
            

        },
    }
</script>

<style lang="scss">
    @import "~#/variables";
        .relatedProducts{

            &-Name{
                width:25%;
            }

            &-Desc{
                width:55%;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            &-Remove{
                text-align: center;
                width:12.5%;
            }
        }
</style>