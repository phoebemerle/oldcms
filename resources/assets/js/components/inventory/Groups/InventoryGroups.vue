<template>
    <div class="list-table">
        <div>
            <a href="#!/groups/create"><button class="btn btn-app btn-primary btn-lg">Create a new Group</button></a>
        </div>
        <div class="col-sm-12 col-md-12 dataTables_filter searchBar">
            <label for="searchBar">Search</label>
            <input v-model="searchRequest" @input="searchItems()" class="form-control form-control-sm"  type="text">
            <div style="display: inline-block;font-size: 20px;margin-left: 12px;" @click="searchItems()">
                <i class="fas fa-search"></i>
            </div>
        </div>
        <div>
            <table-list tableType="groups"
                        :headers="['Group Name', 'Group code', '']"
                        :data="['name','code']"
                        :edit="true"
                        :items="tableData"
                        :page="page"
                        link="#!/groups/edit/"
            />
        </div>
    </div>
</template>

<script>
    import TableList from '@/components/shared/tableList';
    import {productGroupsStore} from '@/stores';
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

            this.searchItems = _.debounce(this.searchItems, 500);

        },
        methods: {

            async searchItems() {

                this.tableData.search = await productGroupsStore.searchStore(this.searchRequest);
                sharedStore.hideLoadingPage();

            },
        }


    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";


</style>