<template>
    <div id="costEffectiveAltContainer">
        <div class="attached_container" id="attachedProductsSection">
            <h3>Attached Products</h3>
            <table class="table table-hover attachedTable attachedProducts">
                <tr>
                    <th class="attachedProducts-Name">Product Name</th>
                    <th class="attachedProducts-Remove"><span>Remove</span></th>
                </tr>
                <tr v-if="attachedProducts.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No products attached yet</span>
                    </td>
                </tr>
                <tr v-show="attachedProducts.length > 0" v-for="(attached, key) in attachedProducts" :key="key">
                    <td class="attachedProducts-Name">{{ attached.title}}</td>
                    <td class="attachedProducts-Remove attachedTableRemove" @click="removeAttached(key)"><i class="fas fa-trash"></i></td>
                </tr>
            </table>
        </div>
        <product-search  type="attachToSash" :product="attachedProducts"/>
    </div>
</template>

<script>
    import {event, http} from '@/services';
    import {productStore, productSashesStore} from '@/stores';
    import ProductSearch from '@/components/products/ProductSearch';
    import {sharedStore} from "@/stores";

    export default {
        name: "SashAttachedProducts",

        components:{ProductSearch},

        props:['attachedProducts', 'productsash'],

        data(){
            return{

                type:'attachToSash',
            }
        },

        watch:{


        },

        mounted(){  
                event.on(event.names.UPDATE_ATTACHED_PRODUCTS, (selected) =>{
                let count = 0;
                if(this.attachedProducts){

                    for (let i = 0; i < this.attachedProducts.length; i++) {
                        if (this.attachedProducts[i].id.toString() === selected.id.toString()) {
                            count = 1;
                        }
                    }

                    if(count === 1){
                        console.log('Already attached you melt');
                        event.emit(event.names.USER_MESSAGE, selected.attributes.title + ' could not be attached', 'error');
                    }
                    else{
                        productSashesStore.attachSash(this.productsash, selected);
                        this.attachedProducts.push(selected);
                    }
                }
            });      
        }, 

        methods:{
                removeAttached(key){
                    let removeProduct = this.attachedProducts[key];
                    productSashesStore.detachSash(this.productsash, removeProduct);
                    this.attachedProducts.splice(removeProduct, 1);
                }
        }

         }
</script>

<style lang="scss">
    @import "~#/variables";

     .attachedProducts{

            &-Name{
                width:60%;
            }

            &-Remove{
                text-align: center;
                width:12.5%;
            }
        }

</style>