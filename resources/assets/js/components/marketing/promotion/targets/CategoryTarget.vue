<template>
    <div style="border: 1px solid #c9c9c9; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
        <div class="attached_container" id="productsStockItemSection">
            <h3>Attached categories</h3>
            <table class="table table-hover attachedTable productsStock">
                <tr>
                    <td class="productsStock-Code">Title</td>
                    <td class="productsStock-Desc">Contains</td>
                    <td class="productsStock-Remove">Remove</td>
                </tr>
                <tr v-if="attachedTargets.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No Categories Have Been Attached Yet</span>
                    </td>
                </tr>
                <tr v-show="attachedTargets.length > 0" v-for="(target, key) in attachedTargets" :key="key">
                    <td class="productsStock-Code">{{target.attributes.details.title}}</td>
                    <td class="productsStock-Desc">{{target.attributes.details.contains}}</td>
                    <td class="productsStock-Remove attachedTableRemove" @click="removeTarget(key)"><i class="fas fa-trash"></i></td>
                </tr>
            </table>
        </div>
        <category-search type="promotionTarget"/>
    </div>
</template>

<script>
    import CategorySearch from '@/components/categories/CategorySearch';
    import {event} from '@/services';
    import {sharedStore} from "@/stores";
    import {categoryStore} from '@/stores';

    export default {
        name: "CategoryTarget",

        components:{CategorySearch},

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