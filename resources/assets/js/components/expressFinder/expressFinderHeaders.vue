<template>
    <div>
        <div>
            <h3>Attach a New Header</h3>

            <select v-model="selected">
                <option value="0">Please Select a Heading</option>
                <option v-for="header in headers" :value="header.id">
                    {{ header.attributes.name }}
                </option>
            </select>

            <button @click="addNewHeader()">Add Header</button>
        </div>

        <table>
            <tr v-for="(select, index) in selectedHeaders" >
                <td style="padding:10px">Name: <strong>{{select.name}}</strong></td>
                <td style="padding:10px"><button @click="removeHeader(select.id, index)">Remove Header</button></td>
            </tr>
        </table>
    </div>
</template>

<script>
    import {finderStore} from '@/stores';


    export default {
        name: "expressFinderHeaders",

        props:['headers','finder'],

        data(){
            return{
                selected:0,
                selectedHeaders:[]
            }
        },

        created(){
            this.finder ? this.selectedHeaders = this.finder.attributes.headers : this.selectedHeaders = [];
        },

        watch:{
            finder(){
                this.selectedHeaders = this.finder.attributes.headers;
            }
        },

        methods:{
            async addNewHeader(){


                if(this.selected !== 0) {

                    if(!this.finder.attributes.headers.find(row => row.header_id === Number(this.selected))) {

                        let data = {
                            'data': {
                                'type': 'express-finder-header',
                                'attributes': {
                                    'header_id': this.selected,
                                    'finder_id': this.finder.id
                                }
                            }
                        };

                        await finderStore.saveNewFinderHeader(data);
                        this.selected = 0;

                    } else {
                        return event.emit(event.names.USER_MESSAGE, 'Header is already attached', 'error');
                    }



                }
            },

            removeHeader(key, index){
                finderStore.removeHeader(key);
                this.selectedHeaders.splice(index, 1);
            }
        }
    }
</script>
