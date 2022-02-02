<template>
    <div id="attachedDocumentSection">
        <div id="attachedDocumentContainer" v-for="(document, key) in documentShown" :key="document.id">
            <img src="/images/pdf-icon.png">
            <div>
                {{document.attributes.title}}
            </div>
            <button @click="viewDocumentInfo(document)" class="btn btn-primary">
                More Info
            </button>
            <a target="_blank" href="#">
                <a :href="document.attributes.link" target="_blank" class="btn btn-success">
                    View Document
                </a>
            </a>
            <button class="btn btn-danger" @click="deleteDocument(document)">
                Delete
            </button>
        </div>

        <image-modal ref="documentInfo"/>

        <delete-modal ref="deleteImage"/>

    </div>
</template>

<script>

    import ImageModal from '@/components/modals/ImagesModal';
    import DeleteModal from '@/components/modals/areYouSureModal';
    import {event} from '@/services';

    export default {

        components:{ImageModal, DeleteModal},

        name: "attachedDocuments",

        props:['documents'],

        data(){
            return{
                documentShown:this.documents,
            }
        },

        methods:{
            viewDocumentInfo(document){
                this.$refs.documentInfo.openMediaModal(document, 'document');
            },

            deleteDocument(document){
                this.$refs.deleteImage.openDeleteModal('document', document);
            },
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    #attachedDocumentSection{
        max-height:650px;
    }

    #attachedDocumentContainer{
        width:100%;
        margin:0.5rem;
        font-size:1.5rem;

        img{
            width:3rem;
            height:3rem;
            margin-right:1rem;
        }

        div{
            display:inline-block;
            margin:0 1rem;
            width:30rem;
        }

        button, a{
            margin: 0 1rem;
            font-size: 1.4rem;
            color:#ffffff
        }
    }

</style>