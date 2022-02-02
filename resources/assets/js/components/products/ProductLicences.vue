<template>
    <div id="relatedProductContainer">
        <div class="attached_container" id="relatedProductSection">
            <h3>Products Licences</h3>
            <table class="table table-hover attachedTable relatedProducts">
                <tr>
                    <th class="relatedProducts-Name">Product Name</th>
                    <th class="relatedProducts-Remove"><span>Remove</span></th>
                </tr>
                <tr v-if="productsLicense.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No Product licenses Added Yet</span>
                    </td>
                </tr>
                <draggable @change="setNewAttachedOrder()" v-model="productsLicense">
                    <tr v-show="productsLicense.length > 0" v-for="(License, key) in productsLicense" :key="key">
                        <td class="relatedProducts-Name">{{ License.attributes.title}}</td>
                        <td class="relatedProducts-Remove attachedTableRemove" @click="removeAttached(key)"><i class="fas fa-trash"></i></td>
                    </tr>
                </draggable>
            </table>
            <button class="btn btn-primary" @click="updateAttachedOrder()">Update Order</button>
        </div>
        <product-search type="attachProductLicence" :product="product"/>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {productStore} from '@/stores';
    import ProductSearch from '@/components/products/ProductSearch';
    import {sharedStore} from "@/stores";
    import draggable from 'vuedraggable';

    export default {
        name: "RelatedLicence",

        components:{ProductSearch, draggable},

        props:['product', 'licenses'],

        data(){
            return{
                type:'attachProductLicence',
                productsLicense: [],
                updated: []
            }
        },

        watch:{

            licenses(){
                this.productsLicense = this.licenses;

                if(this.productsLicense.length > 0) {
                    this.productsLicense = this.sortLicences(this.productsLicense);
                }
            },

        },

        mounted(){
            event.on(event.names.UPDATE_PRODUCT_LICENCE, (selected) =>{
                let count = 0;
                for (let i = 0; i < this.productsLicense.length; i++) {
                    if (this.productsLicense[i].id.toString() === selected.id.toString()) {
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

            sortLicences(licence) {
                return licence.slice().sort(function(a, b) {
                    return a.order - b.order;
                });
            },

            updateAttachedOrder(){
                for(let i =0; i < this.updated.length; i++){
                    this.updateAttached(this.updated[i]);
                }
            },

            setNewAttachedOrder(){
                for(let y = 0; y < this.productsLicense.length; y++){
                    let oldOrder = this.productsLicense[y].order;
                    let newOrder = y+1;
                    this.productsLicense[y].order = newOrder;


                    if(oldOrder !== newOrder){
                        this.addToUpdateArray(this.productsLicense[y]);
                        this.addAttachedID();
                    }
                }
            },

            addAttachedID(){
                for(let y = 0; y < this.productsLicense.length; y++){

                    let related = this.findRelatedProduct(this.productsLicense[y].id);

                    this.productsLicense[y].attached_id = related.attached_id;

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
                        'type': 'product-license',
                        'attributes': {
                            'product_id':this.product.id,
                            'license_id':selectedProduct.id,
                            'order':this.licenses.length + 1
                        }
                    }
                };

                try{
                    let newSavedProduct = await productStore.storeLicence(this.product.id, data);

                    this.productsLicense.push(newSavedProduct);

                    event.emit(event.names.USER_MESSAGE, 'Product was attached successfully', 'success');
                }catch(error){
                    sharedStore.hideLoadingPage();
                    console.log(error);
                }
            },

            async removeAttached(key){

                let licence = this.productsLicense[key];
                try {
                    await productStore.removeLicence(this.product.id, licence.id);
                    this.productsLicense.splice(key,1);
                    this.rearrangeAttached(key);
                    event.emit(event.names.USER_MESSAGE, 'Product was detached successfully', 'success')
                } catch (error) {
                    sharedStore.hideLoadingPage();
                    console.log(error);
                }
            },

            updateAttached(licence){
                //
                // let data = {
                //     'data':{
                //         'type':'relatedproducts',
                //         'id': related.attached_id.toString(),
                //         'attributes': {
                //             'license_id':related.related_id,
                //             'product_id':this.product.id,
                //             'order': related.order,
                //         }
                //     }
                // }
                //
                // productStore.updateAttached(related.attached_id, data);
            },

            rearrangeAttached(key){
                let newAttachedOrder = [];
                let related={};

                for(let t = key; t < this.productsLicense.length;t++){
                    let relatedproductID = this.productsLicense[t].id;
                    // related = this.findRelatedProduct(relatedproductID);
                    related.order = t+1;
                    newAttachedOrder.push(related);
                }

                for(let i =0; i < newAttachedOrder.length; i++){
                    this.updateAttached(newAttachedOrder[i]);
                }

            },

            findRelatedProduct(id){
                for(let i = 0; i < this.product.attributes.product_license.length; i++){
                    if(id.toString() === this.product.attributes.product_license[i].related_id.toString()){
                        return this.product.attributes.product_license[i];
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