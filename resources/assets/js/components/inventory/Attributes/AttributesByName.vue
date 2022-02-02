<template>
    <div id="stockItemAttributesSection">
        <div id="stockItemAttributesSection__title">
            <h4>Attribute Name:<strong>{{title}}</strong></h4>
        </div>
        <div id="stockItemAttributesSection__noAttributes" v-if="allAttributes.length === 0" >
            There are no attributes attached to this stock item.
        </div>
        <table id="stockItemAttributesSection__attributeTable" v-if="allAttributes.length > 0">
            <tr>
                <th style="width:40%;">Value</th>
                <th style="width:40%;">Stock Item</th>
                <th style="width:10%;"></th>
                <th style="width:10%;"></th>
            </tr>
            <tr v-for="(attribute, key) in allAttributes" :key="key">
                <td>
                    <input type="text" v-model="attribute.value"/>
                </td>
                <td>
                    <p v-show="attribute.attribute_id != ''" v-model="attribute.stock_name">{{attribute.stock_name}} </p>
                    <select v-show="attribute.attribute_id === '' " v-model="attribute.stock_id">
                        <option value="" >Please Select a Stock Item</option>
                        <option v-for="stockItem in availableStockItems" :value='stockItem.id'>{{stockItem.attributes.description}}</option>
                    </select>
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
            <button @click="addNewAttribute()" class="btn btn-success">Add a New Attribute Value</button>
        </div>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {attributeStore} from "@/stores";

    export default {
        name: "AttributesByName",

        props:['attributes', 'title', 'stockItems'],

        data(){
            return{
                allAttributes:this.attributes,
                availableStockItems:[]
            }
        },

        mounted(){
            this.findAvailableStockItems();
        },

        watch:{
            attributes(){
                this.allAttributes = this.attributes;
                this.findAvailableStockItems();
            }
        },

        methods:{
            findAvailableStockItems(){
                let stockItems = JSON.parse(JSON.stringify(this.stockItems));

                for(let y = 0; y < stockItems.length; y++){
                    for(let u = 0; u < this.allAttributes.length; u++){
                        if(stockItems[y].id === this.allAttributes[u].stock_id){
                            stockItems.splice(y, 1);
                        }
                    }
                }
                this.availableStockItems = stockItems;
            },

            addNewAttribute(){
                if(this.availableStockItems.length > 0) {
                    this.allAttributes.push({
                        'attribute_id': '',
                        'stock_id': '',
                        'stock_name': '',
                        'value:': ''
                    })
                }else{
                    event.emit(event.names.USER_MESSAGE, 'No more stock items to attach attributes to', 'error');
                }
            },

            async saveAttribute(key){
                let attribute = this.allAttributes[key];
                let data = {
                    'data': {
                        'type': 'stock_attributes',
                        'attributes': {
                            'name': this.title,
                            'value': attribute.value,
                            'stock_id': attribute.stock_id
                        }
                    }
                };

                if(attribute.attribute_id === ''){
                    if(attribute.stock_id === ''){
                        event.emit(event.names.USER_MESSAGE, 'Please select a stock item to attach this attribute too', 'error');
                    }else {
                        try{
                            let savedAttribute = await attributeStore.create(data, key);
                            this.updateAttributes(savedAttribute, key);
                        }catch(error){
                            console.log(error);
                        }
                    }
                }else{
                    {
                        data.data.id = attribute.attribute_id;
                        try{
                            await attributeStore.update(data, attribute.attribute_id, key);
                        }catch(error){
                            console.log(error);
                        }
                    }
                }
            },

            updateAttributes(newData, key){
                let stockName = '';
                for(let i = 0; i < this.availableStockItems.length; i++){

                    if(this.availableStockItems[i].id === newData.attributes.stock_id){
                        stockName = this.availableStockItems[i].attributes.description;
                    }
                }

               this.allAttributes[key] = {
                   'attribute_id':newData.id,
                   'stock_id':newData.attributes.stock_id,
                   'stock_name':stockName,
                   'value':newData.attributes.value
               }

               this.findAvailableStockItems();

            },

            async removeAttribute(key){
                if(this.allAttributes[key].attribute_id === ''){
                    this.allAttributes.splice(key, 1);
                }else{
                    try {
                        await attributeStore.delete(this.allAttributes[key].attribute_id, key);
                        this.allAttributes.splice(key, 1);
                        this.findAvailableStockItems();
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>