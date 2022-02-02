<template>
        <div class="search-container">
            <h3>Search for a Badge</h3>
            <div>
                <input class="searchInput" @input="searchBadges()" v-model="productBadgesSearch" type="text">
            </div>
            <div class="search-container__section">
                <table class="search-container__table">
                    <tr>
                        <th class="search-container__table__heading__supplierName">Product Badges Name </th>
                        <th></th>
                    </tr>
                    <tr v-for="(result, key) in productBadges.search" :key="key">
                        <td class="search-container__table__data__supplierName">{{result.attributes.description}}</td>
                        <td class="search-container__table__data__addSupplier"> <span @click="addBadge(key)" class="search-container__table__add">Add Badge</span></td>
                    </tr>
                    <tr class="noSearchResults" v-show="productBadges.search.length < 1">
                        <td colspan="4">Sorry, no search results were found, please try again</td>
                    </tr>
                </table>
            </div>
            <p id="searchResults">Results found: {{productBadges.search.length}}</p>
        </div>
</template>

<script>

    import _ from 'lodash';
    import {event} from '@/services';
    import {productBadgesStore} from '@/stores';

    export default {

        props:['selectedBadges', 'productBadges'],

        data(){
            return{
                productBadgesSearch:'',
                type: 'badge'
            }
        },

        methods:{
            searchBadges(){
                productBadgesStore.searchStore(this.productBadgesSearch);
            },

            addBadge(key){
                if(this.selectedBadges.filter(row => row.id.toString() === this.productBadges.search[key].id.toString()).length === 0) {
                    event.emit(event.names.UPDATE_SELECTED, this.productBadges.search[key], this.type, 'add');
                } else {
                    return event.emit(event.names.USER_MESSAGE, 'Badge already attached!', 'error');
                }
            }

        }
    }
</script>

<style lang="scss">
    @import '~#/mixins';

    .search-container__table__data__addSupplier{
        cursor:pointer;
    }
</style>