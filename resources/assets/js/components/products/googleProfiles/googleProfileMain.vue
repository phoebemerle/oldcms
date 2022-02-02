<template>
    <div id="googleShoppingContainer">
        <div  v-if="attachedStockItems.length > 0">
            <div style="font-size:16px;">
                <label>Stock Items:</label>
                <select @change="findProfile()" v-model="selectedStockItem">
                    <option value="Select">Please Select a Stock Item</option>
                    <option v-for="(stockItem, key) in attachedStockItems" :value="stockItem.id" :key="key">{{stockItem.attributes.description}}</option>
                </select>
            </div>
            <google-profiles-details :profile="googleProfile" :productStockItemID="productStockItemsID"/>
        </div>
        <div v-if="attachedStockItems.length === 0">
            <h4 style="color:red; padding:10px;">You have to attach stock items to this product before you can make a Google Shopping Profile</h4>
        </div>
    </div>
</template>

<script>
    import {googleProfileStore} from "@/stores";
    import GoogleProfilesDetails from '@/components/products/googleProfiles/googleProfileDetails';
    import {event} from '@/services';

    export default {
        name: "googleProfileMain",

        props:['attachedStockItems', 'foundGoogleProfiles', 'product'],

        components:{GoogleProfilesDetails},

        data(){
            return{
                selectedStockItem:'Select',
                googleProfile:null,
                productStockItemsID:'',
                tab:''
            }
        },

        created() {

            if(this.foundGoogleProfiles.length > 0) {
                this.productStockItemsID = this.foundGoogleProfiles[0].attributes.product_stockitems_id
            }
        },

        watch:{

            async productStockItemID()
            {
                this.googleProfile = await googleProfileStore.getProfiles(this.productStockItemsID);
            },

            selectedStockItem(){
                this.getProductStockID();
                this.findProfile();
            },

            attachedStockItems(){
                if(this.attachedStockItems.length > 0) {
                    this.selectedStockItem = this.attachedStockItems[0].id;
                }
            },

            foundGoogleProfiles(){
                if(this.product.type === 'products') {
                    if (this.foundGoogleProfiles.length > 0) {
                        this.findProfile();
                    } else {
                        this.getProductStockID();
                    }
                }
            }
        },

        methods:{
            async findProfile(){
                this.googleProfile = null;

                this.googleProfile = await googleProfileStore.getProfiles(this.productStockItemsID);

                this.getProductStockID();
            },

            getProductStockID(){
              for(let a = 0; a < this.product.relationships.stockitems.data.length; a++){
                  if(this.product.attributes.allstockitems[a].stockitem_id.toString() === this.selectedStockItem.toString()){
                      this.productStockItemsID = this.product.attributes.allstockitems[a].product_stockitem_id;
                  }
              }
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>