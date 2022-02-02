<template>
    <div>
        <div>
            <a href="#!/productsashes/create">
                <button class="btn btn-app btn-primary btn-lg">Create a new Product Sash</button>
            </a>
        </div>
        <div class="col-sm-12 col-md-12 dataTables_filter searchBar">
            <label for="searchBar">Search</label>
            <input v-model="searchRequest" @input="searchItems()" class="form-control form-control-sm"  type="text">
            <div style="display: inline-block;font-size: 20px;margin-left: 12px;" @click="searchItems()">
                <i class="fas fa-search"></i>
            </div>
        </div>
        <div class="list-table">
            <table-list tableType="productsashes"
                        :headers="['Name', '']"
                        :data="['title']"
                        :edit="true"
                        :items="tableData"
                        link="#!/productsashes/edit/"
            />
        </div>
    </div>
</template>

<script>
    import TableList from '@/components/shared/tableList';
    import {productSashesStore} from '@/stores';
    import {sharedStore} from '@/stores';

    export default {
        name: "ProductSashesList",

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

            this.tableData.search = await productSashesStore.checkLoading();

            sharedStore.hideLoadingPage();
        },

        methods: {



            async searchItems() {

                this.tableData.search = await productSashesStore.searchStore(this.searchRequest);
                sharedStore.hideLoadingPage();

            },
        }

        

    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>