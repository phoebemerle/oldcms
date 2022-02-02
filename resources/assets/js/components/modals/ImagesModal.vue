<template>
    <div v-show="modal" class="modalContainer">
        <div  id="ModalImageInfoSection">
            <div class="closeModal" @click="closeMediaModal"></div>
            <div v-show="showImageSection">
                <div id="imageModalPreview">
                    <div>
                        <img :src="url">
                    </div>
                </div>

                <div id="imageModalInfo">
                    <div class="imageInfoInput">
                        <label for="imageTitle">Image Title</label>
                        <input id="imageTitle" v-model="title" type="text" name="imageTitle" data-vv-as="Title" v-validate="'required'" data-vv-scope="images">
                    </div>
                    <span class="error-message" v-for="error in errors.collect('images.imageTitle')" :key="error+'a'">{{ error }}</span>
                    <div class="imageInfoInput">
                        <label for="imageAltTag">Alt Tags</label>
                        <input id="imageAltTag" v-model="alt_tag" type="text" name="imageAltTag" v-validate="'required'" data-vv-as="Alt Tag" data-vv-scope="images">
                    </div>
                    <span class="error-message" v-for="error in errors.collect('images.imageAltTag')" :key="error+'b'">{{ error }}</span>
                </div>
            </div>
            <div  v-show="showDocumentSection" id="modalDocumentsInfo">
                <div class="imageInfoInput">
                    <label for="documentTitle">Document Title</label>
                    <input id="documentTitle" v-model="title" type="text" name="documentTitle" data-vv-as="Title" data-vv-scope="documents" v-validate="'required'">
                </div>
                <span class="error-message" v-for="error in errors.collect('documents.documentTitle')" :key="error+'c'">{{ error }}</span>
                <div class="imageInfoInput">
                <label for="documentAltTag">Alt Tags</label>
                <input id="documentAltTag" v-model="alt_tag" type="text" name="documentAltTag" data-vv-as="Alt Tag" data-vv-scope="documents" v-validate="'required'">
            </div>
            <span class="error-message" v-for="error in errors.collect('documents.documentAltTag')" :key="error+'d'">{{ error }}</span>
            </div>
            <div style="text-align:center;">
                <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveInfo()">Update</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {event} from '@/services';

    export default {
        name: "ImagesInfo",

        props:[],

        data(){
            return{
                modal:false,
                showImageSection:false,
                showDocumentSection:false,
                title:'',
                alt_tag:'',
                type:'',
                id:'',
                url:''
            }
        },

        watch: {
            modal() {
                this.$validator.reset();
            }
        },

        methods:{
            openMediaModal(passedDetails, type){
                this.type = type;
                this.modal = true;
                this.title = passedDetails.attributes.title;
                this.alt_tag = passedDetails.attributes.alt_tag;
                this.id = passedDetails.id;
                this.url = passedDetails.attributes.url;

                if(type === 'images') {
                    this.showImageSection = true;
                }else if(type === 'document'){
                    this.showDocumentSection = true;
                }
            },

            closeMediaModal(){
                this.modal = false;
                this.showImageModal = false;
                this.showDocumentSection = false;
            },

            setDetails(){
                return {
                    'id':this.id,
                    'attributes': {
                        'title': this.title,
                        'alt_tag': this.alt_tag,
                    },
                };

            },

            async saveInfo(){
                if(this.showImageSection) {
                    await this.$validator.validateAll('images');
                } else if (this.showDocumentSection) {
                    await this.$validator.validateAll('documents');
                }
               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
                let details = this.setDetails();

                event.emit(event.names.UPDATE_MEDIA_INFO, 'save', this.type, details);
                this.closeMediaModal();
            },
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    #imageGalleryCheck{

        label{
            width:50%;
            display:inline-block;
        }

        input{
            width:15px;
            height:15px;
            display:inline-block;
        }

    }

    #ModalImageInfoSection{
        width: 40%;
        height: 280px;
        background-color: #FFF;
        padding: 10px;
        border: 1px solid #c9c9c9;
        border-radius: 5px;
        position: absolute;
        top:150px;

        button{
            font-size:15px;
        }

        .btn-primary{
            margin-right:20px;
        }
    }

    #imageModalPreview{
        width:49%;
        padding:10px;
        vertical-align: top;
        display:inline-block;

        div{
            width:70%;
            margin:0 auto;
        }

        img{
            width:100%;
            max-width:200px;
            max-height:200px;
        }
    }

    #imageModalInfo{
        width:49%;
        display:inline-block;
    }

</style>