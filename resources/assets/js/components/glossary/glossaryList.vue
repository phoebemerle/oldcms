<template>
  <div class="list-table">
    <div class="col-sm-12 col-md-12 dataTables_filter searchBar">
      <label for="searchBar">Search</label>
      <input v-model="searchRequest" @input="searchItems()" class="form-control form-control-sm"  type="text">
      <div style="display: inline-block;font-size: 20px;margin-left: 12px;" @click="searchItems()">
        <i class="fas fa-search"></i>
      </div>
    </div>
    <table-list tableType="glossaryTerms"
                :headers="['Term','']"
                :data="['terms']"
                :edit="true"
                :items="tableData"
                link="#!/glossary/edit/"
    />
  </div>

</template>

<script>
    import TableList from '@/components/shared/tableList';
    import {event} from '@/services';
    import {sharedStore} from '@/stores';
    import {customerStore} from '@/stores';
    import {glossaryStore} from "../../stores";


    export default {

      props:['terms'],

        components:{TableList},

        data() {
            return {
                tableData:{
                    search:[]
                },
                searchRequest:'',
            }
        },

        mounted()
        {
            this.searchItems = _.debounce(this.searchItems, 500);
        },

        methods: {
            async searchItems() {
                this.tableData.search = await glossaryStore.searchStore(this.searchRequest);

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