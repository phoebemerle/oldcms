<template>
        <div id="categoryProductContainer">
            <product-search v-show="childtype === 'Products' " type="attachedToCategory" :product="category"/>
            <category-search v-show="childtype === 'Categories' " type="attachedToCategory" :category="category"/>
            <div class="attached_container" id="categoryProductSection">
                <table  class="table table-hover attachedTable categoryProduct">
                    <tr>
                        <th class="categoryProduct__order"><span>Order</span></th>
                        <th class="categoryProduct__title" :class="{categoryTitleColumn : childtype === 'Categories'}">Title</th>
                        <th class="categoryProduct__price" v-show="childtype === 'Products' " >Price</th>
                        <th class="categoryProduct__active">Active</th>
                        <th class="categoryProduct__partNumber" v-show="childtype === 'Products' ">Part Number</th>
                        <th v-show="childtype === 'Products' ">Delivery</th>
                        <th class="categoryProduct__view"><span>View</span></th>
                        <th class="categoryProduct__remove"><span>Remove</span></th>
                    </tr>
                    <tr v-if="allChildren.length < 1" class="noAttachmentsFound">
                        <td colspan="4">
                            <span v-show="childtype === 'Products' ">No Products Attached Yet</span>
                            <span v-show="childtype === 'Categories' ">No Categories Attached Yet</span>
                        </td>
                    </tr>
                    <draggable @change="setNewAttachedOrder()" v-model="allChildren">
                        <tr v-show="allChildren.length > 0" v-for="(child, key) in allChildren" :key="key">
                            <td class="categoryProduct__order" >
                                <input disabled @change="setNewAttachedOrder()" v-model="child.attributes.order"/>
                            </td>
                            <td class="categoryProduct__title" :class="{categoryTitleColumn : childtype === 'Categories'}">{{child.attributes.title}}</td>
                            <td class="categoryProduct__price" v-if="childtype === 'Products'">£{{  child.attributes.default_stockitem[0] ? child.attributes.default_stockitem[0].price: 'N/A'}}</td>
                            <td class="categoryProduct__active">{{child.attributes.active}}</td>
                            <td class="categoryProduct__partNumber" v-if="childtype === 'Products' ">{{child.attributes.default_stockitem[0]  ?  child.attributes.default_stockitem[0].code: 'N/A'}}</td>
                            <td v-if="childtype === 'Products' ">{{child.attributes.default_stockitem[0]  ? child.attributes.default_stockitem[0].delivery : 'N/A'}}</td>
                            <a v-if="childtype === 'Products' " :href="'/#!/products/edit/'+child.id">
                                <td class="categoryProduct__view attachedTableView"> <i class="fas fa-eye"></i> </td>
                            </a>
                            <a v-show="childtype === 'Categories' " :href="'/#!/categories/edit/'+child.id">
                                <td class="categoryProduct__view attachedTableView"><i class="fas fa-eye"></i></td>
                            </a>
                            <td class="categoryProduct__remove attachedTableRemove" @click="removeAttached(key)"> <i class="fas fa-trash"></i> </td>
                        </tr>
                    </draggable>
                </table>

                <button class="btn btn-primary" @click="updateAttachedOrder()">Update Order</button>
            </div>
        </div>
</template>

<script>
    import draggable from 'vuedraggable';
    import ProductSearch from '@/components/products/ProductSearch';
    import CategorySearch from '@/components/categories/CategorySearch';
    import {sharedStore} from "@/stores";
    import {categoryStore} from '@/stores';
    import {productStore} from "@/stores";
    import {event} from '@/services';
    import Vue from 'vue';
    import { EventBus } from '@/components/categories/CategoriesMain';

    export default {
        name: "AttachedObjects",

        components:{ProductSearch, draggable, CategorySearch},

        props:['category', 'attachedchildren', 'childtype'],

        data(){
            return{
                allChildren:[],
                updated:[]
            }
        },

        watch:{
            attachedchildren(){
                this.allChildren = this.attachedchildren;
            }
        },

        mounted(){
            event.on(event.names.UPDATE_ATTACHED_SELECTION, (selected) =>{
                let count = 0;
                    for (let i = 0; i < this.allChildren.length; i++) {
                        if (this.allChildren[i].id.toString() === selected.id.toString()) {
                            count = 1;
                        }
                    }

                if(count === 1){
                    console.log('Already attached you melt');
                    event.emit(event.names.USER_MESSAGE, selected.attributes.title + ' could not be attached', 'error');
                }
                else{
                    this.storeAttached(selected);
                }
            });
        },


        methods: {
            updateAttachedOrder(){
                let data = {
                    'data':{
                        'type':'nodes',
                        'attributes': {
                            'newOrder': this.updated,
                            'category_id': this.category.id
                        }
                    }
                };

                categoryStore.updateProducts(data);

            },

            reArrange(){
                    // Set slice() to avoid to generate an infinite loop!
                    return this.allChildren.slice().sort(function(a, b) {
                        return a.order - b.order;
                    });
            },

            setNewAttachedOrder(){
                for(let y = 0; y < this.allChildren.length; y++){
                    let oldOrder = this.allChildren[y].attributes.order;
                    let newOrder = y+1;
                    this.allChildren[y].attributes.order = newOrder;

                    if(oldOrder !== newOrder){
                        this.addToUpdateArray(this.allChildren[y]);
                    }
                }
            },

            addToUpdateArray(attachedObj){
                let count = null;

                if(this.updated.length > 0) {
                    for (let y = 0; y < this.updated.length; y++) {
                        if(this.updated[y].id === attachedObj.id){
                            count = y;
                        }
                    }
                }
                if(count != null){
                    this.updated.splice(count, 1);
                }

                this.updated.push({
                    'order':attachedObj.attributes.order,
                    'id':attachedObj.attributes.node_id
                });
            },

            async storeAttached(selectedProduct) {
                let data = {
                    'data': {
                        'type': 'nodes',
                        'relationships':{
                            'parent':{
                              'data':{
                                  'id':this.category.id,
                                  'type':'categories'
                              }
                            },
                            'child':{
                                'data':{
                                    'id':selectedProduct.id,
                                    'type':selectedProduct.type
                                }
                            }
                        }
                    }
                };
                try{

                    let newSavedCat = await categoryStore.storeAttached(this.category.id, data);

                    if(newSavedCat.type === 'products'){
                        this.allChildren.push(await productStore.productByID(newSavedCat.id));

                         for(let y = 0; y < this.allChildren.length; y++){
                            if(this.allChildren[y].id === newSavedCat.id){
                                 this.allChildren[y].attributes.node_id = newSavedCat.node_id;
                            }
                        }

                    }else{

                        this.allChildren.push(await categoryStore.categoryByID(newSavedCat.id));
                        for(let y = 0; y < this.allChildren.length; y++){
                            if(this.allChildren[y].id === newSavedCat.id){
                                 this.allChildren[y].attributes.node_id = newSavedCat.node_id;
                            }
                        }

                    }
                    event.emit(event.names.USER_MESSAGE, 'Attached successfully', 'success');
                }catch(error){
                    sharedStore.hideLoadingPage();
                    console.log(error);
                }
            },

            async removeAttached(key){

                let node = this.allChildren[key];

                try {
                    await categoryStore.removeChild(node.attributes.node_id);
                    this.allChildren.splice(key,1);
                    this.rearrangeAttached(key);
                } catch (error) {
                    sharedStore.hideLoadingPage();
                    console.log(error);
                }
            },

            updateAttached(node){

                if(node.attributes.type.includes('Category')){
                    node.attributes.type = 'categories'
                }else if(node.attributes.type.includes('Product')){
                    node.attributes.type = 'products'
                }


                let data = {
                    'data':{
                        'type':'nodes',
                        'id':node.attributes.node_id.toString(),
                        'attributes':{
                            'category_id':this.category.id,
                            'order':node.attributes.order,
                        },
                        'relationships': {
                            'child': {
                                'data': {
                                    'id': node.attributes.node_id.toString(),
                                    'type': node.attributes.type.type
                                }
                            }
                        }
                    }
                };

                return categoryStore.updateProducts(node.attributes.node_id, data);

            },

            rearrangeAttached(key){
                let newAttachedOrder = [];
                let node={};

                for(let t = key; t < this.allChildren.length;t++){
                    let childNodeID = this.allChildren[t].id;
                    node = this.findNode(childNodeID);
                    node.order = t+1;
                    newAttachedOrder.push(node);
                }

                for(let i =0; i < newAttachedOrder.length; i++){
                    this.updateAttached(newAttachedOrder[i]);
                }

            },

            findNode(id){
                for(let i = 0; i < this.category.attributes.children.length; i++){
                    if(id.toString() === this.category.attributes.children[i].id.toString()){
                        return this.category.attributes.children[i];
                    }
                }
            }

        }
    }
</script>

<style lang="scss">
    @import '~#/mixins';

    .categoryTitleColumn{
        width:40% !important;
    }

    .categoryProduct{

        cursor: move;

        &__title{
            width:20%;
        }

        &__active{
            width:10%;
            max-width:70px;
        }

        &__price{
            text-align:center;
            width: 15%;
            max-width: 130px;
        }

        &__overview{
            width:30%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        &__view{
            text-align:center;
            width:10%;
        }

        &__remove{
            text-align:center;
            width:10%;
        }

        &__partNumber{
            width: 15%;
            max-width: 160px;
        }

        &__order{
            text-align:center;
            width:10%;

            input{
                text-align: center;
            }
        }

    }

</style>