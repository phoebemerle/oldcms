<template>
    <div id="mediaContainer">
        <div>
            <ul class="list-inline overviewTabs"  style="margin-bottom:0;">
                <li v-bind:class="{ activeTab: tab === 'images'}" @click="changeMediaTab('images')" >Images</li>
                <li v-bind:class="{ activeTab: tab === 'documents'}" @click="changeMediaTab('documents')" class="">PDFs</li>
                <li v-bind:class="{ activeTab: tab === 'videos'}" @click="changeMediaTab('videos')" class="">Videos</li>
            </ul>
        </div>
        <div v-if="tab === 'images'" id="mediaImagesContainer">
            <div id="mediaImagesSection">
                <media-upload-section type="images" ref="imageUploadSection"/>
                <image-gallery ref="imageGallery" type="images" :media="attachedImages"/>
            </div>
        </div>
        <div v-if="tab === 'documents'" id="mediaDocumentsContainer">
            <div id="mediaDocumentsSection">
                <media-upload-section ref="DocumentUploadSection" type="documents"/>
                <attached-document :documents="attachedDocuments"/>
            </div>
        </div>
        <div v-if="tab === 'videos'" id="productVideoContainer">
            <div id="productVideoSection">
                <product-videos :product="product" :videos="videos"/>
            </div>
        </div>
    </div>
</template>

<script>
    import MediaUploadSection from '@/components/products/media/MediaUploadSection';
    import ImageGallery from '@/components/products/media/AttachedImages';
    import ImageModal from '@/components/modals/ImagesModal';
    import AttachedDocument from '@/components/products/media/attachedDocuments';
    import ProductVideos from '@/components/products/media/productVideo';
    import {event} from '@/services';
    import {imageStore} from '@/stores';
    import {documentStore} from '@/stores';
    import {cdnStore} from '@/stores';
    import {productStore} from '@/stores';
    import Vue from 'vue';


    export default {
        components:{MediaUploadSection, ImageGallery, ImageModal, AttachedDocument, ProductVideos},

        props:['product' ,'images', 'documents'],

        data(){
            return{
                tab:'images',
                attachedImages:[],
                attachedDocuments:[],
                videos:[]
            }
        },

        watch:{
            images(){
                this.attachedImages = this.images;
            },

            documents(){
                this.attachedDocuments = this.documents;
            },

            product(){
                if(this.product && this.product.type ==='products'){
                    if(this.product.attributes.videoGallery.length > 0) {
                        this.videos = this.product.attributes.videoGallery;
                    }else{
                        this.videos = [
                            {
                                'embedded_code':'',
                                'order':1,
                                'active':'',
                                'id': ''
                            }
                        ]
                    }
                }
            }
        },

        methods:{
            changeMediaTab(tab) {
                this.tab = tab;
            },

            async deleteDocument(id){

              let deletedDoc = await documentStore.delete(id);

              if(deletedDoc === 1){
                  for (let h = 0; h < this.attachedDocuments.length; h++) {
                      if (this.attachedDocuments[h].id === id) {
                          this.attachedDocuments.splice(h, 1);
                      }
                  }
              }
                event.emit(event.names.USER_MESSAGE, 'Your document was deleted successfully', 'success');
            }
        },

    }
</script>


<style lang="scss">
    @import "~#/variables";

    #mediaImagesSection{
        border:1px solid $border-color;
        padding:10px;
        margin-bottom:10px;
        border-radius:5px;
    }

    #mediaDocumentsSection{
        border:1px solid $border-color;
        padding:10px;
        margin-bottom:10px;
        border-radius:5px;
    }

</style>
