<template>
    <div style="padding:10px;">
        <div>
            <input :disabled="!socialid" class="fileUpload" @change="pickFiles($event)" type=file accept="image/png, image/jpeg" name="image" data-vv-as="Image" v-validate="'required'">
            <br>
            <span class="error-message" v-for="(error, index) in errors.collect('image')" :key="index">{{error}}</span>
        </div>
        <div>
            <label>Title</label>
            <input :disabled="!socialid" v-model="newImage.attributes.title" type="text" data-vv-as="Image Title" name="imgTitle" v-validate="'required'"/>
            <br>
            <span class="error-message" v-for="(error, index) in errors.collect('imgTitle')" :key="index">{{error}}</span>
        </div>
        <div>
            <label>Alt Tags</label>
            <input :disabled="!socialid" v-model="newImage.attributes.alt_tag" type="text" data-vv-as="Alt Tag" name="imgAltTag" v-validate="'required'"/>
            <br>
            <span class="error-message" v-for="(error, index) in errors.collect('imgAltTag')" :key="index">{{error}}</span>
        </div>
        <div v-if="newImageTemp" class="imageSection">
            <img class="tempImage" :src="newImageTemp"/>
        </div>
        <div>
            <button :disabled="$validator.errors.has('imgTitle') || $validator.errors.has('imgAltTag') || !socialid" @click="saveNewImage()">Save new Icon</button>
        </div>
    </div>
</template>

<script>
    import {http} from '@/services';
    import {footerContactInfoStore} from '@/stores';
    import {imageStore} from '@/stores';
    import {cdnStore} from '@/stores';
    import {sharedStore} from '@/stores';
    import {event} from "../../../services";


    export default {
        name: "NewSocialIcon",

        components:{},

        props:['image' ,'socialid'],

        data(){
            return{
                newImage:{
                    'attributes': {
                        'alt_tag': '',
                        'title': '',
                        'url':'',
                        'image_id': '',
                    }
                },
                newImageTemp: '',
            }
        },

        watch:{
          image(){

          }
        },

        methods:{

            pickFiles(files){
                this.newImage.attributes.target = files.target.files[0];
                 this.newImageTemp = URL.createObjectURL(files.target.files[0])
            },


           async saveNewImage(){
                await this.$validator.validateAll();
                if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                }
                let savedImage = await this.saveImageToCDN(this.newImage);

                await this.savingNewImage(savedImage);
                
                sharedStore.hideLoadingPage();
            },

            async saveImageToCDN(mediaInfo) {
                try {
                    let formData = new FormData();

                    formData.append('file', mediaInfo.attributes.target);
                    this.newImage.attributes.image_id = await cdnStore.uploadToCDN(formData);

                    return this.newImage;

                } catch (error) {
                    console.log(error);
                }
            },

            async savingNewImage(newImage) {
                let data = {
                    'data': {
                        'attributes': {
                            'title': this.newImage.attributes.title,
                            'alt_tag': this.newImage.attributes.alt_tag,
                            'source': 'CDN',
                            'source_id': this.newImage.attributes.image_id.filename,
                        }
                    }
                };

                try {
                    let tempImage = await imageStore.create(data);

                    await event.emit(event.names.SAVE_NEW_ICON,  'socialIcon', tempImage, this.socialid);

                    event.emit(event.names.USER_MESSAGE, 'Your image was uploaded successfully', 'success');

                     this.newImage.attributes.title = '';
                    this.newImage.attributes.alt_tag = '';
                    this.newImageTemp = '';

                } catch (error) {
                    event.emit(event.names.USER_MESSAGE, 'There was a problem uploading your image', 'error');
                }

                sharedStore.hideLoadingPage();
            },
        }
    }
</script>


<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>