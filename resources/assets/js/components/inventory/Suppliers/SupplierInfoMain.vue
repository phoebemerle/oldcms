<template>
    <div>
        <div class="attached_container" id="productSupplierAttachedSection">
            <h3>Attached Suppliers</h3>
            <table class="table table-hover attachedTable inventorySuppliers">
                <tr>
                    <th class="inventorySuppliers-Name">Supplier Name</th>
                    <th class="inventorySuppliers-Price">Buy Price</th>
                    <th class="inventorySuppliers-Qty">Qty</th>
                    <th class="inventorySuppliers-MinQty">Minimum Qty</th>
                    <th class="inventorySuppliers-BoxQty">Box Qty</th>
                    <th class="inventorySuppliers-LeadTime">Lead Time</th>
                    <th class="inventorySuppliers-Preferred">Preferred</th>
                    <th class="inventorySuppliers-Update">Update</th>
                    <th class="inventorySuppliers-Remove">Remove</th>
                </tr>
                <tr v-show="selectedSuppliers.length < 1" class="noAttachmentsFound">
                    <td colspan="6">
                        <span>There are currently no suppliers attached</span>
                    </td>
                </tr>
                <tr v-for="(supplier, key) in selectedSuppliers" :key="key">
                    <td class="inventorySuppliers-Name">
                        {{supplier.relationships.supplier.data.attributes.name}}
                    </td>
                    <td class="inventorySuppliers-Price">
                        <span class="princeInputSymbol">£</span>
                        <input type="number" v-model="selectedSuppliers[key].attributes.buy_price" name="inventorySuppliersPrice" v-validate="'required|decimal'" data-vv-as="Price">
                    </td>
                    <td class="inventorySuppliers-Qty">
                        <input type="number" min="1" v-model="selectedSuppliers[key].attributes.qty" name="inventorySuppliersQty" v-validate="'required|numeric'" data-vv-as="Quantity">
                    </td>
                    <td class="inventorySuppliers-MinQty">
                        <input type="number" min="1" v-model="selectedSuppliers[key].attributes.min_order_qty" name="inventorySuppliersMinQty" v-validate="'required|numeric'" data-vv-as="Minimum Quantity">
                    </td>
                    <td class="inventorySuppliers-BoxQty">
                        <input type="number" min="1" v-model="selectedSuppliers[key].attributes.box_qty" name="inventorySuppliersBoxQty" v-validate="'required|numeric'" data-vv-as="Box Quantity">
                    </td>
                    <td class="inventorySuppliers-LeadTime">
                        <input type="number" min="1" v-model="selectedSuppliers[key].attributes.lead_time" name="inventorySuppliersLeadTime" v-validate="'numeric|required'" data-vv-as="Lead Time">
                        <select v-model="selectedSuppliers[key].attributes.lead_time_value" name="inventorySuppliersLeadTimeValue" v-validate="'required|included:days,months,years'" data-vv-as="Lead Time Value">
                            <option value="days">Days</option>
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                        </select>
                    </td>
                    <td class="inventorySuppliers-Preferred">
                        <input type="checkbox" v-model="selectedSuppliers[key].attributes.preferred" name="inventorySuppliersPreferred" data-vv-as="Prefered" v-validate="">
                    </td>
                    <td class="inventorySuppliers-Update attachedTableUpdate" :disabled="$validator.errors.any()" @click="updateSupplier(key)"></td>
                    <td class="inventorySuppliers-Remove attachedTableRemove" @click="removeSupplier(key)"><i class="fas fa-trash"></i></td>
                </tr>
            </table>
            <span class="error-message" v-for="error in errors.all()" :key="error">{{ error }}<br></span>
        </div>

        <div>
            <supplier-search :selectedSuppliers="selectedSuppliers" :suppliers="selectedSuppliers"/>
        </div>
    </div>
</template>

<script>

    import SupplierSearch from '@/components/inventory/Suppliers/SupplierSearch';
    import {inventoryStore} from '@/stores';
    import {stockSuppliersStore} from '@/stores';
    import {event} from '@/services';
    import {http} from '@/services';

    export default {
        components:{SupplierSearch},

        props:['view', 'stockitem'],

        data:function(){
            return{
                selectedSuppliers:[],
            }
        },

        watch:{
            async stockitem() {
                this.selectedSuppliers = [];
                if (this.stockitem != null) {
                    if ((this.stockitem.type === 'stockitems') && (this.view === 'edit-stock')) {
                        this.selectedSuppliers = await stockSuppliersStore.checkSuppliers(this.stockitem);
                    }
                }
                this.$validator.reset();
            }
        },

        methods: {
            async storeSuppliers(data){
                let newSupplierInfo = await stockSuppliersStore.storeStockSupplier(data);
                this.selectedSuppliers.push(newSupplierInfo);
            },

            async updateSupplier(key){

                await this.$validator.validateAll();

               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }

                this.selectedSuppliers[key].attributes.buy_price = parseInt(this.selectedSuppliers[key].attributes.buy_price);
                let data = http.createData(this.selectedSuppliers[key]);

                try {
                    await stockSuppliersStore.updateStockSupplier(data);
                    return event.emit(event.names.USER_MESSAGE, 'Supplier info updated', 'success');
                } catch (error) {
                    console.log(error);
                }
            },

            async removeSupplier(key){
                try {
                    await stockSuppliersStore.removeStockSupplier(this.selectedSuppliers[key]);
                    this.selectedSuppliers.splice(key, 1);
                } catch (error) {
                    console.log(error);
                }
            }

        },

        mounted(){
             event.on(event.names.UPDATE_SELECTED, (selectedSuppliers, type) =>{
                let counter = 0;
                if(type === 'Supplier') {
                    for(var a = 0; a < this.selectedSuppliers.length; a++){
                        if(this.selectedSuppliers[a].id.toString() === selectedSuppliers.id.toString()){
                            counter = 1;
                        }
                    }
                    if(counter === 0) {
                        let data = {
                            'data':{
                                'type':'stockitem-suppliers',
                                'attributes':{
                                    'buy_price':0,
                                    'qty':'1',
                                    'lead_time':'1',
                                    'lead_time_value':'days',
                                    'min_order_qty':'1',
                                    'box_qty':'1',
                                    'preferred':0
                                },
                                'relationships': {
                                    'stockitems':{
                                        'data':{
                                            'type':'stockitems',
                                            'id':this.stockitem.id
                                        }
                                    },
                                    'supplier': {
                                        'data':{
                                            'type':'suppliers',
                                            'id':selectedSuppliers.id.toString()
                                        }
                                    }
                                }
                            }
                        };
                        this.storeSuppliers(data);
                    }else{
                        event.emit(event.names.USER_MESSAGE, selectedSuppliers.name + ' is already an attached supplier', 'error');
                    }
                }
            });
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    .inventorySuppliers{

        input{
            border:0.1rem solid #c9c9c9;
            border-radius:0.5rem;
        }

        &-Name{
            width:18.5%
        }

        &-Price{
            width:13%;

            input{
                width:70%;
            }
        }

        &-LeadTime{
            width:13.5%;

            input{
                width: 6rem;
                height: 3.6rem;
            }
        }

        &-Qty, &-BoxQty, &-MinQty{
            width:10%;
            input{
                width: 60%;
            }
        }

        &-Preferred{
            width:6%;
        }

        &-Update{
            width:6%;
        }
        &-Remove{
            width:6%;
        }
    }

</style>