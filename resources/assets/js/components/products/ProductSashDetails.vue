<template>
    <div class="details-form">
        <div class="details-form__body form-sections">
            <div>
                <h3>Product Sash Details:</h3>
            </div>
           
            <div id="productSashTitleSection">
                <label for="productSashTitle">Product Sash Title: </label>
                <input id="productSashTitle" v-model="title" type="text" title="Product Sash Title" name="productSashTitle" placeholder="Please enter the product sash title" required>
            </div>

             <div id="productSashPrioritySection">
                <label for="productSashPriority">Product Sash Priority: </label>
                <input id="productSashPriority" v-model="priority" type="number" title="Product Sash Priority" name="productSashPriority" placeholder="Please enter the product sash priority">
            </div>

             <div> 
                    <label for="sashImageTitle">Image Title: </label>
                    <input v-model="imageTitle" id="sashImageTitle" type="text"/>
                </div>
                <div>
                    <label for="sashImageAlt">Image Alt Tag: </label>
                    <input v-model="alt_tag" id="sashImageAlt" type="text"/>
                </div>
                

                <div>
                    <input class="fileUpload" @change="pickFiles($event)" ref="fileupload" type="file" multiple accept="image/png, image/jpeg" name="imageUpload" style="width:9.5rem;">
                </div>

                <div v-if="tempUpload">
                    <img style="width: 150px; height: 150px;" :src="tempUpload">
                </div>

                 <div class="brandImageSection" v-if="sashPath.url">
                <div class="brandImageSection__Info">
                    <div class="brandImageSection__Info__Image">
                        <img :src="sashPath.url"/>
                    </div>
                </div>
                </div>
           

                <div>

                    <button class="btn btn-primary" @click="saveSashInfo()">Save Sash Info</button>
                </div>
        </div>
           
        </div>
</template>

<script>
    import {event} from '@/services';
    import {imageStore} from '@/stores';
    import {http, endPoints} from '@/services';
    import {productSashesStore} from '@/stores';
    import {cdnStore} from '@/stores';

    export default {
        name: "ProductSashDetails",

        props:['productsash', 'type'],

        data(){
            return{
                title: '',
                priority: '',
                imageTitle: '',
                alt_tag: '',
                source: 'CDN',
                source_id: null,
                 uploadFile: '',
                tempUpload:null,

                sashPath: {
                    url: '',
                },
                
            }
        },


        watch:{

            type() {
                if(this.type === 'product-sash-details') {
                    this.uploadFiles = '';
                    this.setData();
                }else{
                    this.resetSash();
                }
            },


            productbadge: {
                handler: function() {
                    this.$refs.fileUpload.value = null
                     if((this.productsash) && (this.productsash.attributes === "product_sash")) {
                         this.setData();
                    }
                }
            }, 
        },

        methods: {

            async setData(){
                this.title = this.productsash.attributes.title;
                this.priority = this.productsash.attributes.priority;

                this.imageTitle = this.productsash.sashImage.title;
                this.alt_tag = this.productsash.sashImage.alt_tag;

                this.source_id = this.productsash.sashImage.source_id;

                this.getImage();

            },

            resetSash(){
                this.priority='';
                this.title = '';
                this.alt_tag = '';
                this.imageTitle = '';
                this.source_id = null;
                this.tempUpload = '';
                this.uploadFile = '';
                this.sashPath = {};               
            },

            pickFiles(files){
                this.uploadFile = 'null';
                    this.uploadFile = ({
                        'target': files.target.files[0],
                        'url': URL.createObjectURL(files.target.files[0]),
                        'ext': files.target.files[0].name.split('.').pop()
                    });

                    this.tempUpload = URL.createObjectURL(files.target.files[0]);
                    this.$refs.fileupload.value = null;
                    this.sashPath.url = null;

            },


             async getImage(){

                 let data ={
                    'id':this.productsash.attributes.image_id
                };

                let sashPath = await imageStore.loadImages(data, 'productsashes');

                // let CDNImage = await cdnStore.getFromCDN(sashPath.attributes.source_id);

                // this.sashPath = CDNImage.data;

                this.sashPath.url = endPoints.cdnFile + sashPath.attributes.source_id;

            },
             
            

            async saveSashInfo() {

                if(this.tempUpload != null && this.tempUpload !== '' ){

                   let date = Date.now();

                   let fullimageTitle = this.imageTitle + date + '.' + this.uploadFile.ext;

                    let config = {
                         baseUrl: 'https://comximages.blob.core.windows.net/files/' + imageTitle,
                        sasToken: '?sp=racwdl&st=2021-07-28T13:16:02Z&se=9999-07-28T21:16:02Z&sv=2020-08-04&sr=c&sig=1KN8ToISVp4OfR6C7UZWNnyC1r4wL6hl1pIfBzS6hAI%3D',
                        file: this.uploadFile.target,
                        progress: '',
                        complete: '',
                        error: '',
                    }

                    let cdn = await this.$azureUpload(config);


                //  let fb = new FormData();

                // fb.append('file', this.uploadFile.target);


                //  let cdn = await cdnStore.uploadToCDN(fb);

                let data = {
                    'data': {
                        'type': 'images',
                        'attributes': {
                            'title': this.imageTitle,
                            'alt_tag': this.alt_tag,
                            'source':'CDN',
                            'source_id':fullimageTitle
                        },
                    }
                };

                let newImage = await imageStore.create(data);

                this.source_id = newImage.id;
                
                }

               let data = {
                   'data': {  
                       'type': 'product_sash',
                       'attributes': {
                           'title': this.title,
                           'image_id': this.source_id,
                           'priority': this.priority
                       }
                   }
               };

               if(this.type === 'product-sash-details') {
                   data.data.id = this.productsash.id;
                   
                   try {
                       await productSashesStore.update(data, this.productsash.id);

                   } catch (error) {
                       console.log(error);
                       event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error')
                   }
               }

               else if(this.type === 'create-product-sash'){
                   await productSashesStore.createSash(data);
               }
           },

        

        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

    #productSashDetails{


        input[type="text"]{
            width:100px;
        }
        
    }

    .brandImageSection {

        padding-bottom: 20px;
    }

</style>