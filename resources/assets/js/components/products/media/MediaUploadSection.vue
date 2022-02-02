<template>
    <div id="mediaUploadSection">
        <div style="max-height: 370px; overflow-y: auto;">
            <div>
                <h3>Upload new {{type}}</h3>
            </div>
            <div>
                <input v-if="type === 'images'" class="fileUpload" @change="pickFiles($event)" ref="fileupload" type="file" multiple accept="image/png, image/jpeg" name="imageUpload" data-vv-as="Images" >
                <input v-if="type === 'documents'" class="fileUpload" @change="pickFiles($event)" ref="fileupload" type="file" multiple accept="application/pdf" name="documentUpload">
            </div>
            <div v-if="(type==='images') && (tempUpload)">
                <img style="width: 150px; height: 150px;" :src="tempUpload">
            </div>
            <div v-for="(file, key) in uploadFiles" :key="key">
                <div>
                    <label>File Name:</label>
                    <span>{{file.file_title}}</span>
                </div>
                <div v-if="type == 'images'">
                    <div class="mediaInputSection">
                    <label for="imagesTitleInput">Title</label>
                    <input id="imagesTitleInput" type="text" v-model="file.title" name="imageTitleInput" data-vv-as="Title" v-validate="'required'" data-vv-scope="images">
                </div>
                <span class="error-message" v-for="error in errors.collect('images.imageTitleInput')" :key="error+'c'">{{ error }}</span>
                <div class="mediaInputSection">
                    <label for="imageAltTextInput">Alt Text</label>
                    <input id="imageAltTextInput" type="text" v-model="file.alt_tag" name="imageAltTextInput" data-vv-as="Alt Text" v-validate="'required'" data-vv-scope="images"/>
                </div>
                <span class="error-message" v-for="error in errors.collect('images.imageAltTextInput')" :key="error+'d'">{{ error }}</span>
                </div>
                <div v-if="type == 'documents'">
                <div class="mediaInputSection">
                    <label for="documentTitleInput">Title</label>
                    <input id="documentTitleInput" type="text" v-model="file.title" name="documentTitleInput" data-vv-as="Title" v-validate="'required'" data-vv-scope="documents">
                </div>
                <span class="error-message" v-for="error in errors.collect('documents.documentTitleInput')" :key="error+'e'">{{ error }}</span>
                <div class="mediaInputSection">
                    <label for="documentAltTextInput">Alt Text</label>
                    <input id="documentAltTextInput" type="text" v-model="file.alt_tag" name="documentAltTextInput" data-vv-as="Alt Text" v-validate="'required'" data-vv-scope="documents"/>
                </div>
                <span class="error-message" v-for="error in errors.collect('documents.documentAltTextInput')" :key="error+'f'">{{ error }}</span>
                </div>
                <div v-if="type === 'images'" class="mediaInputSection">
                    <label for="imageGalleryCheckboxInput">Assign to Image Gallery</label>
                    <input id="imageGalleryCheckboxInput" type="checkbox" v-model="file.gallery"/>
                </div>
                <div class="mediaInputSection">
                    <button class="btn btn-primary" :disabled="$validator.errors.any('images')" v-if="type == 'images'" @click="uploadMedia(key)">Save</button>
                    <button class="btn btn-primary" :disabled="$validator.errors.any('documents')" v-if="type == 'documents'" @click="uploadMedia(key)">Save</button>
                </div>
                <div class="mediaInputSection">
                    <button class="btn btn-danger" @click="removeMedia(key)">Remove</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {imageStore} from '@/stores';
    import {event} from '@/services';

    export default {
        props:['type'],

        data(){
            return{
                uploadFiles:[],
                tempUpload:null
            }
        },

        watch:{
            type(){
                this.uploadFiles = [];
                this.errors.clear();
            },
            view() {
                this.$refs.fileupload.value = null;
                this.errors.clear();
            }
        },

        mounted(){
            event.on(event.names.UPDATE_UPLOAD_LIST, (key)=>{
                this.uploadFiles.splice(key, 1);
            })

        },

        methods:{
            pickFiles(files){
                    this.uploadFiles.push({
                        'target': files.target.files[0],
                        'alt_tag': '',
                        'title': '',
                        'url': URL.createObjectURL(files.target.files[0]),
                        'file_title': files.target.files[0].name
                    });
                    if(this.type === 'images'){
                        this.uploadFiles[this.uploadFiles.length -1].gallery = true;
                    }
                    this.tempUpload = URL.createObjectURL(files.target.files[0]);
                    this.$refs.fileupload.value = null;
            },

            async uploadMedia(key){

                if(this.type == 'images') {
                    await this.$validator.validateAll('images');

                } else if (this.type == 'documents') {
                    await this.$validator.validateAll('documents');

                }
               if(this.type == 'images' && this.$validator.errors.any('images')) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               } else if(this.type == 'documents' && this.$validator.errors.any('documents')) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
               this.tempUpload = null;
               this.errors.clear();
                event.emit(event.names.SAVE_NEW_MEDIA,  this.type, this.uploadFiles[key], key);
            },

            removeMedia(key){
                this.uploadFiles.splice(key, 1);
            },
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    #mediaUploadSection{
        padding:1rem;
        border-bottom:0.1rem solid $border-color;

        input[type='file']{
            width: 9.5rem;
            overflow: hidden;
        }

        h3{
            margin-bottom:2rem;
        }
    }

    #multipleImageWarning{
        span{
            font-size:1.4rem;
            color:red;
        }
    }

    #imageGalleryCheckboxInput{
        width:10rem;
    }


</style>