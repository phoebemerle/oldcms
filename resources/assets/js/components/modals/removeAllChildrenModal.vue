<template>
    <div>
        <div v-show="childrenModal" class="modalContainer">
            <div  id="childrenModalSection">
                <div class="closeModal" @click="closeChildrenModal()"></div>
                <div id="deleteSectionText">
                    <span>If you change what this category contains then all children attached will be removed</span><br>
                    <span class="areYouSure"><strong>This cannot be undone.</strong></span>
                </div>
                <div>
                    <button class="btn btn-danger" @click="updateCategory()">Continue</button>
                    <button class=" btn btn-primary" @click="closeChildrenModal()">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {categoryStore} from '@/stores';
    import {EventBus} from '@/components/categories/CategoriesMain';
    import Vue from 'vue';

    export default {

        data(){
            return{
                childrenModal:false,
                id:'',
                details:[],
                attachedType: '',
            }
        },

        methods: {
            openChildrenModal(id, data, oldData) {
                this.id = id;
                this.childrenModal = true;
                this.details = data;
                this.category = oldData;
            },

            closeChildrenModal() {
                this.childrenModal = false;
            },

            async updateCategory(){
                try {
                    categoryStore.detatchChildren(this.id);
                    await categoryStore.update(this.details, this.category);
                    this.closeChildrenModal();
                } catch (error) {
                    console.log(error);
                }

            }
        }
    }
</script>


<style lang="scss">
    @import "~#/variables";

    #childrenModalSection{
        width: 30%;
        height: 18rem;
        background-color: #FFF;
        padding: 1rem 5rem;
        border: 0.1rem solid #c9c9c9;
        border-radius: 0.5rem;
        position: absolute;
        top: 15rem;
        text-align: center;
    }


</style>