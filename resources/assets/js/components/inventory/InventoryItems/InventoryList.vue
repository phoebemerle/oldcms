<template>
    <div>
        <div class="list-table">
            <div class="col-sm-12 col-md-12 dataTables_filter searchBar">
                <label for="searchBar">Search</label>
                <input v-model="searchRequest" @input="searchItems()" class="form-control form-control-sm"  type="text">
                <div style="display: inline-block;font-size: 20px;margin-left: 12px;" @click="searchItems()">
                    <i class="fas fa-search"></i>
                </div>
            </div>
            <table-list tableType="inventory"
                        :headers="['Stock Code', 'Description', '']"
                        :data="['code','description']"
                        :edit="true"
                        :items="tableData"
                        :page="page"
                        link="#!/inventory/edit/"
            />
        </div>
    </div>
</template>

<script>
    import TableList from '@/components/shared/tableList';
    import {inventoryStore} from '@/stores';
    import {event} from '@/services';
    import {sharedStore} from '@/stores';


    export default {

        props:['page'],

        components:{TableList},

        data() {
            return {
                tableData:{
                    search:[]
                },
                searchRequest:'',
            }
        },

        mounted()
        {
            event.on(event.names.UPDATE_NAVIGATION_VIEW, (view) => {
                this.view = view
            })

            this.searchItems = _.debounce(this.searchItems, 500);

        },
        methods: {

            async searchItems() {

                this.tableData.search = await inventoryStore.searchStore(this.searchRequest);
                sharedStore.hideLoadingPage();

            },
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>