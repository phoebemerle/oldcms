<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Inventory</span>
        </page-header>
        <div class="main-sections__content">
            <inventory-home v-show="view ==='inventory-dashboard'" :pagenum="pagenum"/>
            <all-inventory v-show="view === 'view-all-inventory'" :page="pagenum"/>
            <inventory-main v-show="view === 'create-inventory' || view === 'edit-stock'" :view="view" :stockitem="item"/>
            <all-groups  v-show="view === 'view-all-groups'" :page="pagenum"/>
            <group-main v-show="view === 'create-group'  || view === 'edit-group'" :group="item" :type="view" ></group-main>
        </div>
    </section>
</template>

<script>
    import {event} from '@/services';
    import PageHeader from '@/components/shared/PageHeader';
    import InventoryHome from '@/components/inventory/InventoryItems/InventoryHome';
    import InventoryMain from '@/components/inventory/InventoryItems/InventoryMain';
    import AllInventory from '@/components/inventory/InventoryItems/InventoryAll';
    import AllGroups from '@/components/inventory/Groups/InventoryGroups';
    import GroupMain from '@/components/inventory/Groups/GroupMain';
    import DeliveryView from '@/components/inventory/deliverytypes/DeliveryTypeView'

    export default {
        components: {PageHeader, InventoryHome, InventoryMain, AllInventory, AllGroups, GroupMain, DeliveryView},

        props:['subview' , 'item', 'pagenum'],

        data:function() {
            return {
                view:this.subview,
            }
        },

        watch:{
            subview(){
                this.view = this.subview;
            }
        },

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";
</style>