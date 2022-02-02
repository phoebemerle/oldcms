<template>
    <div id="stockItemAttributesSection">
        <div id="stockItemAttributesSection__title">
            <h4><strong>Stock Item:</strong> {{stockAttribute.stock_name}}</h4>
        </div>
        <div id="stockItemAttributesSection__noAttributes" v-if="attributes.length === 0" >
            There are no attributes attached to this stock item.
        </div>
        <table id="stockItemAttributesSection__attributeTable" v-if="attributes.length > 0">
            <tr>
                <th>Name</th>
                <th>Variant</th>
                <th>Value</th>
                <th></th>
                <th></th>
            </tr>
            <tr v-for="(attribute, key) in attributes" :key="key">
                <td>
                    <input type="text" v-model="attribute.attributes.name"/>
                </td>
                <td>
                    <input type="text" v-model="attribute.attributes.value"/>
                </td>
                <td>
                    <button class="btn btn-primary" @click="saveAttribute(key)">Save</button>
                </td>
                <td>
                    <button class="btn btn-danger" @click="removeAttribute(key)">Remove</button>
                </td>
            </tr>
        </table>
        <div id="stockItemAttributesSection__buttonSection">
            <button @click="addNewAttribute()" class="btn btn-success">Add a New Attribute</button>
        </div>
    </div>
</template>

<script>
    import {attributeStore} from "@/stores";

    export default {
        name: "StockItemAttributes",

        props:['stockAttribute'],

        data(){
            return{
                attributes:this.stockAttribute.attributes.data
            }
        },

        methods:{
            addNewAttribute(){
               this.attributes.push({
                   'id':'',
                   'type':'stock_attributes',
                   'attributes':{
                       'name':'',
                       'stock_id':this.stockAttribute.stock_id,
                       'value':''
                   }
               })
            },

            async saveAttribute(key){
                let data = {};

                if(this.attributes[key].id === ""){
                    data = {
                        'data': {
                            'type': 'stock_attributes',
                            'attributes': this.attributes[key].attributes
                        }
                    };
                    try{
                        await attributeStore.create(data, key);
                    }catch(error){
                        console.log(error);
                    }
                }else{
                    data = {
                        'data':this.attributes[key]
                    };
                    try{
                        await attributeStore.update(data, this.attributes[key].id, key);
                    }catch(error){
                        console.log(error);
                    }
                }
            },

            async removeAttribute(key){
                if(this.attributes[key].id === ''){
                    this.attributes.splice(key, 1);
                }else {
                    try {
                        await attributeStore.delete(this.attributes[key].id, key);
                        this.attributes.splice(key, 1);
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        },

        watch:{
            stockAttribute(){
                this.attributes = this.stockAttribute.attributes.data;
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

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