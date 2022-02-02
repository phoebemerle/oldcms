<template>
    <div>
        <div>
            <a href="#!/inventory/stock-creation"><button class="btn btn-app btn-primary btn-lg">Create Inventory Item</button></a>
        </div>
        <inventory-list :page="page"/>
    </div>
</template>

<script>
    import {event} from '@/services';
    import InventoryList from '@/components/inventory/InventoryItems/InventoryList';
    import {inventoryStore} from '@/stores';

    export default {

        props:['page'],

        components: {InventoryList},

        data() {
            return {
                inventory:inventoryStore.state,
                userMessage:"",
                successful:false,
                error:false
            }
        },

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

    #userMessage{
        width:80%;
        margin:0.5rem auto;
        border-radius:0.5rem;
        text-align:center;
        font-size:1.8rem;
        padding:5px 0;
        color:#fff;
    }

    .inventory-view {
        flex: 1;
        display: flex;
        flex-direction: column;

        &__content {
            padding: 1rem;
            display: flex;
            flex: 1;
            flex-direction: column;
        }
    }
</style>