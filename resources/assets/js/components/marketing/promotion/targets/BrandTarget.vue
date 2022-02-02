<template>
    <div style="border: 1px solid #c9c9c9; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
        <div class="attached_container" id="productsStockItemSection">
            <h3>Attached brands</h3>
            <table class="table table-hover attachedTable productsStock">
                <tr>
                    <td class="productsStock-Code">Name</td>
                    <td class="productsStock-Remove"></td>
                </tr>
                <tr v-if="attachedTargets.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No Brands Have Been Attached Yet</span>
                    </td>
                </tr>
                <tr v-if="attachedTargets.length > 0" v-for="(target, key) in attachedTargets">
                    <td class="productsStock-Code">{{target.attributes.details.name}}</td>
                    <td class="productsStock-Remove attachedTableRemove" @click="removeTarget(key)"><i class="fas fa-trash"></i></td>
                </tr>
            </table>
        </div>
        <brand-search type="promotionTarget"/>
    </div>
</template>

<script>
    import BrandSearch from '@/components/brands/BrandSearch';

    import {event} from '@/services';

    export default {
        name: "BrandTarget",

        components:{BrandSearch},

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