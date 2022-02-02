<template>
    <div style="background-color:white; width:500px; height:500px;position: fixed; top: 100px; left: 40%; border-radius: 5px;border:1px solid black;    overflow: scroll;    padding: 10px 20px;">
        <div style="float:right" @click="close()">
            <span style="font-size:20px;margin-right:15px;" >X</span>
        </div>
        Part Codes
        <table>
            <tr>
                <th>Part Code</th>
                <th>Price</th>
                <th></th>
            </tr>
            <tr v-for="(partCode, key) in editablePartCodes">
                <td>{{partCode.part_code}}</td>
                <td>£<input :v-model="partCode.price" :value="partCode.price" type="number"/></td>
                <td><button class="btn btn-primary" @click="updatePartCode(partCode, key)">Update Part Code</button></td>
            </tr>
        </table>

    </div>
</template>

<script>
    import {http} from '@/services';
    import {event} from '@/services';
    import {campaignStore} from '@/stores';
    import {endPoints} from "@/services";
    import {configProductStore} from '@/stores';

    export default {
        name: "ConfigurablePartCodesModal",

        props:['partCodes'],

        data(){
            return{
                editablePartCodes: this.partCodes ? this.partCodes : []
            }
        },

        watch:{
            partCodes(){
                this.editablePartCodes = this.partCodes;
            }
        },

        methods:{
            close(){
                event.emit(event.names.CLOSE_PART_CODE_MODAL, false);
            },

            async updatePartCode(data, key){
                this.editablePartCodes[key] = await configProductStore.updatePartCode(data, data.id);
            }


    }


    }
</script>

<style scoped>
    table{
        width:100%
    }
    th,td{
        width:32%;
        padding:10px 5px;
    }
</style>