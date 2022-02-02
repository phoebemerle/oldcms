<template>
   <div class="attached_container" id="fraudTypesSection">
            <h3>Fraud Info</h3>
            <hr>

             <div class="details-form">
                <div id="addingFraudInfo" style="font-size:15px;">
                    <div id="fraudInfoDetails">
                    <label for="fraudInfoDetails">New Fraud Details: </label>
                    <input type="text" placeholder="Fraud Details" v-model="infoDetails" id="infoDetails" name="infoDetails">
                     <label for="fraudInfoType">New Fraud Details Type: </label>
                    <select v-model="infoType" name="infoType">
                        <option v-for="(type, key) in fraudTypes" :key="key" :value="type.id">{{type.attributes.ftype}}</option>
                    </select>
                    <button class="btn btn-primary" @click="createNewFraudInfo()">Create New Fraud Entry</button>
                    </div>
                </div>
            </div>

            <br>
            <hr>

            

             <div class="details-form">
                <div id="addingFraudType" style="font-size:15px;">
                    <div id="fraudTypeType">
                    </div>
                </div>
            </div>

          

             <table class="table table-hover fraudInfo" style="font-size:15px;">
             <label for="type">Search by Fraud Type: </label>
                    <select v-model="selectedFraudType" name="fraudType">
                        <option v-for="(type, key) in fraudTypes" :key="key" :value="key">{{type.attributes.ftype}}</option>
                    </select>
                <tr>
                    <th class="fraudInfo-ID">Fraud ID</th>
                    <th class="fraudInfo-Details">Fraud Details</th>
                    <th class="fraudInfo-Type">Fraud Type</th>
                    <th class="fraudInfo-Edit"><span>Edit</span></th>
                    <th class="fraudInfo-Update"><span>Save</span></th>
                    <th class="fraudInfo-Remove"><span>Remove</span></th>
                </tr>
                <tr v-if="selectedFraudType === null" class="noFraudTypes">
                    <td colspan="4">
                        <span>Fraud Type not selected</span>
                    </td>
                </tr>

                <tr v-show="selectedFraudType != null" v-for="(info, key) in fraudInfo" :key="key">
                    <td class="fraudInfo-ID">{{ info.id }}</td>
                    <td class="fraudInfo-Details"><input type="text" :disabled="!editFraudType" v-model="info.details"></td>
                    <td class="fraudInfo-Details"><select v-model="info.type_id" name="infoFraudType">
                        <option v-for="(type, key) in fraudTypes" :key="key" :value="type.id">{{type.attributes.ftype}}</option>
                    </select></td>
                    <td class="fraudInfo-Edit attachedTableEdit" @click="toggleEdit()"></td>
                     <td class="fraudInfo-Save attachedTableUpdate" @click="saveChangedInfo(key)"></td>
                    <td class="fraudInfo-Remove attachedTableRemove" @click="removeFraudInfo(key)"><i class="fas fa-trash"></i></td>
                </tr>
            </table> 
        </div>

</template>
<script>
    import {event, http} from '@/services';
    import {fraudTypeStore} from '@/stores';
    import {fraudInfoStore} from '@/stores';

    export default {
        name: "FraudInfo",

        components: {},

        props:['subview', 'fraudtypes'],

        data(){
            return{
                tab: 'fraud-info',
                editFraudType: false,
                fraudTypes: [],
                selectedFraudType: null,
                fraudInfo: [],
                infoDetails: '',
                infoType: '',
                newInfo: {}
            }
        },

        watch:{ 

            fraudtypes(){
                
                for(let i = 0; i < this.fraudtypes.length; i++){
                    this.fraudTypes.push(this.fraudtypes[i]);
                }

            },

            selectedFraudType(){
                this.fraudInfo = [];

                if(this.selectedFraudType != null){
                    this.fraudInfo = this.fraudtypes[this.selectedFraudType].attributes.fraudinfo
                }
            }

        },


        methods:{
            changeTab(tab){
                this.tab = tab;
            },

            toggleEdit(key) {
            this.editFraudType = !this.editFraudType;
        },

           async createNewFraudInfo(){
                let data = {
                    'data': {
                        'type': 'fraudinfo',
                        'attributes':{
                            'details': this.infoDetails,
                            'type_id': this.infoType
                        }
                    }
                };

                try {
                       let newFraudInfo = await fraudInfoStore.createFraudInfo(data);

                       this.newInfo.id = newFraudInfo.id
                       this.newInfo.details = newFraudInfo.attributes.details;
                       this.newInfo.type_id = newFraudInfo.attributes.type_id;

                       this.fraudInfo.push(this.newInfo);

                   } catch (error) {
                       console.log(error);
                       event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error')
                   }
            },


            async saveChangedInfo(key){
                let data = {
                    'data': {
                        'type': 'fraudinfo',
                        'attributes':{
                            'details': this.fraudInfo[key].details,
                            'type_id': this.fraudInfo[key].type_id
                        }
                    }
                };

                 try {
                       await fraudInfoStore.updateFraudInfo(data, this.fraudInfo[key].id);

                   } catch (error) {
                       console.log(error);
                       event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error')
                   }

            },

             async removeFraudInfo(key){
                
                let removeType = this.fraudInfo[key];

                 try {
                       await fraudInfoStore.removeFraudInfo(this.fraudInfo[key].id);
                       this.fraudInfo.splice(key, 1);

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

    input#infoDetails {
        border: 0.1rem solid #C9C9C9;
        border-radius: 0.5rem; 
    }
</style>