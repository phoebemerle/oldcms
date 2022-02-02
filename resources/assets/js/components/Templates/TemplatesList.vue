<template>
    <div>
        <div>
            <a href="#!/templates/create">
                <button class="btn btn-app btn-primary btn-lg">Create a new Template</button>
            </a>
        </div>
        <div class="list-table">
            <table-list 
                tableType="templates"
                :headers="['Title', 'Subject', 'active', '']"
                :data="['title', 'subject', 'active']"
                :items="tableData"
                :edit="true"
                :search="true"
                link="#!/templates/edit/"
            />
        </div>
    </div>
</template>

<script>

    import TableList from '@/components/shared/tableList';
    import {templateStore} from '@/stores';

    export default {

        name: "TemplatesList",

        components:{TableList},

        data() {
            return {
                tableData: {
                    search: templateStore.state.templates
                }
            };
        },

        watch: {
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>