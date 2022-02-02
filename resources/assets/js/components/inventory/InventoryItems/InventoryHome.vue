<template>
    <div class="homeView">
        <div class="row">
            <div class="col-lg-3 col-xs-6">
                <div class="small-box bg-info">
                    <div class="inner">
                        <h3>{{inventory.inventory.length}}</h3>
                        <p>Total Inventory Items</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-xs-6">
                <div class="small-box bg-success">
                    <div class="inner">
                        <h3>{{activeInventory}}</h3>
                        <p>Active Inventory Items</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-xs-6">
                <div class="small-box bg-danger">
                    <div class="inner">
                        <h3>{{inactiveInventory}}</h3>
                        <p>Inactive Inventory Items</p>
                    </div>
                </div>
            </div>
        </div>

        <inventory-list :page="pagenum"/>
    </div>
</template>

<script>
    import {http} from '@/services';
    import {inventoryStore} from '@/stores';
    import InventoryList from '@/components/inventory/InventoryItems/InventoryList'

    export default {

        props:['pagenum'],

        components: {InventoryList},

        data() {
            return {
                inventory:inventoryStore.state,
            }
        },

        computed: {
            activeInventory: function () {
                let activeInventory = 0;

                for (let a = 0; a < this.inventory.inventory.length; a++) {
                    if (this.inventory.inventory[a].attributes.active === 1) {

                        activeInventory ++;
                    }
                }
                return activeInventory;
            },

            inactiveInventory: function(){
                let inactiveInventory = 0;

                for (let a = 0; a < this.inventory.inventory.length; a++) {
                    if (this.inventory.inventory[a].attributes.active === 0) {

                        inactiveInventory ++;
                    }
                }
                return inactiveInventory;
            }
        },
    }
</script>

<style lang="scss">
    @import "~#/variables";
</style>