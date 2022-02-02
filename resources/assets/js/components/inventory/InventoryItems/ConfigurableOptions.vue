<template>

</template>

<script>
    export default {
        name: "ConfigurableOptions",

        props:['option'],

        data(){
            return{
                editableOption:null
            }
        },

        watch:{
            option(){
                this.editableOption = this.option;
            }
        },

        methods:{
        }
    }
</script>


<style lang="scss">
    @import "~#/variables";
</style>