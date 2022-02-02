<template>
    <div class="search-container">
        <h3>Search for a Product</h3>
        <div>
            <div>
                <label>Search by Product Title</label>
                <input class="searchInput" @input="search()" v-model="searchString" type="text"/>
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
        <div class="search-container__section">
            <table class="search-container__table" id="productSearchTable">
                <tr>
                    <th class="search-container__table__heading__title" >Product Code</th>
                    <th class="search-container__table__heading__title" >Title</th>
                    <th></th>
                </tr>
                <tr v-for="(result, key) in searchResults.search" :key="key">
                    <td class="search-container__table__data__title">{{result.attributes.allstockitems[0].code}}</td>
                    <td class="search-container__table__data__title">{{result.attributes.title}}</td>
                    <td class="search-container__table__data__action"> <span @click="addProduct(result)" class="search-container__table__add">Attach</span></td>
                </tr>
                <tr class="noSearchResults" v-show="searchResults.search.length < 1">
                    <td colspan="4">Sorry, no search results were found, please try again</td>
                </tr>
            </table>
        </div>
        <p id="searchResults">Results found: {{searchResults.search.length}}</p>
    </div>
</template>

<script>
    import {productStore} from '@/stores';
    import {event} from '@/services';
    import {sharedStore} from '@/stores';
    import Vue from 'vue';

    export default {
        name: "ProductSearch",

        props:['type', 'product'],

        data(){
            return{
                next:false,
                searchString:'',
                searchResults: {
                    search:[]
                },
                searchType:'title'
            }
        },

        created() {
            this.search = _.debounce(this.search, 1000);

            event.on(event.names.PRODUCT_PAGINATION, async (view) => {
                if(this.type === 'promotionTarget') {
                    if(productStore.state.products['page_1']) {
                        this.searchResults.search = await productStore.state.products['page_1'];
                    }
                }
            })
        },

        methods:{
            async search(){
                this.searchResults.search = await productStore.searchStore(this.searchString, this.searchType);
                sharedStore.hideLoadingPage();

            },

            addProduct(result){
                let index = '';
                if(this.type === 'promotionTarget'){
                    event.emit(event.names.UPDATE_SELECTED, result, this.type);
                }else if(this.type === 'attachToHomePromo'){
                    event.emit(event.names.UPDATE_HOMEPROMO, result);
                }
                else if(this.type === 'attachRelatedProduct'){
                    event.emit(event.names.UPDATE_RELATED_PRODUCT, result);
                    index = this.searchResults.search.indexOf(result);
                    productStore.state.search.splice(index, 1)
                }
                else if(this.type === 'attachProductLicence'){
                    event.emit(event.names.UPDATE_PRODUCT_LICENCE, result);
                    index = this.searchResults.search.indexOf(result);
                    productStore.state.search.splice(index, 1)
                }
                else if(this.type === 'attachCostEffective'){
                    event.emit(event.names.UPDATE_COSTEFFECTIVE_PRODUCT, result);
                }
                else if(this.type === 'attachToSash'){
                    event.emit(event.names.UPDATE_ATTACHED_PRODUCTS, result);
                }
                else if(this.type === 'attachToFinder'){
                    event.emit(event.names.UPDATE_FINDER_PRODUCTS, result);
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