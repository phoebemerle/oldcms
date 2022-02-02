<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">User Logs</span>
        </page-header>
        <div class="main-sections__content">
            <user-logs-main v-show="subview === 'view-all-user-logs'"></user-logs-main>
            <user-logs-list v-show="subview === 'view-selected-user-logs'" :userLogs="userLogs[0]" :subview="subview"></user-logs-list>
        </div>
    </section>
</template>

<script>
    import {event} from '@/services';
    import PageHeader from '@/components/shared/PageHeader';
    import UserLogsMain from '@/components/settings/userLogs/UserLogsMain';
    import UserLogsList from '@/components/settings/userLogs/UserLogsList';




    export default {
        name: "UserLogsView",

        components: {
            PageHeader,
            UserLogsMain,
            UserLogsList
            },

        props:['subview', 'userLogs'],

        data(){
            return{

            }
        },

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>