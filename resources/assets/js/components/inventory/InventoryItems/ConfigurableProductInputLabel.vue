<template>
    <div style="border:1px solid black; border-radius: 5px; padding:10px" >
        <div>
            <label for="labelText">Label:</label>
            <input id="labelText" type="text" v-model="editableLabel.variant_label"/>
            <button @click="saveLabel()">Save Label Name</button>
        </div>

        <div>
            <div>
                <label for="unitOfMeasurementInput">Unit</label>
                <input v-model="editableLabel.inputs.unit" id="unitOfMeasurementInput" type="text">
            </div>
            <div>
                <label for="minimumtInput">Min Order Amount</label>
                <input v-model="editableLabel.inputs.min" id="minimumtInput" type="number">
            </div>
            <div>
                <label for="maximumInput"> Max Order Amount</label>
                <input v-model="editableLabel.inputs.max" id="maximumInput" type="number">
            </div>
            <div>
                <label for="costPerUnitInput"> Cost Per Unit</label>
                <input v-model="editableLabel.inputs.price_per_unit" id="costPerUnitInput" type="number">
            </div>
            <div><button class="btn btn-primary" @click="saveInput()">Save Info</button></div>
        </div>

        <button>Remove</button>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {configProductStore} from '@/stores';
    import ConfigurableOptions from "./ConfigurableOptions";

    export default {
        name: "ConfigurableProductInputLabel",

        components: {ConfigurableOptions},

        props:['inputLabel', 'stockid'],

        data(){
            return{
                editableLabel:this.inputLabel ? this.inputLabel : {'inputs':{
                        'unit':'',
                        'min':0,
                        'max':0,
                        'price_per_unit':0
                    }},
            }
        },

        watch: {
            inputLabel(){

                this.editableLabel = this.inputLabel ? this.inputLabel : {'inputs':[]}
            }
        },

        methods: {
            async saveLabel(){
                this.editableLabel = await configProductStore.saveLabel(this.editableLabel);
            },

            async saveInput(){
                if(!this.editableLabel.id){
                    event.emit(event.names.USER_MESSAGE, 'Error, please save the label first', 'error');

                }else{
                    if(this.editableLabel.inputs.price_per_unit < 0.01){
                        event.emit(event.names.USER_MESSAGE, 'Price per unit cannot be 0', 'error');
                    }else{
                        this.editableLabel =  await configProductStore.saveInput(this.editableLabel);

                    }
                }
            },

            async removeInput(option){
                this.editableLabel = await configProductStore.removeOption(option.id);
            }

        }
    }
</script>


<style lang="scss">
    @import "~#/variables";
</style>