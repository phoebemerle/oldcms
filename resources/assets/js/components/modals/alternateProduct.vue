<template>
    <div class="alternative-components modalContainer" v-show="showModal">
        <div class="alternative-components__container">
            <div class="closeModal" @click="closeBomModal"></div>
            <div>
                <div class="attached_container" id="alternativeComponentsSection">

                    <h1>Alternative Products</h1>

                    <div id="userMessage" v-show="userMessage !== ''" :class="{errorMessage: error, 'successfulMessage':success}">
                        {{userMessage}}
                    </div>

                    <table class="table table-hover attachedTable alternativeComponents">
                        <tr>
                            <th class="alternativeComponents-Code">Product Code</th>
                            <th class="alternativeComponents-Desc">Description</th>
                            <th class="alternativeComponents-Remove"></th>
                        </tr>
                        <tr v-show="altComponents.length < 1" class="noAttachmentsFound">
                            <td colspan="3">
                                <span>There are currently no products attached</span>
                            </td>
                        </tr>
                        <tr v-for="(product, key) in altComponents">
                            <td class="alternativeComponents-Code">{{product.code}}</td>
                            <td class="alternativeComponents-Desc">{{product.name}}</td>
                            <td class="alternativeComponents-Remove attachedTableRemove" @click="removeAltProduct(key)"> <i class="fas fa-trash"></i></td>
                        </tr>
                    </table>
                </div>

                <search-inventory type="alt"></search-inventory>

            </div>
        </div>
    </div>
</template>

<script>
    import searchInventory from '@/components/inventory/InventoryItems/InventorySearch';
    import {bomComponentStore} from '@/stores';
    import {event} from '@/services';
    import {inventoryStore} from '@/stores';

    export default {

        props:['baseproduct'],

        components: {searchInventory},

        data(){
            return{
                showModal:false,
                bomComponent:[],
                altComponents:[],
                userMessage:'',
                error:false,
                success:false,
            }
        },

        mounted:function(){
            event.on(event.names.UPDATE_SELECTED, (selectedProducts, type) =>{
                if (type === 'alt') {
                    var counter = 0;
                    this.resetMessage();

                    for (var a = 0; a < this.altComponents.length; a++) {
                        if(this.altComponents[a].stock_id === selectedProducts.id){
                            counter = 1;
                        }
                    }

                    if(counter === 0){

                        let data = {
                            'data':{
                                'type':'alt-components',
                                'relationships': {
                                    'component':{
                                        'data':{
                                            'type':'stockitems',
                                            'id':this.bomComponent.bom_attributes.id
                                        }
                                    },
                                    'stockitems':{
                                        'data':{
                                            'type':'stockitesm',
                                            'id':selectedProducts.id
                                        }
                                    }
                                }
                            }
                        };
                        this.storeAlt(data, selectedProducts.attributes.code, selectedProducts.attributes.description);

                    }else{
                        this.error = true;
                        this.userMessage = 'This product is already an alternative product';
                    }


                }

            });

            event.on(event.names.ALTERNATE_PRODUCTS, (products)=>{
                this.changedSelected(products);
            });

            event.on(event.names.CLOSE_MODAL, () =>{
                this.closeBomModal();
                this.resetMessage();
            });

        },

        watch:{
            baseproduct(){
                this.bomProduct = this.baseproduct;
                this.resetMessage();
            }
        },

        methods: {
            resetMessage(){
                this.userMessage = '';
                this.success = false;
                this.error = false;
            },

            openBomModal(product) {
                this.showModal = true;
                this.bomComponent = product;
                this.altComponents = product.alt_attributes;
            },

            closeBomModal() {
                this.showModal = false;
                this.resetMessage();
                this.bomComponent = [];
            },

            async storeAlt(data, code, name){
                try {
                    await bomComponentStore.storeAltComponent(data, code, name);
                    this.userMessage = name + ' was successfully added';
                    this.success = true;
                } catch (error) {
                    console.log(error);
                }
            },

            async removeAltProduct(key){
                this.resetMessage();
                let altName = this.altComponents[key].name;
                try {
                    await bomComponentStore.removeAltComponent(this.altComponents[key].alt_id, this.bomComponent.bom_attributes.id);
                    this.userMessage = altName + ' was successfully removed';
                    this.success = true;
                } catch (error) {
                    console.log(error);
                    this.error = true;
                    this.userMessage = 'There was a problem! your action could not be completed'
                }
            },
        }
    }
</script>

<style lang="scss">
    @import '~#/mixins';

    .alternative-components{
        @include is-overlay;

        &__container{
            width:70%;
            height:80%;
            background-color: #FFF;
            padding:10px;
            border: 1px solid $border-color;
            border-radius:5px;
            position:relative;
        }

        #attachedProductTable{
            height:unset;
        }

        .alternativeComponents {
            &-Code{
                width:30%;
            }
            &-Desc{
                width:40%;
            }
            &-Remove{
                width:20%;
            }
        }
    }

</style>