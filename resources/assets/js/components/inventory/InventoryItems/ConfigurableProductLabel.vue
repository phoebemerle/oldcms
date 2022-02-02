<template>
    <div style="border:1px solid black; border-radius: 5px;" >
        <div>
            <label for="labelText">Label:</label>
            <input id="labelText" type="text" v-model="editableLabel.variant_label"/>
            <button @click="saveLabel()">Save Label Name</button>
            <button v-show="editableLabel.id" @click="addNewOption()">Add Options</button>

            <div @click="showOptions = !showOptions">Show Options</div>
        </div>



        <div v-if="editableLabel.options.length > 0" v-for="(option, key) in editableLabel.options" v-show="showOptions">
            <h3>Option: {{option.priority}}</h3>
            <div>
                <label for="optionText">Option Text</label>
                <input id="optionText" type="text" v-model="option.option">
            </div>
            <div>
                <label for="optionCode">Part Code</label>
                <input id="optionCode" type="text" v-model="option.part_code">
            </div>
            <button class="btn btn-danger" @click="removeOption(option)">Remove Input</button>
        </div>
        <div><button class="btn btn-primary" @click="saveOption()">Save Input</button></div>
    </div>
</template>

<script>
    export default {
        name: "ConfigurableProductLabel",

        props:['configLabel', 'stockid'],

        data(){
            return{
                editableLabel:this.configLabel ? this.configLabel : {'options':[]},
                showOptions:false,
            }
        },

        watch: {
            inputLabel(){
                this.editableLabel = this.configLabel ? this.configLabel : {'options':[]}
            }
        },

        methods: {
            addNewOption(){
                this.editableLabel.options.push({
                    'option':"",
                    'part_code':"",
                    'priority':this.editableLabel.options.length+1,
                    'label_type':'options'
                });
            },

            async saveLabel(){
                this.editableLabel = await configProductStore.saveLabel(this.editableLabel);
            },

            async saveOption(){
                this.editableLabel =  await configProductStore.saveOptions(this.editableLabel);
            },

            async removeOption(option){
                this.editableLabel = await configProductStore.removeOption(option.id);
            }

        }
    }
</script>

<style scoped>

</style>