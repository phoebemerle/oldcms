<template>
    <div class="bomComponent">
        <div class="attached_container" id="inventoryBomContaier">
            <h3>Attached Products</h3>
                <table class="table table-hover attachedTable bomComponentStock">
                    <tr>
                        <th class="bomComponentStock-Code">Product Code</th>
                        <th class="bomComponentStock-Desc">Description</th>
                        <th class="bomComponentStock-Qty">Qty Needed</th>
                        <th class="bomComponentStock-Update">Update</th>
                        <th class="bomComponentStock-Remove">Remove</th>
                        <th class="bomComponentStock-View">Set Alternative</th>
                    </tr>
                    <tr v-show="attachedComponents.length < 1" class="noAttachmentsFound">
                        <td colspan="3">
                            <span>There are currently no products attached</span>
                        </td>
                    </tr>
                    <tr v-for="(component, key) in attachedComponents">
                        <td class="bomComponentStock-Code">{{component.bom_attributes.code}}</td>
                        <td class="bomComponentStock-Desc">{{component.bom_attributes.description}}</td>
                        <td class="bomComponentStock-Qty"><input v-model="component.bom_attributes.qty" id="number" type="number" min="1"></td>
                        <td class="bomComponentStock-Update attachedTableUpdate" @click="updateBom(key)"></td>
                        <td class="bomComponentStock-Remove attachedTableRemove" @click="removeBom(key)"><i class="fas fa-trash"></i></td>
                        <td class="bomComponentStock-View attachedTableSet" @click="viewAttached(key)"></td>
                    </tr>
                </table>
        </div>

        <div class="bomComponent__container">
            <search-inventory :selectedproducts="attachedComponents" type="bom"></search-inventory>

        </div>

        <alternate-product :baseproduct="stockitem" ref="altProduct"/>

    </div>
</template>

<script>
    import {event} from '@/services';
    import {inventoryStore} from '@/stores';
    import {bomComponentStore} from '@/stores'
    import alternateProduct from '@/components/modals/alternateProduct';
    import searchInventory from '@/components/inventory/InventoryItems/InventorySearch';

    export default {

        components: {alternateProduct, searchInventory},

        props:['stockitem', 'type'],

        data:function (){
            return{
                attachedComponents:[],
                searchInventory:[],

            }
        },

        mounted:function() {
            event.on(event.names.UPDATE_SELECTED, (selectedProducts, type) => {
                if (type === 'bom') {
                var counter = 0;
                    if (selectedProducts.attributes.type === 'Standard') {

                        for (var a = 0; a < this.attachedComponents.length; a++) {
                            if (this.attachedComponents[a].bom_attributes.code === selectedProducts.attributes.code) {
                                counter = 1;
                            }
                        }
                        if (counter === 0) {
                            let data = {
                                'data':{
                                    'type':'bom-components',
                                    'attributes':{
                                        'qty':'1',
                                    },
                                    'relationships': {
                                        'stockitems':{
                                            'data':{
                                                'type':'stockitems',
                                                'id':selectedProducts.id
                                            }
                                        },
                                        'bom':{
                                            'data':{
                                                'type':'stockitems',
                                                'id':this.stockitem.id
                                            }
                                        }
                                    }
                                }
                            };

                            this.storeBom(data, selectedProducts.attributes.description, selectedProducts.attributes.code)

                        } else {
                            event.emit(event.names.USER_MESSAGE, selectedProducts.attributes.description + ' is already an attached product', 'error');
                        }
                    }
                    else{
                        event.emit(event.names.USER_MESSAGE, 'You cannot add other Bom products as a component. Please chose a standard product', 'error');
                    }
                }
            });
        },

        watch:{
            async stockitem(){
                if(this.stockitem != null) {
                    if(this.stockitem.type === 'stockitems') {
                        if (this.stockitem.attributes.type === 'BOM') {
                            this.attachedComponents = await bomComponentStore.checkBomComponents(this.stockitem.id);
                        }
                    }
                }
            },
        },

        methods: {
            async viewAttached(key){
                this.$refs.altProduct.openBomModal(this.attachedComponents[key]);
            },

            async removeBom(key){
                try {
                    await bomComponentStore.removeBomComponent(this.attachedComponents[key].bom_attributes.id, this.attachedComponents[key].bom_attributes.description);
                    this.attachedComponents.splice(key,1);
                } catch (error) {
                    console.log(error);
                }
            },

            async storeBom(data, bomName, bomCode){
                try {
                    this.attachedComponents.unshift(await bomComponentStore.storeBomComponent(data, bomName, bomCode));
                } catch (error) {
                    console.log(error);
                }
            },

            async updateBom(key){
                let component = this.attachedComponents[key];

                let data = {
                    'data':{
                        'type':'bom-components',
                        'id':component.bom_attributes.id,
                        'attributes':{
                            'qty':component.bom_attributes.qty,
                        },
                        'relationships': {
                            'stockitems':{
                                'data':{
                                    'type':'stockitems',
                                    'id':component.bom_attributes.stock_id
                                }
                            },
                            'bom':{
                                'data':{
                                    'type':'stockitems',
                                    'id':component.id
                                }
                            }
                        }
                    }
                };
                await bomComponentStore.updateBomComponent(data, component.bom_attributes.id, component.bom_attributes.description, );
            }

        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    .bomComponentStock{

        &-Code{
            width:20%;
        }

        &-Desc{
            width:40%;
        }

        &-Qty{
            width:10%;
            text-align:center;

            input{
                width: 4rem;
                height: 3rem;
                padding: 0;
                font-size: 1.4rem;
                border: 0.1rem solid #c9c9c9;
                border-radius:0.5rem;
            }

        }
        &-Update{
            width:8%;
            text-align: center;
        }
        &-Remove{
            text-align: center;
            width:7%;
        }
        &-View{
            text-align: center;
            width:10%;
        }
    }

</style>