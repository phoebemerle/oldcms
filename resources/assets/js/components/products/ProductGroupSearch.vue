<template>
    <div class="search-container">
        <h3>Search for a Product Group</h3>
        <div>
            <label>Search by Group Name</label>
            <input class="searchInput" @input="search()" v-model="searchString" type="text">
        </div>
        <div class="search-container__section">
            <table class="search-container__table" id="productSearchTable">
                <tr>
                    <th class="search-container__table__heading__title" >Name</th>
                    <th class="search-container__table__heading__title" style="width: 20%;">Code</th>
                    <th class="search-container__table__heading__title" style="width: 20%;">Sage ID</th>
                    <th></th>
                </tr>
                <tr v-for="(result, key) in searchResults.search" :key="key">
                    <td class="search-container__table__data__title">{{result.attributes.name}}</td>
                    <td class="search-container__table__data__title" style="width: 20%;" >{{result.attributes.code}}</td>
                    <td class="search-container__table__data__title" style="width: 20%;" >{{result.attributes.sage_id}}</td>
                    <td class="search-container__table__data__action"> <span @click="addGroup(result)" class="search-container__table__add">Attach</span></td>
                </tr>
                <tr class="noSearchResults" v-show="searchResults.search.length < 1">
                    <td colspan="4">Sorry, no search results were found, please try again</td>
                </tr>
            </table>
        </div>
        <div v-show="searchResults.search.length > 0">
            <br>
            <a v-if="pageNum > 1" @click="goBack()"><button>Previous Page</button></a>
            <a v-if="next" @click="goForward()"><button>Next Page</button></a>
        </div>
    </div>
</template>

<script>
    import {productGroupsStore} from '@/stores';
    import {event} from '@/services';

    export default {
        name: "ProductGroupSearch",

        props:['type'],

        data(){
            return{
                next:false,
                searchString:'',
                searchResults: {
                    search:[]
                },
                tab:'',
                pageNum:1
            }
        },

        watch: {
            async tab() {

                if(productGroupsStore.state.productGroups['page_1']) {
                    this.searchResults.search = await productGroupsStore.state.productGroups['page_1'];
                }

                if(this.searchResults.search.length < 50) {
                    this.next = false;
                } else {
                    this.next = true;
                }
            }
        },

        async created()
        {
            event.on('tab', (tab) => {
                this.tab = tab;
            })

            if(productGroupsStore.state.productGroups['page_1']) {
                this.searchResults.search = await productGroupsStore.state.productGroups['page_1'];
            }

            if(this.searchResults.search.length < 50) {
                this.next = false;
            } else {
                this.next = true;
            }
            this.searchResults.search = this.searchResults.search.filter(row => row.id !== this.product.id);
        },

        methods:{
            async goForward() {
                this.pageNum = this.pageNum+1;
                this.searchResults.search = await productGroupsStore.changePage(this.pageNum);
            },
            async goBack() {
                this.pageNum = this.pageNum-1
                this.searchResults.search = await productGroupsStore.changePage(this.pageNum);
            },
            async search(){
                this.searchResults.search = await productGroupsStore.searchStore(this.searchString, this.pageNum);
            },

            addGroup(result){
                if(this.type === 'promotionTarget'){
                    event.emit(event.names.UPDATE_SELECTED, result, this.type);
                }else if(this.type === 'attachToHomePromo'){
                    event.emit(event.names.UPDATE_HOMEPROMO, result);
                }
                else if(this.type === 'attachRelatedProduct'){
                    event.emit(event.names.UPDATE_RELATED_PRODUCT, result);
                    var index = this.searchResults.search.indexOf(result);
                    productStore.state.search.splice(index, 1)
                }
                else if(this.type === 'attachCostEffective'){
                    event.emit(event.names.UPDATE_COSTEFFECTIVE_PRODUCT, result);
                }
                else if(this.type === 'attachToSash'){
                    event.emit(event.names.UPDATE_ATTACHED_PRODUCTS, result);
                }
                else {
                    event.emit(event.names.UPDATE_ATTACHED_SELECTION, result);
                }
            },
        }
    }
</script>


<style lang="scss">
    @import '~#/mixins';

    #productSearchTable td{
        white-space: nowrap;
        text-overflow: ellipsis;
    }

</style>