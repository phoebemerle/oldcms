<template>
    <div>
        <div v-if="attachedMedia.length > 0" id="attachedImagesContainer">
            <ul class="list-inline overviewTabs" >
                <li v-bind:class="{ activeTab: tab === 'allImages' }" @click="imageFilter('allImages')" style="">All Images</li>
                <li v-bind:class="{ activeTab: tab === 'galleryImages' }" @click="imageFilter('galleryImages')" class="">Gallery Images</li>
            </ul>
            <div id="attachedImageSection">
                <div class="sourceFilter" >
                    <label for="sourceDropDown">Filter By Source:</label>
                    <select v-model="sourceFilter" id="sourceDropDown" @change="imageFilter(tab)" name="sourceDropDown" v-validate="'included:All,CDN,CNET|required'">
                        <option selected value="All" >All</option>
                        <option value="CDN">CDN</option>
                        <option value="CNET">CNET</option>
                    </select>
                </div>
                <span class="error-message" v-for="error in errors.collect('sourceDropDown')" :key="error+'a'">{{ error }}</span>
                <div v-show="tab === 'allImages'">
                    <ul>
                        <li v-for="(media, key) in imagesToView" :key="key">
                            <div class="attachedImageGallerySection">
                                <div>Order: {{media.attributes.order ? media.attributes.order : key+1}}</div>
                                <div class="attachedImageGalleryHolder">
                                    <img :src="'https://comximages.blob.core.windows.net/files/'+media.attributes.source_id"/>
                                </div>
                                <div class="attachedImageGalleryInfo" >
                                    <button class="btn btn-primary" @click="viewImageinfo(key)">More Info</button>
                                    <button class="btn btn-danger"  @click="deleteImage(media, 'gallery')">Delete</button>
                                </div>
                                <input v-model="media.attributes.gallery" type="checkbox" @change="galleryCheckbox(media.id, media.attributes.gallery)"><label>Gallery</label>
                            </div>
                        </li>
                    </ul>
                </div>

                <div v-show="tab === 'galleryImages'">
                    <p style="font-size:13px;">To set a new order simply just click and drag an image</p>
                    <ul>
                        <draggable @change="setNewGalleryOrder()" v-model="galleryImages">
                        <li v-for="(images, key) in imagesToView" :key="key">
                            <div class="attachedImageGallerySection">
                                <div class="attachedImageGalleryHolder">
                                    <img :src="'https://comximages.blob.core.windows.net/files/'+images.attributes.source_id"/>
                                </div>
                                <div class="attachedImageGalleryInfo" >
                                    <button class="btn btn-primary" @click="viewImageinfo(key)">More Info</button>
                                    <button class="btn btn-danger" @click="deleteImage(images, 'gallery')">Delete</button>
                                </div>
                                <input v-model="images.attributes.gallery" type="checkbox" @change="galleryCheckbox(images.id, galleryImages[key].attributes.gallery)"><label >Gallery</label>
                            </div>
                        </li>
                        </draggable>
                    </ul>
                </div>
            </div>
        </div>
        <div id="updateImages">
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="updateChangedImages()">Update Images</button>
        </div>
        <image-modal ref="imageInfo"/>

        <delete-modal ref="deleteImage"/>
    </div>
</template>

<script>
    import draggable from 'vuedraggable';
    import ImageModal from '@/components/modals/ImagesModal';
    import DeleteModal from '@/components/modals/areYouSureModal';
    import {event, endPoints} from '@/services';

    export default {
        components:{ImageModal, draggable, DeleteModal},

        props:['type', 'media'],

        data() {
            return {
                attachedMedia: this.media,
                tab:'allImages',
                galleryImages:[],
                nonGalleryImages:[],
                changedImages:[],
                imagesToView:[],
                sourceFilter:'All',
            }
        },

        mounted:function(){
            this.setGalleryImages();
        },

        watch:{
            media:{
                handler: function () {
                    this.updateImages();
                },
                deep: true
            },
            tab() {
                this.errors.clear();
            }
        },

        methods:{

            imageFilter(tab){
                this.tab = tab;
                this.imagesToView = [];
                let imageArray = [];


                if(tab === 'galleryImages'){
                    imageArray = this.galleryImages;
                }else if(tab === 'allImages'){
                    imageArray = this.attachedMedia;
                }

                if ((this.sourceFilter === 'CDN') || (this.sourceFilter === 'CNET')){
                    for(let i = 0; i < imageArray.length; i++){
                        if(imageArray[i].attributes.source === this.sourceFilter){
                            this.imagesToView.push(imageArray[i]);
                        }
                    }
                }else{
                    this.imagesToView = imageArray;
                }
            },

            galleryCheckbox(imageID, argument){
                
                let tempImage = [];

                if(argument === true) {
                    for (let g = 0; g < this.nonGalleryImages.length; g++) {
                        if(this.nonGalleryImages[g].id === imageID){
                            tempImage = this.nonGalleryImages[g];
                            tempImage.attributes.order = this.galleryImages.length + 1;

                            this.galleryImages.push(tempImage);
                            this.nonGalleryImages.splice(g, 1);
                        }
                    }
                }else if(argument === false){
                    for (let g = 0; g < this.galleryImages.length; g++) {
                        if(this.galleryImages[g].id === imageID){
                            tempImage = this.galleryImages[g];
                            tempImage.attributes.order = 0;
                            this.nonGalleryImages.push(tempImage);
                            this.galleryImages.splice(g, 1);
                            this.refreshOrder(g);
                        }
                    }
                }

                this.addToChangedArray(tempImage);

            },

            addToChangedArray(image){
                let count = null;
                if(this.changedImages.length > 0) {
                    for (let y = 0; y < this.changedImages.length; y++) {
                        if(this.changedImages[y].id === image.id){
                            count = y;
                            }
                        }
                }

                if(count != null){
                    this.changedImages.splice(count, 1);
                }

                this.changedImages.push(image);

            },

            deletedGalleryImage(id){
                let key = '';
                for(let y =0; y < this.galleryImages.length; y++){
                    if(this.galleryImages[y].id.toString() === id.toString()){
                        key = y;
                    }
                }
            },

            refreshOrder(key){
              for(let v = key; v < this.galleryImages.length; v++){
                  this.galleryImages[v].attributes.order = this.galleryImages[v].attributes.order - 1;
              }
            },

            viewImageinfo(key){
                this.$refs.imageInfo.openMediaModal(this.imagesToView[key], 'images');
            },

            deleteImage(media, galleryType){
                this.$refs.deleteImage.openDeleteModal('images', media, galleryType);
            },

            setGalleryImages(){
                this.galleryImages = [];
                this.nonGalleryImages = [];
                for (let l = 0; l < this.attachedMedia.length; l++) {
                    if (this.attachedMedia[l].attributes.gallery === 1 || this.attachedMedia[l].attributes.gallery === true) {
                        this.galleryImages.push(this.attachedMedia[l]);
                    }else if (this.attachedMedia[l].attributes.gallery === 0 || this.attachedMedia[l].attributes.gallery === false) {
                        this.nonGalleryImages.push(this.attachedMedia[l]);
                    }
                }

                if(this.galleryImages.length > 0) {
                    this.galleryImages = this.sortGalleryImages(this.galleryImages);
                }

                this.imageFilter(this.tab);

            },

            updateChangedImages(){
                event.emit(event.names.UPDATE_MEDIA_INFO, 'save', this.type, this.changedImages);
                this.changedImages =[];
                this.setGalleryImages();
                this.sortAllImages(this.imagesToView);
            },

            //Not here
            sortGalleryImages(images) {
                // Set slice() to avoid to generate an infinite loop!

                return images.slice().sort(function(a, b) {
                    return a.attributes.order - b.attributes.order;
                });
            },

            setNewGalleryOrder(){
                for(let y = 0; y < this.galleryImages.length; y++){
                    let oldOrder = this.galleryImages[y].attributes.order;
                    let newOrder = y+1;
                    this.galleryImages[y].attributes.order = newOrder;

                    if(oldOrder !== newOrder){
                        this.addToChangedArray(this.galleryImages[y]);
                    }
                }
                this.setGalleryImages();
            },

            async updateImages(){
             await this.$validator.validateAll('dropDown');
               if(this.tab == 'allImages') {
                   
                    if(this.$validator.errors.any('sourceDropDown')) {
                        return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                    }
               } else if(this.tab == 'galleryImages') {
                    if(this.$validator.errors.any('galleryImages')) {
                        return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                    }
               }

                this.attachedMedia = this.sortAllImages(this.media);
                this.setGalleryImages();
            },

            sortAllImages(images) {
                // Set slice() to avoid to generate an infinite loop!
                return images.slice().sort(function(a, b) {
                    return a.attributes.order - b.attributes.order;
                });
            },
        },
    }
</script>

<style lang="scss">
    @import "~#/variables";
    #attachedImagesContainer{
        margin-top:10px;
        max-height:650px;
        overflow-y:auto;

        .overviewTabs{
            margin-bottom:0;
        }
    }

    #attachedImageSection{
        border:1px solid $border-color;
        border-radius: 0 0.5rem 0.5rem 0.5rem;
        padding:1rem;
        min-height:465px;
        overflow-y:auto;

        li{
            display:inline-block;
            vertical-align: top;
            padding:1rem;
            margin-right:1rem;
        }
    }

    #updateImages{
        margin-top:5px;

        button{
            font-size:1.4rem;
        }
    }
</style>
