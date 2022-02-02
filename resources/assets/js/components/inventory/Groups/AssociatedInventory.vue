<template>
    <div class="associatedProducts">
        <div class="attached_container" id="GroupInventorySection">
            <h3>Attached Inventory</h3>
            <table class="table table-hover attachedTable groupProducts">
                <tr>
                    <th class="groupProducts-Code">Product Code</th>
                    <th class="groupProducts-Desc">Product Description</th>
                    <th class="groupProducts-View">View Stock Item</th>
                    <th class="groupProducts-Remove">Remove Stock Item</th>
                </tr>
                <tr v-if="attachedProducts.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>There are no products associated to this group</span>
                    </td>
                </tr>
                <tr v-if="attachedProducts.length > 0" v-for="(attachedProduct, index) in attachedProducts">
                    <td class="groupProducts-Code">{{attachedProduct.attributes.code}}</td>
                    <td class="groupProducts-Desc">{{attachedProduct.attributes.description}}</td>
                    <td class="groupProducts-View attachedTableView"><a :href="'#!/inventory/edit/'+attachedProduct.id"><i class="fas fa-eye"></i></a></td>
                    <td class="groupProducts-Remove attachedTableRemove" @click="removeAssociated(index)"><i class="fas fa-trash"></i></td>
                </tr>
            </table>
            <button @click="updateAssociated()" class="btn btn-primary">Update associated products</button>
        </div>
        <inventory-search :selectedproducts="attachedProducts" :type="type"/>
    </div>
</template>

<script>
    import InventorySearch from '@/components/inventory/InventoryItems/InventorySearch';
    import {event} from '@/services';
    import {productGroupsStore} from '@/stores';
    import {inventoryStore} from '@/stores';

    export default {
        components: {InventorySearch},

        props:['group', 'type'],

        data(){
            return{
                attachedProducts:[],
            }
        },

        mounted:function() {
            event.on(event.names.UPDATE_SELECTED, (selectedProducts, type) => {
                if (type === 'edit-group') {
                    var counter = 0;

                    for(var a = 0; a < this.attachedProducts.length; a++){
                        if(this.attachedProducts[a].id === selectedProducts.id){
                            counter = 1;
                        }
                    }
                    if(counter === 0) {
                        this.attachedProducts.unshift(selectedProducts);
                    }else{
                        event.emit(event.names.USER_MESSAGE, selectedProducts.description+' is already associated of this group', 'error');
                    }
                }
            });
        },

        watch:{
            async group(){
                if (this.group != null) {
                    if(this.group.type === 'productgroup') {
                        this.attachedProducts = await inventoryStore.getGroups(this.group.id);
                    }
                }
            },
        },

        methods:{
            async removeAssociated(key){
                var stockItemsToSave = [];

                for(var p = 0; p < this.attachedProducts.length; p++){
                    stockItemsToSave.push({
                        'id': this.attachedProducts[p].id,
                        'type':'stockitems'
                    })
                }

                var data = {
                    'data': {
                        'id':this.group.id,
                        'type':this.group.type,
                        'attributes': {
                            'name': this.group.attributes.name,
                            'code': this.group.attributes.code,
                        },
                        'relationships': {
                            'stockitems': {
                                'data':stockItemsToSave
                            }
                        }
                    }
                }

                try {
                    await productGroupsStore.edit(data, this.group.id);
                } catch (error) {
                    event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error');
                }

            },

            async updateAssociated(){
                var stockItemsToSave = [];

                for(var p = 0; p < this.attachedProducts.length; p++){
                    stockItemsToSave.push({
                        'id': this.attachedProducts[p].id,
                        'type':'stockitems'
                    })
                }

                var data = {
                    'data': {
                        'id':this.group.id,
                        'type':this.group.type,
                        'attributes': {
                            'name': this.group.attributes.name,
                            'code': this.group.attributes.code,
                        },
                        'relationships': {
                            'stockitems': {
                                'data':stockItemsToSave
                            }
                        }
                    }
                }

                try {
                    await productGroupsStore.edit(data, this.group.id);
                } catch (error) {
                    event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error');
                }
                }

            }

        }

</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

    .groupProducts{
            &-Code{
                width: 20%;
            }
            &-Desc{
                width: 50%;
            }
            &-View{
                width: 14%;
                cursor: pointer;
            }
            &-Remove{
                width: 14%;
            }
    }
</style>