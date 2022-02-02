<template>
        <div class="search-container">
            <h3>Search for a supplier</h3>
            <div>
                <input class="searchInput" @input="searchSupplier()" v-model="supplierSearch" type="text">
            </div>
            <div class="search-container__section">
                <table class="search-container__table">
                    <tr>
                        <th class="search-container__table__heading__supplierName">Supplier Name </th>
                        <th></th>
                    </tr>
                    <tr v-for="(result, key) in supplierResults.search" >
                        <td class="search-container__table__data__supplierName">{{result.attributes.name}}</td>
                        <td class="search-container__table__data__addSupplier"> <span @click="addSupplier(key)" class="search-container__table__add">Add Supplier</span></td>
                    </tr>
                    <tr class="noSearchResults" v-show="supplierResults.search.length < 1">
                        <td colspan="4">Sorry, no search results were found, please try again</td>
                    </tr>
                </table>
            </div>
            <p id="searchResults">Results found: {{supplierResults.search.length}}</p>
        </div>
</template>

<script>

    import _ from 'lodash';
    import {event} from '@/services';
    import {supplierStore} from '@/stores';

    export default {

        props:['selectedSuppliers', 'suppliers'],

        data(){
            return{
                supplierSearch:'',
                supplierResults:supplierStore.state,
                type: 'Supplier'
            }
        },

        created() {
            this.searchSupplier = _.debounce(this.searchSupplier, 500);
        },

        watch:{
            suppliers(){
                supplierStore.checkSearch(this.suppliers);
            }
        },

        methods:{
            searchSupplier(){
                supplierStore.searchSuppliers(this.supplierSearch, this.suppliers);
            },

            addSupplier(key){
                if(this.selectedSuppliers.filter(row => row.relationships.supplier.data.id.toString() === this.supplierResults.search[key].id.toString()).length === 0) {
                    event.emit(event.names.UPDATE_SELECTED, this.supplierResults.search[key], this.type);
                } else {
                    return event.emit(event.names.USER_MESSAGE, 'Supplier already attached!', 'error');
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