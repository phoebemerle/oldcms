<template>
    <div style="border: 1px solid #c9c9c9; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
        <div class="attached_container" id="productsStockItemSection">
            <h3>Attached products</h3>
            <table class="table table-hover attachedTable productsStock">
                <tr>
                    <th class="productsStock-Code">Stock code</th>
                    <th class="productsStock-Desc">Description</th>
                    <th class="productsStock-Remove"><span>Remove</span></th>
                </tr>
                <tr v-if="attachedTargets.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No Stock Item Attached Yet</span>
                    </td>
                </tr>
                <tr v-show="attachedTargets.length > 0" v-for="(target, key) in attachedTargets" :key="key">
                    <td class="productsStock-Code">{{target.attributes.details.code}}</td>
                    <td class="productsStock-Desc">{{target.attributes.details.description}}</td>
                    <td class="productsStock-Remove attachedTableRemove" @click="removeStock(key)"><i class="fas fa-trash"></i></td>
                </tr>
            </table>
        </div>
        <search-inventory :selectedproducts="targets" type="promotionTarget" />
    </div>
</template>

<script>
    import searchInventory from '@/components/inventory/InventoryItems/InventorySearch';
    import {promotionTargetStore} from "@/stores";
    import {event} from '@/services';

    export default {
        name: "StockItemTarget",

        components:{searchInventory},

        props:['targets', 'promotion'],

        data(){
            return{
                attachedTargets:this.targets
            }
        },

        watch:{
            targets(){
                this.attachedTargets = this.targets;
            }
        },

        methods:{
            removeStock(key){
                event.emit(event.names.REMOVE_TARGET, this.attachedTargets[key]);
            },

        }
    }
</script>


<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";


</style>