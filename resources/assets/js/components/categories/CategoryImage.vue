<template>
    <div class="details-form">
        <div class="details-form__body">
            <h3>New Image Upload</h3>
            <div>
                <div>
                    <label for="newImage">Upload New Image</label>
                    <input class="fileUpload" id="newImage" type="file" multiple accept="image/png, image/jpeg" ref="fileUpload" data-vv-scope="newImage" v-validate="'image|required'" data-vv-as="Image" name="newImage" @change="pickFiles($event)"/>
                </div>
                <span class="error-message" v-for="error in errors.collect('newImage.newImage')" :key="error+'a'">{{ error }}</span>
                <div v-if="newImageTemp">
                    <img  style="max-width:100px;"  :src="newImageTemp"/>
                </div>
                <div>
                    <label for="newImageTitle">Image Title</label>
                    <input v-model="newImageTitle" id="newImageTitle" name="newImageTitle" data-vv-as="Title" data-vv-scope="newImage"  v-validate="'required'" type="text"/>
                </div>
                <span class="error-message" v-for="error in errors.collect('newImage.newImageTitle')" :key="error+'b'">{{ error }}</span>
                <div>
                    <label for="newImageAlt">Alt Tag</label>
                    <input v-model="newImageAlt" id="newImageAlt" type="text" name="newImageAlt" data-vv-as="Alt Tag" data-vv-scope="newImage"  v-validate="'required'"/>
                </div>
                <span class="error-message" v-for="error in errors.collect('newImage.newImageAlt')" :key="error+'c'">{{ error }}</span>
                <br>
                <button :disabled="$validator.errors.any('newImage')" @click="saveNewImage()">Save New Image Info</button>
            </div>
        </div>

        <div v-if="savedImage.id" class="details-form__body">
            <h3>Uploaded Image Details</h3>
            <!-- {{savedImage}}  -->
            <div>
                <div>
                    <img style="max-width:100px;" :src="url"/>
                </div>
                <div>
                    <label for="savedImageTitle">Image Title</label>
                    <input v-model="savedImage.attributes.title" id="savedImageTitle" type="text" name="savedImageTitle" data-vv-scope="uploadedImage" v-validate="'required'" data-vv-as="Title"/>
                </div>
                <span class="error-message" v-for="error in errors.collect('uploadedImage.savedImageTitle')" :key="error+'d'">{{ error }}</span>
                <div>
                    <label for="savedImageAlt">Alt Tag</label>
                    <input v-model="savedImage.attributes.alt_tag" id="savedImageAlt" type="text" name="savedImageAlt" data-vv-scope="uploadedImage" v-validate="'required'" data-vv-as="Alt Tag"/>
                </div>
                <span class="error-message" v-for="error in errors.collect('uploadedImage.savedImageAlt')" :key="error+'e'">{{error}}</span>
                <br>
                <button @click="updateImage()" :disabled="$validator.errors.any('uploadedImage')">Update Image Info</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {imageStore} from '@/stores';
    import {cdnStore} from '@/stores';
    import {categoryStore} from "@/stores";
    import {http, endPoints} from '@/services';
    import {event} from '@/services';

    export default {
        props:['category', 'tab'],

        data(){
            return{
                'savedImage':{
                    'attributes':{
                        'title': "",
                        'alt_tag': "",
                        'source': "CDN",
                        'source_id': null,
                        'thumbnail_source_id': null,
                        'url': ''
                    },
                    'id': null,
                    'type': "images"
                },
                'newImage':{},
                'newImageTitle':'',
                'newImageAlt':'',
                'newImageTemp':null,
                'url': null
            }
        },

        watch:{
            tab() {
                this.$validator.reset();
            },

            category(){
                this.$refs.fileUpload.value = null;
                if(this.category){
                    if(this.category.type === 'categories') {
                        if (this.category.attributes.image.id) {
                            this.getImage();
                        } else if (this.category.attributes.image === null) {
                            this.resetValues();
                        }
                    }
                }
            },
            savedImage: {
                deep: true,
                async handler() {

                }
            }
        },

        methods:{
            async getImage(){
                if(this.category.attributes.image.id) {
                    let data = {
                        'id': this.category.attributes.image.id
                    };

                    this.savedImage.attributes = this.category.attributes.image;
                    this.savedImage.id = this.category.attributes.image.id
                    // let cdnImage = await cdnStore.checkCDN(this.savedImage.attributes.source_id);
                    this.savedImage.attributes.url = endPoints.cdnFile + this.savedImage.attributes.source_id;
                    if(this.savedImage.attributes.thumbnail_source_id) {
                        this.url = endPoints.cdnFile + this.savedImage.attributes.thumbnail_source_id;
                    } else {
                        this.url = endPoints.cdnFile + this.savedImage.attributes.source_id;
                    }
                }else{
                    this.resetValues();
                }
            },

            resetValues(){
              this.newImage = {};
              this.newImageTitle = '';
              this.newImageAlt = '';
              this.newImageTemp = null;
              this.savedImage ={
                'attributes:':{
                    'title': "",
                        'alt_tag': "",
                        'source': "CDN",
                        'source_id': null,
                        'thumbnail_source_id': null,
                        'url': ''
                },
                'id': null,
                    'type': "images"
              }
            },

            pickFiles(files){
                this.newImage = files.target.files[0];
                this.newImageTemp = URL.createObjectURL(files.target.files[0])
            },

            async saveNewImage(){

                await this.$validator.validateAll('newImage');

                if(this.$validator.errors.any('newImage')) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                }

                // Upload to CDN (via catalogue)
                let fb = new FormData();

                fb.append('file', this.newImage);
                fb.append('category_id', this.category.id);
                fb.append('title', this.newImageTitle);
                fb.append('alt_tag', this.newImageAlt);

                let img = await categoryStore.uploadImage(fb);
                
                this.newImage = {};
                this.newImageTitle = '';
                this.newImageAlt = '';
                this.newImageTemp = null;
                this.$refs.fileUpload.value = null;
                this.$validator.reset();

                this.savedImage = img;

                if(img.attributes.thumbnail_source_id) {
                    this.url = endPoints.cdnFile + img.attributes.thumbnail_source_id;
                } else {
                    this.url = endPoints.cdnFile + img.attributes.source_id;
                }
            },

            async updateImage(){
                await this.$validator.validateAll('uploadedImage');

                if(this.$validator.errors.any('uploadedImage')) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                }

                let data = http.createData(this.savedImage);

                imageStore.update(this.savedImage.id, data);
            }
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";

    .fileUpload{
        border:none!important;
    }
</style>