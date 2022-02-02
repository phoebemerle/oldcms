<template>
    <div class="search-container">
        <h3>Search for a Brand</h3>
        <div>
            <label>Search by Brand Name</label>
            <input class="searchInput" @input="search()" v-model="searchString" type="text">
        </div>
        <div class="search-container__section">
            <table class="search-container__table" id="CategorySearchTable">
                <tr>
                    <th class="search-container__table__heading__title" >Name</th>
                    <th></th>
                </tr>
                <tr v-for="(result, index) in searchResults.search" :key="index">
                  ≈ <td class="search-container__table__data__title">{{result.attributes.name}}</td>
                    <td class="search-container__table__data__action"> <span @click="addCategory(result)" class="search-container__table__add">Attach</span></td>
                </tr>
                <tr class="noSearchResults" v-show="searchResults.search.length < 1">
                    <td colspan="4">Sorry, no search results were found, please try again</td>
                </tr>
            </table>
        </div>
        <div v-show="searchResults.search.length > 0">
            <br>
            <a v-show="pageNum > 1" @click="goBack()"><button>Previous Page</button></a>
            <a v-show="next" @click="goForward()"><button>Next Page</button></a>
        </div>
    </div>
</template>

<script>
    import {brandsStore} from '@/stores';
    import {event} from '@/services';

    export default {

        props:['type', 'attachedTargets'],

        data(){
            return{
                next:false,
                searchString:'',
                searchResults:{
                    search:[]
                },
                tab:'',
                pageNum:1
            }
        },

        async created()
        {
            event.on('tab', (tab) => {
                this.tab = tab;
            })

            if(this.attachedTargets)
            {
                for(let o = 0; o < this.attachedTargets.length; o++) {
                    this.searchResults.search = this.searchResults.search.filter(row => row.id !== this.attachedTargets[o].id);
                }
            }

            event.on(event.names.UPDATE_NAVIGATION_VIEW, async (view) => {
                if(this.type === 'promotionTarget') {
                    if(brandsStore.state.brands['page_1']) {
                        this.searchResults.search = await brandsStore.state.brands['page_1'];
                    }

                    if(this.searchResults.search.length < 50) {
                        this.next = false;
                    } else {
                        this.next = true;
                    }
                }
            })
        },

        watch: {
            async attachedTargets()
             {
                this.searchResults.search = brandsStore.state.brands['page_1'];
                if(this.searchResults.search.length < 50) {
                    this.next = false;
                } else {
                    this.next = true;
                }
                for(let o = 0; o < this.attachedTargets.length; o++) {
                    this.searchResults.search = this.searchResults.search.filter(row => row.id !== this.attachedTargets[o].id);
                }
              }
        },

        methods:{
            async search(){
                this.searchResults.search = await productStore.searchStore(this.searchString, this.pageNum);
            },

            addCategory(result){
                if(this.type === 'promotionTarget'){
                    event.emit(event.names.UPDATE_SELECTED, result, this.type);
                }else if(this.type === 'featuredBrands'){
                    event.emit(event.names.ADD_FEATURED, result, 'fBrands');
                }else {
                    event.emit(event.names.UPDATE_ATTACHED_SELECTION, result);
                }
            },
            async goForward() {
                this.pageNum = this.pageNum+1
                this.searchResults.search = await brandsStore.changePage(this.pageNum);
                 for(let o = 0; o < this.attachedTargets.length; o++) {
                    this.searchResults.search = this.searchResults.search.filter(row => row.id !== this.attachedTargets[o].id);
                }
            },
            async goBack() {
                this.pageNum = this.pageNum-1
                this.searchResults.search = await brandsStore.changePage(this.pageNum);
                 for(let o = 0; o < this.attachedTargets.length; o++) {
                    this.searchResults.search = this.searchResults.search.filter(row => row.id !== this.attachedTargets[o].id);
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
