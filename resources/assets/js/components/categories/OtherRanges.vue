<template>
    <div id="otherRangesContainer">
        <div class="attached_container" id="otherRangesSection">
            <h3>Other Category Ranges</h3>
            <table class="table table-hover attachedTable otherRanges">
                <tr>
                    <th class="otherRanges-Name">Category Name</th>
                    <th class="otherRanges-Name">Overview</th>
                    <th class="otherRanges-Name">Attached Type</th>
                    <th class="otherRanges-Remove"><span>Remove</span></th>
                </tr>
                <tr v-if="otherRanges.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No Other Ranges Added Yet</span>
                    </td>
                </tr>
                <draggable @change="setNewAttachedOrder()" v-model="otherRanges">
                <tr v-show="otherRanges.length > 0" v-for="(range, key) in otherRanges" :key="key">
                    <td class="otherRanges-Name">{{ range.attributes.title}}</td>
                    <td class="otherRanges-Name" v-html="range.attributes.long_desc"></td>
                    <td class="otherRanges-Name" v-html="range.attributes.attached_type"></td>
                    <td class="otherRanges-Remove attachedTableRemove" @click="removeAttached(key)"><i class="fas fa-trash"></i></td>
                </tr>
                </draggable>
            </table>
            <button class="btn btn-primary" @click="updateAttachedOrder()">Update Order</button>
        </div>
        <category-search type="attachOtherRanges" :category="category"/>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {categoryStore} from '@/stores';
    import CategorySearch from '@/components/categories/CategorySearch';
    import {sharedStore} from "@/stores";
    import draggable from 'vuedraggable';

    export default {
        name: "OtherRanges",

        components:{CategorySearch, draggable},

        props:['category', 'range'],

        data(){
            return{

                type:'attachOtherRanges',
                otherRanges: [],
                updated: []
            }
        },

        watch:{

            range(){
                this.otherRanges = this.range;

                if(this.otherRanges.length > 0) {
                    this.otherRanges = this.sortOtherRanges(this.otherRanges);
                }
            },

        },

        mounted(){
                event.on(event.names.UPDATE_ATTACHED_RANGES, (selected) =>{
                    let count = 0;
                    if(selected.id === this.category.id){
                        event.emit(event.names.USER_MESSAGE, 'You cannot attach the same category to itself could not be attached', 'error');
                    }else{
                        for (let i = 0; i < this.otherRanges.length; i++) {
                            if (this.otherRanges[i].id.toString() === selected.id.toString()) {
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
                    }

            });      
        }, 

        methods:{

            sortOtherRanges(range) {

                return range.slice().sort(function(a, b) {
                    return a.order - b.order;
                });
            },

            updateAttachedOrder(){
                for(let i =0; i < this.updated.length; i++){
                    this.updateAttached(this.updated[i]);
                }
            },

            setNewAttachedOrder(){
                for(let y = 0; y < this.otherRanges.length; y++){
                    let oldOrder = this.otherRanges[y].order;
                    let newOrder = y+1;
                    this.otherRanges[y].order = newOrder;
                    

                    if(oldOrder !== newOrder){
                        this.addToUpdateArray(this.otherRanges[y]);
                        // this.addAttachedID();
                    }
                }
            },

            addAttachedID(){
                for(let y = 0; y < this.otherRanges.length; y++){

                let range = this.findOtherRange(this.otherRanges[y].id);

                this.otherRanges[y].attached_id = range.attached_id;

                }
            },

            addToUpdateArray(category){
                let count = null;
                if(this.updated.length > 0) {
                    for (let y = 0; y < this.updated.length; y++) {
                        if(this.updated[y].id === category.id){
                            count = y;
                        }
                    }
                }
                if(count != null){
                    this.updated.splice(count, 1);
                }
                this.updated.push(category);

            },

            async storeAttached(selectedCategory) {
                let data = {
                    'data': {
                        'type': 'otherranges',
                        'attributes': {
                            'cat_id':this.category.id,
                            'other_range_id':selectedCategory.id,
                            'order':this.range.length + 1
                        }
                    }
                };

                try{
                    let newSavedCategory = await categoryStore.storeOtherRange(this.category.id, data);

                    this.otherRanges.push(newSavedCategory);

                    event.emit(event.names.USER_MESSAGE, 'Category was attached successfully', 'success');
                }catch(error){
                    sharedStore.hideLoadingPage();
                    console.log(error);
                }
            },

            async removeAttached(key){

                let range = this.findOtherRange(this.otherRanges[key].id);

                try {
                    await categoryStore.removeRange(range.attached_id);
                    this.otherRanges.splice(key,1);
                    this.rearrangeAttached(key);
                    event.emit(event.names.USER_MESSAGE, 'Category was detached successfully', 'success')
                } catch (error) {
                    sharedStore.hideLoadingPage();
                    console.log(error);
                }
            },

            updateAttached(range){
                
                let rangeNew = this.findOtherRange(range.id);


                let data = {
                    'data':{
                        'type':'otherranges',
                        'id': rangeNew.attached_id.toString(),
                        'attributes': {
                            'other_range_id':rangeNew.other_range_id,
                            'cat_id':this.category.id,
                            'order': rangeNew.order,
                        }
                    }
                }

                categoryStore.updateAttached(rangeNew.attached_id, data);
            },

            rearrangeAttached(key){
                let newAttachedOrder = [];
                let range={};

                for(let t = key; t < this.otherRanges.length;t++){
                    let otherRangeID = this.otherRanges[t].id;
                    range = this.findOtherRange(otherRangeID);
                    range.order = t+1;
                    newAttachedOrder.push(range);
                }

                for(let i =0; i < newAttachedOrder.length; i++){
                    this.updateAttached(newAttachedOrder[i]);
                }

            },

            findOtherRange(id){
                for(let i = 0; i < this.category.attributes.otherranges.length; i++){
                    if(id.toString() === this.category.attributes.otherranges[i].other_range_id.toString()){
                        return this.category.attributes.otherranges[i];
                    }
                }
        },
            

        },
    }
</script>

<style lang="scss">
    @import "~#/variables";
        .otherRanges{

            &-Name{
                width:25%;
            }

            &-Desc{
                width:55%;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            &-Remove{
                text-align: center;
                width:12.5%;
            }
        }
</style>