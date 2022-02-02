<template>
    <div class="list-table">
        <div class="col-sm-12 col-md-12 dataTables_filter searchBar">
            <label for="searchBar">Search</label>
            <input v-model="searchRequest" @input="searchItems()" class="form-control form-control-sm"  type="text">
            <div style="display: inline-block;font-size: 20px;margin-left: 12px;" @click="searchItems()">
                <i class="fas fa-search"></i>
            </div>
        </div>
        <table-list 
            tableType="deliverytypes"
            :headers="['Description', 'Delivery Code', '']"
            :data="['description', 'delivery_code']"
            :edit="true"
            :items="tableData"
            link="#!/delivery-types/edit/"
        />
    </div>
</template>

<script>
import TableList from '@/components/shared/tableList';
import {deliveryTypeStore} from '@/stores';
import {sharedStore} from '@/stores';
export default {

    props: ['tableData'],

    name: "DeliveryTypeList",

    components:{TableList},

    data() {
        return {
            searchRequest:'',
        }
    },

    mounted()
    {
        this.searchItems = _.debounce(this.searchItems, 500);
    },
    methods: {

        async searchItems() {

            this.tableData.search = await deliveryTypeStore.searchStore(this.searchRequest);
            sharedStore.hideLoadingPage();

        },
    }
}
</script>

<style lang="scss">
    @import "~#/variables";
</style>
