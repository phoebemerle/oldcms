<template>
    <div class="list-table">
        <div class="col-sm-12 col-md-12 dataTables_filter searchBar">
            <label for="searchBar">Search</label>
            <input v-model="searchRequest" @input="searchItems()" class="form-control form-control-sm"  type="text">
            <div style="display: inline-block;font-size: 20px;margin-left: 12px;" @click="searchItems()">
                <i class="fas fa-search"></i>
            </div>
        </div>
        <table-list tableType="stock-availability"
                    :headers="['Availability', '']"
                    :data="['availability']"
                    :edit="true"
                    :items="tableData"
                    link="#!/stock-availability/edit/"
        />
    </div>
</template>

<script>
    import TableList from '@/components/shared/tableList';
    import {sharedStore} from '@/stores';
    import {deliveryTypeStore} from '@/stores';


    export default {

        components:{TableList},

        data(){
            return{
                tableData:{
                    search:[]
                },
                searchRequest:''
            }
        },

        async created(){
            this.searchItems = _.debounce(this.searchItems, 500);
            // this.tableData.search = await deliveryTypeStore.searchStore();

            sharedStore.hideLoadingPage();
        },

        methods: {

            async searchItems() {

                this.tableData.search = await productBadgesStore.searchStore(this.searchRequest);
                sharedStore.hideLoadingPage();

            },
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>