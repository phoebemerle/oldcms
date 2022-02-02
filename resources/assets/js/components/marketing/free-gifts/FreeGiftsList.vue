<template>
    <div class="list-table">
        <div class="col-sm-12 col-md-12 dataTables_filter searchBar">
            <label for="searchBar">Search</label>
            <input v-model="searchRequest" @input="searchItems()" class="form-control form-control-sm"  type="text">
            <div style="display: inline-block;font-size: 20px;margin-left: 12px;" @click="searchItems()">
                <i class="fas fa-search"></i>
            </div>
        </div>
        <table-list tableType="free-gifts"
                    :headers="['Name', 'Description', 'DP Value', 'Gift Number', 'Image Title', 'Alt Tag', '']"
                    :data="['Name', 'Description', 'DP_Value', 'Gift_number', 'title', 'alt_tag']"
                    :edit="true"
                    :items="tableData"
                    link="#!/marketing/free-gifts/edit/"
        />
    </div>
</template>

<script>
    import TableList from '@/components/shared/tableList';
    import {sharedStore} from '@/stores';
    import {freeGiftStore} from '@/stores';



    export default {

        components:{TableList},

        props: ['tableData'],

        data() {
            return {
                searchRequest:'',
            }
        },

        mounted()
        {
            this.searchItems = _.debounce(this.searchItems, 500);
        },
        methods: {

            async searchItems() {
                // this.tableData.search = await freeGiftStore.searchStore(this.searchRequest);
                sharedStore.hideLoadingPage();

            },
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>