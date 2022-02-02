
<template>
    <section>
        <a href="#!/inventory/predefined-attributes/create">
            <button class="btn btn-app btn-primary btn-lg">Create a new Predefined Attribute</button>
        </a>
        <div class="list-table">
            <table-list tableType="attributetype"
                        :headers="['Name', '']"
                        :data="['attribute_type']"
                        :edit="true"
                        :items="tableData"
                        :search="true"
                        link="#!/inventory/predefined-attributes/edit/"
            />
        </div>
    </section>
</template>

<script>
    import TableList from '@/components/shared/tableList';
    import {attributeTypeStore} from '@/stores';

    export default {

        props: ['tableData'],

        components:{TableList},

        data(){
            return{
            
            }
        },

        created() {
        }

        

    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>