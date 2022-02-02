<template>
    <div style="border:1px solid black; border-radius:5px; padding:10px;">
        <h3 @click="changeDisplay()" style="display:block;">{{currentSection.title}}</h3>
        <div v-show="active">
            <div>
                <label style="display:inline-block">Title</label>
                <input type="text" v-model="currentSection.title">
            </div>
            <div>
                <label>Content</label>
                <textarea v-model="currentSection.contents"></textarea>
            </div>
            <div>
                <label>Active</label>
                <input type="checkbox" :value="currentSection.active">
            </div>
            <div>
                <label>Order</label>
                <input type="number" :value="currentSection.order">
            </div>
            <button class="btn btn-primary" @click="saveSection()">Save Section</button>
            <button class="btn btn-danger" @click="removeSection()">Remove</button>
        </div>
    </div>
</template>

<script>
    import {productStore} from "@/stores";
    import {event} from '@/services';

    export default {
        props:['section' ,'index'],

        data(){
            return{
                currentSection:this.section,
                active:false
            }
        },

        watch:{
            section:{
                handler: function () {
                    this.currentSection = this.section;
                },
                deep: true
            },
        },

        methods:{
            changeDisplay(){
                this.active = !this.active;
            },

            async saveSection(){
                let data = {
                    'data':{
                        'attributes':this.currentSection,
                        'type':'product-page-sections',
                    }
                };

                if(this.currentSection.id){
                    data.data.id = this.currentSection.id;

                    productStore.updateProductSections(data, this.currentSection.id);

                }else{
                    let section = await productStore.saveProductSections(data, this.currentSection.product_id);
                    event.emit(event.names.ADD_SECTION, section, this.index);
                }
            },

            removeSection(){
                if(this.currentSection.id){
                    productStore.deleteSection(this.currentSection.id, this.index)
                }else{
                    event.emit(event.names.REMOVE_SECTION, this.index);
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>