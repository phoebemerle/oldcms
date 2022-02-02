<template>
    <div id="productStockItemContainer">
        <div class="attached_container" id="productsStockItemSection">
            <h3>Attached products</h3>
            <table class="table table-hover attachedTable productsStock">
                <tr>
                    <th class="productsStock-Code">Stock code</th>
                    <th class="productsStock-Desc">Description</th>
                    <th class="productsStock-Type">Priority</th>
                    <th class="productsStock-Type">Stock Type</th>
                    <th class="productsStock-View">View Stock Item</th>
                    <th class="productsStock-Remove"><span>Remove</span></th>
                </tr>
                <tr v-if="attachedStock.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No Stock Item Attached Yet</span>
                    </td>
                </tr>
                <tr v-show="attachedStock.length > 0" v-for="(stock, key) in attachedStock" :key="key">
                    <td class="productsStock-Code">{{stock.code}}</td>
                    <td class="productsStock-Desc">{{stock.description}}</td>
                    <td class="productsStock-Type"><input name=priority v-model="stock.priority"></td>
                    <td class="productsStock-Type">{{stock.type}}</td>
                    <td class="productsStock-View" style="cursor: pointer" @click="viewStockItem(key)">View</td>
                    <td class="productsStock-Remove attachedTableRemove" @click="removeStock(key)"><i class="fas fa-trash"></i></td>
                </tr>
            </table>
            <input type="button" value="Save" class="btn btn-primary" @click="updatePriority">
        </div>
        <search-inventory :selectedproducts="attachedStock" type="stockItem"/>
    </div>
</template>

<script>
    import searchInventory from '@/components/inventory/InventoryItems/InventorySearch';
    import {event} from '@/services';
    import {inventoryStore} from '@/stores';
    import {productStore} from '@/stores';

    export default {
        name: "StockItemInfo",

        components:{searchInventory},

        props:['product', 'attachedStockItems'],

        data(){
            return{
                attachedStock:[],
                type:'stockItem'
            }
        },

        watch:{
            attachedStockItems(){
                this.attachedStock = this.attachedStockItems;
            }
        },

        methods:{

            viewStockItem(key){
                location.replace("/#!/inventory/edit/"+this.attachedStock[key].rec_id);
            },
            updatePriority()
            {
                let data = {
                    product: this.product.id,
                    items: []
                }
                let stock = {}

                for(let i =0; i < this.attachedStock.length; i++) {
                    stock = {
                        stockitem_id: this.attachedStock[i].id,
                        priority: this.attachedStock[i].priority
                    }

                    data.items.push(stock)
                }

                productStore.updatePivotBulk(data)
            },
            removeStock(key){

                let data = {
                        'stockitem_id': this.attachedStock[key].id,
                        'product_id': this.product.id
                    };

                productStore.removeStockItem(data, this.product.id);
                this.attachedStock.splice(key, 1);


                // event.emit(event.names.UPDATE_SELECTED, this.attachedStock[key], this.type, 'remove');
            },
        },
    }
</script>

<style lang="scss">
    @import "~#/variables";
        .productsStock{

            &-Code{
                width:20%;
            }

            &-Desc{
                width:40%;
            }

            &-Type{
                width:15%;
            }

            &-View {
                width: 10%;
            }

            &-Remove{
                text-align: center;
                width:10%;
            }
        }
</style>