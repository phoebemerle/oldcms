<template>
    <div class="main-sections__editForm">
        <div class="overviewTabs">
            <ul class="list-inline" style="margin-bottom:0;">
                <li v-bind:class="{ activeTab: tab === 'details' }" @click="changeTab('details')">Group Details</li>
                <li v-show="type === 'edit-group'" v-bind:class="{ activeTab: tab === 'associated' }" @click="changeTab('associated')">Associated Stock Items</li>
            </ul>
        </div>
        <div class="main-sections__editForm__container">
            <group-details v-show="tab === 'details'" :group="group" :type="type"/>
            <associated-inventory v-show="tab === 'associated'" :group="group" :type="type"/>
        </div>
    </div>
</template>

<script>
    import {productGroupsStore} from '@/stores';
    import GroupDetails from '@/components/inventory/Groups/GroupDetails';
    import AssociatedInventory from '@/components/inventory/Groups/AssociatedInventory';
    import {event} from '@/services';

    export default {
        components: {GroupDetails, AssociatedInventory},

        name: "GroupMain",

        props:['group','type'],

        data(){
            return{
                tab:'details'
            }
        },

        methods:{
            changeTab(tab){
                this.tab = tab;
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>