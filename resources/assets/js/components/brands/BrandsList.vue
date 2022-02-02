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
            <table-list tableType="brands"
                        :headers="['Name', '']"
                        :data="['name']"
                        :edit="true"
                        :items="tableData"
                        :page="page"
                        link="#!/brands/edit/"
            />
        </div>
    </div>
</template>

<script>

    import TableList from '@/components/shared/tableList';
    import {brandsStore, sharedStore} from '@/stores';

    export default {

        props:['page'],

        name: "BrandsList",

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

                this.tableData.search = await brandsStore.searchStore(this.searchRequest);
                sharedStore.hideLoadingPage();

            },
        }
    }
</script>

<style scoped>

</style>