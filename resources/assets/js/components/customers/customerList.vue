<template>
        <div class="list-table">
            <div class="col-sm-12 col-md-12 dataTables_filter searchBar">
                <label for="searchBar">Search</label>
                <input v-model="searchRequest" @input="searchItems()" class="form-control form-control-sm"  type="text">
                <div style="display: inline-block;font-size: 20px;margin-left: 12px;" @click="searchItems()">
                    <i class="fas fa-search"></i>
                </div>
            </div>
                <div class="search-filter col-sm-12 col-md-12 dataTables_filter " >
                    <div class="search-filter-section">
                        <label>Account Number</label>
                        <input type="radio" id="accountNumber" value="AccountNumber" v-model="searchType"/>
                    </div>
                    <div class="search-filter-section">
                        <label>Email</label>
                        <input type="radio" id="email" value="email" v-model="searchType"/>
                    </div>
                    <div class="search-filter-section">
                        <label>Company Name</label>
                        <input type="radio" id="companyName" value="Company" v-model="searchType"/>
                    </div>
                </div>

            <table-list tableType="customers"
                        :headers="['Account Number', 'Email', 'Full Name', 'Company', '']"
                        :data="['AccountNumber','Email','ContactName', 'Company']"
                        :edit="true"
                        :items="tableData"
                        link="#!/customer/accounts/edit/"
            />
        </div>
</template>

<script>
    import TableList from '@/components/shared/tableList';
    import {event} from '@/services';
    import {sharedStore} from '@/stores';
    import {customerStore} from '@/stores';


    export default {

        components:{TableList},

        data() {
            return {
                tableData:{
                    search:[]
                },
                searchRequest:'',
                searchType:'AccountNumber'
            }
        },

        mounted()
        {
            this.searchItems = _.debounce(this.searchItems, 500);
        },

        methods: {
            async searchItems() {
                this.tableData.search = await customerStore.searchState(this.searchRequest, this.searchType);

                sharedStore.hideLoadingPage();
            },
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    .class-filter-section{
        label,input{
            display:inline-block;
        }
    }

</style>