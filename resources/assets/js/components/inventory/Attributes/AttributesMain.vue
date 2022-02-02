<template>
    <div class="test" id="stockItemAttributesSection">
        <h3>Attributes</h3>
        <div>
            <table id="stockItemAttributesSection__attributeTable">
                <tr>
                    <td>
                        <p>Attributes Groups</p>
                    </td>
                </tr>
                <tr>
                    <td colspan="6">
                        <select v-model="attributeType" name="attributeType" id="" @change="changeAttrType(attributeType)" >
                            <option value="" selected disabled>Select One</option>
                            <option v-for="(type, t) in attributeTypes" :key="t" :value="type.id" >
                                {{type.attributes.attribute_type}}
                            </option>
                        </select>
                        <br>
                    </td>
                    <td>
                        <!--<input type="button" value="Sync Finder" @click="syncFinder">-->
                    </td>
                </tr>
            </table>
            <hr>
            <table id="attachedAttributesTable" style="width: 100%;font-size: 15px;">
                <tr v-if="newAttributes">
                    <td colspan="4">
                        <select v-model="selectedAttribute" @change="changeAttribute()">
                            <option value="">Please Select</option>
                            <option value="-1">Enter New Attribute</option>
                            <option v-for="(attribute, index) in dbAttributes" :value="index" :key="index">{{attribute.attributes.name}}</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Finder Value</th>
                    <th class="attributeCheckboxTD">Variant</th>
                    <th class="attributeCheckboxTD">Non-Purchasable</th>
                    <th class="attributeCheckboxTD">Dont Show in Specs table</th>
                    <th></th>
                </tr>

                <tr v-for="(attr, index) in attributes" :key="index">
                   <td>
                       <input type="text" v-model="attr.name" name="attributeName" :disabled="attr.id"  v-validate="'required'" data-vv-as="name">
                    </td>
                    <td>
                        <input type="text" v-model="attr.value" name="attributeValue" v-validate="'required'" data-vv-as="value"/>
                    </td>
                    <td>
                        <input type="text" v-model="attr.attribute_filter_value" @change="searchFilterValues(index)" name="attributeFilterValue" />
                        <ul class="dropdown-list">
                            <li v-for="(filter_value, key) in attribute_filter_values[index]" :key="key" @click="setFilter(index, filter_value)">
                                {{filter_value.attributes.value}}
                            </li>
                        </ul>
                    </td>
                    <td class="attributeCheckboxTD">
                        <input v-if="stockitem.attributes.type !== 'Standard'" type="checkbox" name="variant" v-model="attr.variant">
                    </td>
                    <td  class="attributeCheckboxTD">
                        <input v-if="stockitem.attributes.type !== 'Standard'" type="checkbox" name="non-purchasable" v-model="attr.non_purchasable">
                    </td>
                    <td  class="attributeCheckboxTD">
                        <input type="checkbox" name="dont-show-specs" v-model="attr.dont_show_specs">
                    </td>
                    <td>
                        <button v-show="!attr.attribute_type_id" class="btn btn-danger" v-on:click="removeStockAttribute(index)">Remove</button>
                        <p v-show="attr.attribute_type_id">Cant be removed as part of the attribute group</p>
                    </td>
                </tr>
            </table>
            <br>
            <div id="stockItemAttributesSection__buttonSection">
                <button @click="addNewAttribute()" class="btn btn-success">Add a New Attribute</button>
                <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveAttribute()">Save</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {attributeStore, attributeTypeStore, predefinedAttributeStore, stockAttributeStore} from '@/stores';
    import {event} from "@/services";
    import Vue from 'vue';

    export default {
        name: "AttributesMain",

        props:['stockitem', 'view'],

        data(){
            return{
                stockAttributes:[],
                attributeType:'',
                attributeTypes:[],
                predefinedAttribute: '',
                predefinedAttrFields:[],
                attributes:[],
                savedAttributes:[],
                dbAttributes:[],
                newAttributes:false,
                selectedAttribute:'',
                attribute_filter_values:[]
            }
        },

        watch: {
            async view()
            {
                if(this.view ==='create-inventory' || this.view === 'edit-stock') {
                    this.attributes = [];
                    this.selectedAttribute = '';


                    this.attributeTypes = attributeTypeStore.state.attribute_types;
                    this.dbAttributes = await attributeStore.getAttributes();

                    if (this.stockitem.attributes && this.stockitem.type === 'stockitems') {
                        this.attributes = this.stockitem.attributes.attributes;
                        for (let x = 0; x < this.stockitem.attributes.attributes.length; x++) {
                            if (this.stockitem.attributes.attributes[x].attribute_type_id) {
                                this.attributeType = this.stockitem.attributes.attributes[x].attribute_type_id;
                                break;
                            }
                        }

                    } else {
                        this.attributeType = ''
                    }
                }
            },
        },

        methods:{
            async syncFinder()
            {
                await attributeStore.syncFinder()   
            },
            setFilter(index, filter) {
                this.attributes[index].attribute_filter_value = filter.attributes.value
                this.attributes[index].attribute_filter_value_id = filter.id
                Vue.set(this.attribute_filter_values, index, [])
            },
            async searchFilterValues(index) {
                let search = this.attributes[index].attribute_filter_value

                Vue.set(this.attribute_filter_values, index, await attributeStore.searchFilterValues(search))

            },
            changeAttribute(){
                if(this.selectedAttribute !== '') {
                    let newAttribute = {
                        'name': '',
                        'value': '',
                        'variant': false,
                        'non_purchasable': false,
                        'attribute_type_id': null,
                        'id': null,
                        'priority': null,
                        'new': true,
                        'dont_show_specs': false,
                        'attribute_filter_value': null,
                        'attribute_filter_value_id': null
                    };

                    if (this.selectedAttribute !== '-1') {
                        newAttribute.name =  this.dbAttributes[this.selectedAttribute].attributes.name;
                        newAttribute.id = this.dbAttributes[this.selectedAttribute].id;
                    }

                    this.attributes.push(newAttribute);
                    this.newAttributes = false;
                }
            },

            addNewAttribute(){
                this.selectedAttribute = '';
                this.newAttributes = true;

            },

            async saveAttribute(){
                await this.$validator.validateAll();

                if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                }

                let data = {
                    'data': {
                        'type': 'attributes',
                        'attributes': {
                            'attributes': this.attributes,
                            'stock_id':this.stockitem.id
                        }
                    }
                };

                let savedAttributes = await attributeStore.attachAttributes(data);
                this.attributes = savedAttributes.attributes.attributes;
            },

            async changeAttrType(type){

                if(this.attributes.length > 0){
                    for (let x = 0; x < this.attributes.length; x++){
                        let item = this.attributes.find(row => row.attribute_type_id !== null);
                        let index = this.attributes.indexOf(item);
                        if(index !== -1){
                            this.attributes.splice(index, 1);
                        }
                    }
                }

                let attribute = await attributeTypeStore.getAttributeType(type);

                for(let y = 0; y < attribute.attributes.predefined_attributes.length; y++){

                    this.attributes.push({
                        'name': attribute.attributes.predefined_attributes[y].name,
                        'value': '',
                        'variant': false,
                        'attribute_type_id': attribute.attributes.predefined_attributes[y].attribute_type_id,
                        'id': attribute.attributes.predefined_attributes[y].id,
                        'new': true
                    });

                }

            },

            async removeStockAttribute(index){
                if(!this.attributes[index].new){
                    let data = {
                        'stockitem_id':this.stockitem.attributes.stock_id,
                        'attribute_id':this.attributes[index].id
                    };
                    await attributeStore.delete(data);
                }

                this.attributes.splice(index, 1);

            },

            changeTab(tab){
                this.activeTab = tab;
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    #attachedAttributesTable{
        width: 100%;
        font-size: 15px;

        input{
            border:1px solid #c9c9c9;
            border-radius: 5px;
        }

        td{
            padding: 5px 0;
        }
    }
    #stockItemAttributesSection{
        border:1px solid #c9c9c9;
        border-radius: 5px;
        padding:10px;
        margin-bottom:10px;

        &__title{
            border-bottom:1px solid #c9c9c9;
        }

        &__noAttributes{
            font-size:13px;
            padding:10px 0
        }

        &__attributeTable{
            width:100%;
            font-size:14px;
            margin-top:10px;

            th{
                font-size:15px;
            }

            input{
                margin:5px 0;
                border:1px solid #c9c9c9;
                border-radius:5px;
            }

            button{
                font-size: 13px;
            }
        }

        &__buttonSection{
            margin-top:10px;

            button{
                font-size:14px;
            }
        }
    }

</style>