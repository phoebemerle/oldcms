<template>
    <div class="list-table">
        <div class="col-sm-12 col-md-12 dataTables_filter searchBar">
            <label for="searchBar">Search</label>
            <input v-model="searchRequest" @input="searchItems()" class="form-control form-control-sm"  type="text">
            <div style="display: inline-block;font-size: 20px;margin-left: 12px;" @click="searchItems()">
                <i class="fas fa-search"></i>
            </div>
        </div>
        <table-list tableType="donations"
                    :headers="['Description', 'Spend Amount', 'Item No.', '']"
                    :data="['Desc1', 'SpendAmount', 'ItemNum']"
                    :edit="true"
                    :items="tableData"
                    link="#!/marketing/donations/edit/"
        />
    </div>
</template>

<script>
    import TableList from '@/components/shared/tableList';
    import {sharedStore} from '@/stores';
    import {donationStore} from '@/stores';



    export default {

        props: ['tableData'],

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
                if(this.searchRequest.length > 0) {
                    this.tableData.search = await donationStore.searchStore(this.searchRequest);
                } else {
                    this.tableData.search = this.tableData.donations
                }
                sharedStore.hideLoadingPage();
            },
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>