<template>
    <div>
        <div v-show="deleteModal" class="modalContainer">
            <div  id="modalDeleteSection">
                <div class="closeModal" @click="closeDeleteModal()"></div>
                <div id="deleteSectionText">
                    <span>Are you sure you want to delete this {{type}} from the server</span><br>
                    <span class="areYouSure"><strong>This cannot be undone.</strong></span>
                </div>
                <div>
                    <button class="btn btn-danger" @click="deleteElement()">Delete</button>
                    <button class=" btn btn-primary" @click="closeDeleteModal()">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import {event} from '@/services';

    export default {

        data(){
            return{
                deleteModal:false,
                type:'',
                details:[]
            }
        },

        methods: {
            openDeleteModal(type, info) {
                this.type = type;
                this.deleteModal = true;
                this.details=info;
            },

            closeDeleteModal() {
                this.deleteModal = false;
            },

            deleteElement(){
                event.emit(event.names.UPDATE_MEDIA_INFO, 'delete', this.type, this.details);
                this.closeDeleteModal();
                }
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";

    #modalDeleteSection{
        width: 30%;
        height: 15rem;
        background-color: #FFF;
        padding: 1rem;
        border: 0.1rem solid #c9c9c9;
        border-radius: 0.5rem;
        position: absolute;
        top: 15rem;
        text-align:center;

        button{
            font-size:1.4rem;
            margin:0 1.5rem;
        }
    }

    #deleteSectionText{
        font-size:1.6rem;
        margin:2rem 0;
    }

</style>