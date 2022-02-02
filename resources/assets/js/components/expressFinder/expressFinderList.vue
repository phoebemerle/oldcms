<template>
    <div>
        <div>
            <a href="#!/express-finder/create">
                <button class="btn btn-app btn-primary btn-lg">Create a new Express Finder</button>
            </a>

            <button style="float: right;" @click="updateList()">Update Express Finder List</button>
        </div>

        <div class="list-table">
            <table-list tableType="expressFinders"
                        :headers="['Title', '']"
                        :data="['Name']"
                        :items="tableData"
                        :edit="true"
                        link="#!/express-finder/edit/"
            />
        </div>
    </div>
</template>

<script>
    import TableList from "../shared/tableList";
    import {finderStore} from '@/stores';

    export default {
        name: "expressFinderList",

        components: {TableList},

        props:['finders'],

        data(){
            return{
                tableData:{
                    search:[]
                },
            }
        },

        async created(){
            if(this.finders.length === 0 ){
                this.tableData.search = await finderStore.checkForFinders();
            }else{
                this.tableData.search = this.finders;
            }
        },

        methods:{
            async updateList(){
                this.tableData.search = await finderStore.getAllFinder();
            }
        }


    }
</script>

<style scoped>

</style>