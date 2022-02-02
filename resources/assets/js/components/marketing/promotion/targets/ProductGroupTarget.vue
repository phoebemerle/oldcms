<template>
    <div style="border: 1px solid #c9c9c9; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
        <div class="attached_container" id="productsStockItemSection">
            <h3>Attached products</h3>
            <table class="table table-hover attachedTable productsStock">
                <tr>
                    <td class="productsStock-Code">Name</td>
                    <td class="productsStock-Code">Code</td>
                    <td class="productsStock-Desc">Sage ID</td>
                    <td class="productsStock-Remove">Remove</td>
                </tr>
                <tr v-if="attachedTargets.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No Groups Have Been Attached Yet</span>
                    </td>
                </tr>
                <tr v-show="attachedTargets.length > 0" v-for="(target, index) in attachedTargets" :key="index">
                    <td class="productsStock-Code">{{target.attributes.details.name}}</td>
                    <td class="productsStock-Code">{{target.attributes.details.code}}</td>
                    <td class="productsStock-Desc">{{target.attributes.details.sage_id}}</td>
                    <td class="productsStock-Remove attachedTableRemove" @click="removeTarget(index)"><i class="fas fa-trash"></i></td>
                </tr>
            </table>
        </div>
        <product-group-search type="promotionTarget"/>
    </div>
</template>

<script>
    import ProductGroupSearch from '@/components/products/ProductGroupSearch';
    import {event} from '@/services';
    import {sharedStore} from "@/stores";
    import {productGroupStore} from '@/stores';


    export default {
        name: "ProductTarget",

        components:{ProductGroupSearch},

        props:['targets', 'promotion'],

        data(){
            return{

                type: "promotionTarget",
                attachedTargets:this.targets
            }
        },

        watch:{
            targets(){
                this.attachedTargets = this.targets;
            }
        },


        methods:{
            removeTarget(key){
                event.emit(event.names.REMOVE_TARGET, this.attachedTargets[key]);
            },

        }
    }
</script>


<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";


</style>