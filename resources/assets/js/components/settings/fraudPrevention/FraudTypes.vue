<template>
   <div class="attached_container" id="fraudTypesSection">
            <h3>Fraud Types</h3>

             <div class="details-form">
                <div id="addingFraudType" style="font-size:15px;">
                    <div id="fraudTypeType">
                    <label for="type">New Fraud Type: </label>
                    <input type="text" placeholder="Fraud Type" v-model="type" id="type" name="type">
                    <button class="btn btn-primary" @click="createNewFraudType()">Create New Fraud Type</button>
                    </div>
                </div>
            </div>

          
            <br>
            <br>

            <table class="table table-hover fraudTypes" style="font-size:15px;">
                <tr>
                    <th class="fraudTypes-ID">Fraud ID</th>
                    <th class="fraudTypes-Type">Fraud Type</th>
                    <th class="fraudTypes-Edit"><span>Edit</span></th>
                    <th class="fraudTypes-Update"><span>Save</span></th>
                    <th class="fraudTypes-Remove"><span>Remove</span></th>
                </tr>
                <tr v-if="fraudtypes.length < 1" class="noFraudTypes">
                    <td colspan="4">
                        <span>No fraud types created</span>
                    </td>
                </tr>
                <tr v-show="fraudtypes.length > 0" v-for="(type, key) in fraudtypes" :key="key">
                    <td class="fraudTypes-ID">{{ type.id }}</td>
                    <td class="fraudTypes-Type"><input type="text" :disabled="!editFraudType" v-model="type.attributes.ftype"></td>
                    <td class="fraudTypes-Edit attachedTableEdit" @click="toggleEdit()"></td>
                     <td class="fraudTypes-Save attachedTableUpdate" @click="saveChangedType(key)"></td>
                    <td class="fraudTypes-Remove attachedTableRemove" @click="removeFraudType(key)"><i class="fas fa-trash"></i></td>
                </tr>
            </table>
        </div>

</template>
<script>
    import {event, http} from '@/services';
    import {fraudTypeStore} from '@/stores';

    export default {
        name: "FraudTypes",

        components: {},

        props:['subview', 'fraudtypes'],

        data(){
            return{
                tab: 'fraud-types',
                type: '',
                editFraudType: false,
            }
        },

        watch:{ 

            fraudtypes(){

            }

        },


        methods:{
            changeTab(tab){
                this.tab = tab;
            },

            toggleEdit(key) {
            this.editFraudType = !this.editFraudType;
        },

           async createNewFraudType(){
                let data = {
                    'data': {
                        'type': 'fraudtypes',
                        'attributes':{
                            'type': this.type
                        }
                    }
                };

                try {
                       let newType = await fraudTypeStore.createFraudType(data);

                       this.fraudtypes.push(newType);

                   } catch (error) {
                       console.log(error);
                       event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error')
                   }
            },


            async saveChangedType(key){
                let data = {
                     'data': {
                        'type': 'fraudtypes',
                        'attributes':{
                            'type': this.fraudtypes[key].attributes.type
                        }
                    }
                };

                 try {
                       await fraudTypeStore.updateFraudType(data, this.fraudtypes[key].id);

                   } catch (error) {
                       console.log(error);
                       event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error')
                   }

            },

             async removeFraudType(key){
                
                let removeType = this.fraudtypes[key];

                 try {
                       await fraudTypeStore.removeFraudType(this.fraudtypes[key].id);
                       this.fraudtypes.splice(key, 1);

                   } catch (error) {
                       console.log(error);
                       event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error')
                   }

            }
           
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";

    input#type {
        border: 0.1rem solid #C9C9C9;
        border-radius: 0.5rem; 
    }
</style>