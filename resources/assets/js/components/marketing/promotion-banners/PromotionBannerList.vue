<template>
    <div class="list-table">
        <table-list tableType="promotion-banners"
                    :headers="['Title', 'Alt Tag', 'Link', '']"
                    :data="['title', 'alt_tag', 'link']"
                    :edit="true"
                    :search="false"
                    :items="tableData"
                    link="#!/marketing/promotion-banners/edit/"
        />
    </div>
</template>

<script>
    import TableList from '@/components/shared/tableList';

    export default {

        props: ['tableData'],

        components:{TableList},

        data(){
            return{

            }
        },

    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>