<template>
<div class="main-sections__editForm__container">
    <div class="details-form">
        <div class="details-form__body form-sections">
            <div>
                <h3>Attribute Type Details:</h3>
            </div>
            <div>
                <label for="attributeType">Name: </label>
                <input id="attributeType" v-model="attributeInfo.attribute_type" type="text" name="attributeType" data-vv-as="type" v-validate="'required'" placeholder="Please enter the Attribute Type" required>
            </div>
            <div class="error-message">{{ duplicate }}</div>
            <div v-for="error in errors.collect('attributeType')" :key="error+'a'" class="error-message">{{ error }}</div>
            <br>
            <h3>Predefined Attributes</h3>
            <br>
            <div v-for="(predefined_attribute, index) in attributeInfo.predefined_attributes" :key="index" style="margin-left: 155px;">
                <input class="col-12" type="text" v-model="attributeInfo.predefined_attributes[index].name" >
                <button class="btn btn-danger" @click="removeFromPredefined(index)"> - </button>
            </div>
            <div style="margin-left: 155px;">
                <select v-model="selectedAttribute">
                    <option disabled value="">Please Select an Attribute</option>
                    <option value="0">Create a New Attribute</option>
                    <option v-for="(attribute, index) in attributes" :key="index">{{attribute.attributes.name}}</option>
                </select>
                <div v-if="selectedAttribute === '0' ">
                    <input class="col-12" type="text"  v-model="extraPreAttr" @keyup.enter="addToPredefined()" placeholder="Add predefined attribute">
                </div>
                <button class="btn btn-success" @click="addToPredefined()">+</button>
            </div>
            <br>
            <br>
            <button :disabled="$validator.errors.any()" class="btn btn-primary" @click="saveAttribute()">Save</button>
            <button @click="deleteAttribute()" class="btn btn-danger" v-if="subview === 'edit-predefined-attributes'">Delete</button>
            </div>
            </div>
        </div>
</template>

<script>
    import {event} from '@/services';
    import {attributeStore, attributeTypeStore, sharedStore} from '@/stores';
    import {http} from '@/services';
    import {cdnStore} from '@/stores';

    export default {
        name: "PredefinedAttributeDetails",

        props: [
            'attribute',
            'subview'
        ],

        data(){
            return{
                type: null,
                attributeInfo: {
                    attribute_type: null,
                    predefined_attributes:[],
                    id:null,
                },
                attributes: [],
                extraPreAttr: null,
                selectedAttribute:'',
                duplicate:null,
            }
        },



        watch: {

            async attribute() {
                this.attributes = await attributeStore.checkAttributes();

                if(this.subview === 'create-predefined-attributes') {

                    this.attributeInfo = {
                        attribute_type:null,
                        predefined_attributes:[],
                        id:null
                    };
                    this.extraPreAttr = '';

                } else if (this.subview === 'edit-predefined-attributes') {
                    this.extraPreAttr = '';
                    this.attributeInfo = this.attribute.attributes;
                    this.attributeInfo['id'] = this.attribute.id;
                }
            },
            async subview() {
                 if(this.subview === 'create-predefined-attributes') {

                    this.attributeInfo = {
                        attribute_type:null,
                        predefined_attributes:[],
                        id:null
                    };
                    this.extraPreAttr = '';

                }

                this.attributes = await attributeStore.checkAttributes();
                this.$validator.reset();
                 if(this.subview === 'create-predefined-attributes') {
                    this.extraPreAttr = '';
                }
                if(this.subview === 'edit-predefined-attributes') {
                    this.extraPreAttr = '';
                    this.attributeInfo = this.attribute.attributes;
                    this.attributeInfo['id'] = this.attribute.id;
                    this.selectedAttribute = '';
                }
            }
        },


        methods: {
            removeFromPredefined(key) {
                this.attributeInfo.predefined_attributes.splice(key, 1);
            },

            addToPredefined()
            {

                if(this.extraPreAttr.length > 0) {
                    this.attributeInfo.predefined_attributes.push({name: this.extraPreAttr});
                    this.extraPreAttr = '';
                } else {
                    this.attributeInfo.predefined_attributes.push({name: this.selectedAttribute});
                    this.selectedAttribute = '';
                }

                // this.selectedAttribute = '-1';
            },


            async saveAttribute() {
                this.duplicate = null;
                let replicateSearch = attributeTypeStore.state.attribute_types.filter(row => row.attributes.attribute_type === this.attributeInfo.attribute_type);

                if(replicateSearch.length > 0 && this.subview === 'create-predefined-attributes') {
                    this.duplicate = this.attributeInfo.attribute_type+' already exists!'
                }
                else {

               await this.$validator.validateAll();

               if(this.$validator.errors.any()) {
                    event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }

                    try {
                        let id = await attributeTypeStore.createAndAttach(this.attributeInfo);
        
                        if(this.subview === 'create-predefined-attributes') {
                            window.location='/#!/inventory/predefined-attributes/edit/' + id;
                        }
                    }catch(error) {
                        console.log(error)
                    }
                }
           },

           deleteAttribute() {
               attributeTypeStore.delete(this.attribute);
           }

        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

    .select_container{
        height: auto;
        max-width: 400px;
        border-radius:0.5rem;
        padding: 0px;
        border: 0.1rem solid $border-color;
        position: relative;
        margin-top: 0px;
        margin-left: 160px;
    }
    .container_option{
        padding: 3px;
        cursor: pointer;
    }
    .container_option:hover{
        background-color: #e6e6e6;
    }
     ul {
  list-style-type: none;
 }
</style>