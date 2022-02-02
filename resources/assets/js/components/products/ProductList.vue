<template>
    <div>
        <div id="searchContainer">
            <div class="col-sm-12 col-md-12 dataTables_filter searchBar">
                <label for="searchBar">Search</label>
                <input v-model="searchRequest" @input="searchItems()" class="form-control form-control-sm"  type="text">
                <div style="display: inline-block;font-size: 20px;margin-left: 12px;" @click="searchItems()">
                    <i class="fas fa-search"></i>
                </div>
            </div>
            <div class="search-filter col-sm-12 col-md-12 dataTables_filter " >
                <div>
                    <label>Product Title</label>
                    <input type="radio" id="title" value="title" v-model="searchType"/>
                </div>
                <div>
                    <label>Stock Item Code</label>
                    <input type="radio" id="code" value="code" v-model="searchType"/>
                </div>
            </div>
        </div>
        <div class="list-table">
            <table-list tableType="products"
                        :headers="['Title', '']"
                        :data="['title']"
                        :items="tableData"
                        :edit="true"
                        :page="page"
                        link="#!/products/edit/"
            />
        </div>
    </div>
</template>

<script>
    import TableList from '@/components/shared/tableList';
    import {inventoryStore} from '@/stores';
    import {productStore} from '@/stores';
    import {productGroupsStore} from '@/stores';
    import {categoryStore} from '@/stores';
    import {campaignStore} from '@/stores';
    import {brandsStore} from '@/stores';
    import {productBadgesStore} from '@/stores';
    import {productSashesStore} from '@/stores';
    import {freeGiftStore} from '@/stores';
    import {deliveryTypeStore} from '@/stores';
    import {stockAvailabilityStore} from '@/stores';
    import {attributeTypeStore} from '@/stores';
    import {templateStore} from '@/stores';
    import {event} from '@/services';
    import {sharedStore} from '@/stores';
    export default {

        props:['page'],

        components:{TableList},

        data(){
            return{
                numberOfPages:productStore.state.pagination,
                next:true,
                previous: true,
                nextPage:'',
                previousPage:'',
                tableData:{
                    search:[]
                },
                searchType:'title',
                view:'',
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

                    this.tableData.search = await productStore.searchStore(this.searchRequest, this.searchType);
                    sharedStore.hideLoadingPage();

            },
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>