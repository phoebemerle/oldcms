<template>
    <div class="search-container">
        <h3>Search for a Category</h3>
        <div>
            <label>Search by Category Title</label>
            <input class="searchInput" @input="search()" v-model="searchString" type="text">
            <select v-model="activeFilter">
                <option value="2">All</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
            </select>
            <div style="display: inline-block;font-size: 20px;margin-left: 12px;" @click="search()">
                <i class="fas fa-search"></i>
            </div>
        </div>
        <div class="search-container__section">
            <table class="search-container__table" id="CategorySearchTable">
                <tr>
                    <th class="search-container__table__heading__title" >Title</th>
                    <th class="search-container__table__heading__overview">Contains</th>
                    <th class="search-container__table__heading__active">Active</th>
                    <th class="search-container__table__heading__attach">Attach</th>
                </tr>
                <tr v-for="(result, key) in searchResults.search" :key="key">
                    <td class="search-container__table__data__title">{{result.attributes.title}}</td>
                    <td class="search-container__table__data__overview">{{result.attributes.attached_type}}</td>
                    <td class="search-container__table__data__active">{{result.attributes.active}}</td>
                    <td class="search-container__table__data__action"> <span @click="addCategory(result)" class="search-container__table__add">Attach</span></td>
                </tr>
                <tr class="noSearchResults" v-show="searchResults.search.length < 1">
                    <td colspan="4">Sorry, no search results were found, please try again</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    import {categoryStore} from '@/stores';
    import {event} from '@/services';

    export default {

        props:['type', 'category'],

        data(){
            return{
                searchString:'',
                searchResults:{
                    search:[]
                },
                next: false,
                previous: false,
                pageNum:1,
                activeFilter:2
            }
        },

        created()
        {
            this.search = _.debounce(this.search, 2000);

            event.on(event.names.UPDATE_NAVIGATION_VIEW, async (view) => {
                if(this.type === 'promotionTarget') {
                    if(categoryStore.state.categories['page_1']) {
                        this.searchResults.search = await categoryStore.state.categories['page_1'];
                    }
                }
            })
        },

        watch: {
            async category() {
                this.searchResults.search = this.searchResults.search.filter(row => row.id !== this.category.id);
            },
        },

        methods:{
            async search(){
                this.searchResults.search = await categoryStore.searchStore(this.searchString, this.activeFilter);
            },

            addCategory(result){
                if(this.type === 'promotionTarget'){
                    event.emit(event.names.UPDATE_SELECTED, result, this.type);
                }else if(this.type === 'attachedToCategory'){
                    event.emit(event.names.UPDATE_ATTACHED_SELECTION, result);
                }else if(this.type === 'featuredCategories'){
                    event.emit(event.names.UPDATE_FEATURED_CATEGORIES, result);
                }else if(this.type === 'navigationOrder'){
                    event.emit(event.names.UPDATE_NAVIGATION_CATEGORIES, result);
                }else if(this.type === 'attachOtherRanges'){
                    event.emit(event.names.UPDATE_ATTACHED_RANGES, result);
                }else if (this.type === 'attachToFinder'){
                    event.emit(event.names.UPDATE_FINDER_CATEGORY, result);
                }
            }
        }
    }
</script>


<style lang="scss">
    @import '~#/mixins';

    #productSearchTable td{
        white-space: nowrap;
        text-overflow: ellipsis;
    }


    .search-container__table__heading__title{
        width: 30%
    }

    .search-container__table__data__title{
        width: 30%
    }

    .search-container__table__heading__overview {
        width: 30%
    }

    .search-container__table__data__overview {
        width: 30%
    }

    .search-container__table__heading__active {
        width: 20%
    }

    .search-container__table__data__active {
        width: 20%
    }

    .search-container__table__heading__attach {
        width: 15%
    }

    .search-container__table__data__attach {
        width: 15%
    }
</style>