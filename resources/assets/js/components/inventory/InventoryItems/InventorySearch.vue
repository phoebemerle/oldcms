<template>
    <div class="search-container">
        <h3>Search for a stock item</h3>
        <div>
            <label>Search by Product Code or Description</label>
            <input class="searchInput" @input="search()" v-model="searchString" type="text">
            <div style="display: inline-block;font-size: 20px;margin-left: 12px;" @click="searchItems()">
                <i class="fas fa-search"></i>
            </div>
        </div>

        <div class="search-container__section">
            <table class="search-container__table">
                <tr>
                    <th class="search-container__table__heading__code" >Product Code</th>
                    <th class="search-container__table__heading__desc">Description</th>
                    <th class="search-container__table__heading__type" v-if="type === 'bom'">Product Type</th>
                </tr>
                <tr v-for="(result, key) in searchResults.search" :key="key">
                    <td class="search-container__table__data__code">{{result.attributes.code}}</td>
                    <td class="search-container__table__data__desc">{{result.attributes.description}}</td>
                    <td class="search-container__table__data__type" v-if="type === 'bom'">{{result.attributes.type}}</td>
                    <td class="search-container__table__data__action"> <span @click="addProduct(key)" class="search-container__table__add">Attach</span></td>
                </tr>
                <tr class="noSearchResults" v-show="searchResults.search.length < 1">
                    <td colspan="4">Sorry, no search results were found, please try again</td>
                </tr>
            </table>
        </div>
        <p id="searchResults">Results found: {{searchResults.search.length}}</p>
                <div v-show="searchResults.search.length > 0">
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import {event} from '@/services';
    import {inventoryStore} from '@/stores';

    export default {

        props: ['selectedproducts', 'type'],

        data:function() {
            return {
                searchString: '',
                searchResults: {
                    search: []
                },
                selectedProducts:[],
            }
        },

        created()
        {
            this.search = _.debounce(this.search, 500);

            event.on(event.names.INVENTORY_PAGINATION, async (view) => {
                if(this.type === 'promotionTarget') {
                    if(inventoryStore.state.inventory['page_1']) {
                        this.searchResults.search = await inventoryStore.state.inventory['page_1'];
                    }
                }
            })
        },

        methods:{
            async search(){            
                this.searchResults.search = await inventoryStore.searchStore(this.searchString, this.pageNum);
            },

            async addProduct(key){
                await event.emit(event.names.UPDATE_SELECTED, this.searchResults.search[key], this.type, 'add');
                this.searchResults.search.splice(key, 1);
            },

        }

    }
</script>

<style lang="scss">
    @import '~#/mixins';

</style>