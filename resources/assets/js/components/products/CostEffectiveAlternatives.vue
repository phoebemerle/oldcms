<template>
    <div id="costEffectiveAltContainer">
        <div class="attached_container" id="costEffectiveAltSection">
            <h3>Cost Effective Alternatives</h3>
            <table class="table table-hover attachedTable costEffectiveAlt">
                <tr>
                    <th class="costEffectiveAlt-Name">Product Name</th>
                    <th class="costEffectiveAlt-Price">Price</th>
                    <th class="costEffectiveAlt-Remove"><span>Remove</span></th>
                </tr>
                <tr v-if="costEffectiveAlt.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No Cost Effective Alternatives Added Yet</span>
                    </td>
                </tr>
                <draggable @change="setNewAttachedOrder()" v-model="costEffectiveAlt">
                <tr v-show="costEffectiveAlt.length > 0" v-for="(costeffective, key) in costEffectiveAlt" :key="key">
                    <td class="costEffectiveAlt-Name">{{ costeffective.attributes.title}}</td>
                    <td class="costEffectiveAlt-Price">£{{ costeffective.attributes.price}}</td>
                    <td class="costEffectiveAlt-Remove attachedTableRemove" @click="removeAttached(key)"></td>
                </tr>
                </draggable>
            </table>
            <button class="btn btn-primary" @click="updateAttachedOrder()">Update Order</button>
        </div>
        <product-search  type="attachCostEffective" :product="product"/>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {productStore} from '@/stores';
    import ProductSearch from '@/components/products/ProductSearch';
    import {sharedStore} from "@/stores";
    import draggable from 'vuedraggable';

    export default {
        name: "CostEffectiveAlternatives",

        components:{ProductSearch, draggable},

        props:['product', 'costeffective'],

        data(){
            return{

                type:'attachCostEffective',
                costEffectiveAlt: [],
                updated: []
            }
        },

        watch:{

            costeffective(){
                this.costEffectiveAlt = this.costeffective;

                if(this.costEffectiveAlt.length > 0) {
                    this.costEffectiveAlt = this.sortCostEffective(this.costEffectiveAlt);
                }
            },

        },

        mounted(){  
                event.on(event.names.UPDATE_COSTEFFECTIVE_PRODUCT, (selected) =>{
                let count = 0;
                    for (let i = 0; i < this.costEffectiveAlt.length; i++) {
                        if (this.costEffectiveAlt[i].id.toString() === selected.id.toString()) {
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

            sortCostEffective(costeffective) {

                return costeffective.slice().sort(function(a, b) {
                    return a.order - b.order;
                });
            },

            updateAttachedOrder(){
                for(let i =0; i < this.updated.length; i++){
                    this.updateAttached(this.updated[i]);
                }
            },

            setNewAttachedOrder(){
                for(let y = 0; y < this.costEffectiveAlt.length; y++){
                    let oldOrder = this.costEffectiveAlt[y].order;
                    let newOrder = y+1;
                    this.costEffectiveAlt[y].order = newOrder;
                    

                    if(oldOrder !== newOrder){
                        this.addToUpdateArray(this.costEffectiveAlt[y]);
                        this.addAttachedID();
                    }
                }
            },

            addAttachedID(){
                for(let y = 0; y < this.costEffectiveAlt.length; y++){

                let costeffective = this.findCostEffectiveProduct(this.costEffectiveAlt[y].id)

                this.costEffectiveAlt[y].attached_id = costeffective.attached_id;

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
                        'type': 'costeffectiveproduct',
                        'attributes': {
                            'product_id':this.product.id,
                            'cost_effective_id':selectedProduct.id,
                            'order':this.costEffectiveAlt.length + 1
                        }
                                  
                    }
                };

                try{
                    let newSavedProduct = await productStore.attachCostEffective(this.product.id, data);

                        this.costEffectiveAlt.push(await productStore.productByID(newSavedProduct.cost_effective_id));


                    event.emit(event.names.USER_MESSAGE, 'Product was attached successfully', 'success');
                }catch(error){
                    sharedStore.hideLoadingPage();
                    console.log(error);
                }
            },

            async removeAttached(key){

                let costeffective = this.findCostEffectiveProduct(this.costEffectiveAlt[key].id);

                try {
                    await productStore.removeCostEffectiveProduct(this.costEffectiveAlt[key].id, this.product.id);
                    this.costEffectiveAlt.splice(key,1);
                    this.rearrangeAttached(key);
                } catch (error) {
                    sharedStore.hideLoadingPage();
                    console.log(error);
                }
            },

            updateAttached(costeffective){
                let data = {
                    'data':{
                        'type':'costeffectiveproduct',
                        'id': costeffective.attached_id.toString(),
                        'attributes': {
                        'related_id':costeffective.cost_effective_id,
                            'product_id':this.product.id,
                            'order': costeffective.order,
                        }
                    }
                }

                productStore.updateCostEffective(costeffective.attached_id, data);
            },

            rearrangeAttached(key){
                let newAttachedOrder = [];
                let costeffective={};

                for(let t = key; t < this.costEffectiveAlt.length;t++){
                    let costeffectiveID = this.costEffectiveAlt[t].id;
                    costeffective = this.findCostEffectiveProduct(costeffectiveID);
                    costeffective.order = t+1;
                    newAttachedOrder.push(costeffective);
                }

                for(let i =0; i < newAttachedOrder.length; i++){
                    this.updateAttached(newAttachedOrder[i]);
                }

            },

            findCostEffectiveProduct(id){
                for(let i = 0; i < this.product.attributes.costeffective.length; i++){
                    if(this.product.attributes.costeffective[i].id) {
                    if(id.toString() === this.product.attributes.costeffective[i].id.toString()){
                        return this.product.attributes.costeffective[i];
                    }
                    } else {
                    if(id.toString() === this.product.attributes.costeffective[i].cost_effective_id.toString()){
                        return this.product.attributes.costeffective[i];
                    }
                    }

                }
            },
        }

         }
</script>

<style lang="scss">
    @import "~#/variables";

     .costEffectiveAlt{

            &-Name{
                width:20%;
            }

            &-Desc{
                width:45%;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            &-Price{
                width:15%;
                text-align: center;
            }

            &-Remove{
                text-align: center;
                width:12.5%;
            }
        }

</style>