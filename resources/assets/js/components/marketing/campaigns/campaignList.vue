<template>
    <div>
        <div>
            <a href="#!/marketing/campaigns/create"><button class="btn btn-app btn-primary btn-lg">Create Campaign</button></a>
        </div>

        <div class="col-sm-12 col-md-12 dataTables_filter searchBar">
            <label for="searchBar">Search</label>
            <input v-model="searchRequest" @input="searchItems()" class="form-control form-control-sm"  type="text">
            <div style="display: inline-block;font-size: 20px;margin-left: 12px;" @click="searchItems()">
                <i class="fas fa-search"></i>
            </div>
        </div>
        <div class="list-table">
            <table-list
                    tableType="campaigns"
                    :headers="['title', 'Start date', 'End date', '']"
                    :data="['title','start_date', 'end_date']"
                    :edit="true"
                    :items="tableData"
                    :page="page"
                    link="#!/marketing/campaign/edit/"
            />
        </div>
    </div>
</template>

<script>
    import TableList from '@/components/shared/tableList';
    import {campaignStore} from '@/stores';
    import {event} from '@/services';

    export default {
        components:{TableList},

        props:['page'],

        data() {
            return {
                tableData:{
                    search: []
                },
                searchRequest:'',
            }
        },

        mounted()
        {
            this.searchItems = _.debounce(this.searchItems, 500);

            event.on(event.names.CAMPAIGN_PAGINATION, async (view) => {
                    if(campaignStore.state.campaigns['page_1']) {
                        this.tableData.search = await campaignStore.state.campaigns['page_1'];
                    }
            })
        },
        methods: {

            async searchItems() {

                this.tableData.search = await campaignStore.searchStore(this.searchRequest);
                sharedStore.hideLoadingPage();

            },
        },

        watch: {
            item()
            {
                this.tableData.search = this.item
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>