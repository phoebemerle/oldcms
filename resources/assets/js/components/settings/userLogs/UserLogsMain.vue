<template>
   <section>
        <div class="col-11 btn card-body" style="margin-top: 30px;" @click="logPageList(logPage.id)" v-for="(logPage, l) in logPages.logPages" :key="l">
            <ul class="list-inline">
             <h3>{{logPage.attributes.page_type}}</h3>
            </ul>
        </div>
   </section>
</template>

<script>

    import {logPagesStore} from '@/stores';

    export default {
        name: "UserLogsMain",

        data(){
            return{
              logPages: logPagesStore.state
            }
        },

        methods:{
            logPageList(type) {
                window.location = '#!/settings/user-logs/'+ type + '/list'
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>
