<template>
<div class="main-sections__editForm__container">
    <div class="details-form">
        <div class="details-form__body form-sections">
            <div>
                <h3>Badge Details:</h3>
            </div>
           
            <div id="productBadgePrioritySection">
                <label for="productBadgePriority">Badge Priority: </label>
                <input id="productBadgePriority" v-model="order" type="number" title="Product Badge Priority" name="productBadgePriority" placeholder="Please enter the product badge priority" required>
            </div>

            <div id="productBadgeDescriptionSection">
                <label for="productBadgeDescription">Description: </label>
                <input id="productBadgeDescription" v-model="description" type="text" title="Product Badge Description" name="productBadgeDescription" placeholder="Please enter the product badge description" required>
            </div>

            <div id="productBadgeURLSection">
                <label for="productBadgeURL">URL: </label>
                <input id="productBadgeURL" v-model="url" type="text" title="Product Badge URL" name="productBadgeURL" placeholder="Please enter the product badge url" required>
            </div>

        
                <div> 
                    <label for="badgeImageTitle">Image Title: </label>
                    <input v-model="title" id="badgeImageTitle" type="text"/>
                </div>
                <div>
                    <label for="badgeImageAlt">Image Alt Tag: </label>
                    <input v-model="alt_tag" id="badgeImageAlt" type="text"/>
                </div>
                

                  <div id="newBadgePathSection">
                    <label for="newBadgePath">Upload New Image: </label>
                    <input class="fileUpload" id="newBadgePath" type="file" multiple accept="image/png, image/jpeg" @change="pickFiles($event)"/>
                </div>
           
                <div class="brandImageSection" v-if="badgePath.url">
                <div class="brandImageSection__Info">
                    <div class="brandImageSection__Info__Image">
                        <img :src="badgePath.url"/>
                    </div>
                </div>
                </div>

                                <div class="brandImageSection" v-if="!badgePath.url &&badgePath.url">
                <div class="brandImageSection__Info">
                    <div class="brandImageSection__Info__Image">
                        <img :src="badgePath.url"/>
                    </div>
                </div>
                </div>

                <div>
                    <button class="btn btn-primary" @click="saveNewImage()">Save New Image</button>

                    <button class="btn btn-primary" @click="saveBadgeInfo()">Save Badge Info</button>
                </div>

            <div>
                <button class="btn btn-primary" @click="saveNewBadgeInfo()">Save New Badge</button>
            </div>

        </div>
            </div>
           
        </div>
</template>

<script>
    import {event} from '@/services';
    import {imageStore} from '@/stores';
    import {http, endPoints} from '@/services';
    import {productBadgesStore} from '@/stores';
    import {cdnStore} from '@/stores';

    export default {
        name: "ProductBadgeDetails",

        props:['productbadge', 'type'],

        data(){
            return{
                order:'',
                description:'',
                url: '',
                image_id: '',

                    badgeId: '',
                    title: '',
                    alt_tag: '',
                    source: 'CDN',
                    source_id: null,

                badgePath: {
                    url: '',
                },

                newBadgePath: {},
                
            }
        },


        watch:{

            type() {
                if(this.type === 'product-badge-details') {
                   this.setData();
                }else{
                    this.resetBadges();
                }
            },


            productbadge: {
                handler: function() {
                     if((this.productbadge) && (this.productbadge.attributes === "product_badge")) {
                         this.setData();
                    }
                }
            }, 
        },

        methods: {

            async setData(){
                this.order = this.productbadge.attributes.order;
                this.description = this.productbadge.attributes.description;
                this.url = this.productbadge.attributes.url;

                this.getImage();

            },

            resetBadges(){
                this.order='';
                this.description='';
                this.url= '';
                this.image_id= '';
                this.badgeId= '';
                this.title= '';
                this.alt_tag= '';
                this.source= 'CDN';
                this.source_id= null;
                this.newBadgePath= {};
                this.badgePath= {
                    'url': '',
                }
            },

             async getImage(){

                 let data ={
                    'id':this.productbadge.attributes.image_id
                };

                let badgePath = await imageStore.loadImages(data, 'productbadges');

                // let CDNImage = await cdnStore.getFromCDN(badgePath.attributes.source_id);

                this.title = badgePath.attributes.title;
                this.alt_tag = badgePath.attributes.alt_tag;

                // this.badgePath = CDNImage.data;

                this.badgePath.url = endPoints.cdnFile + badgePath.attributes.source_id;
            },

            pickFiles(files){
                this.newBadgePath = files.target.files[0];
                this.badgePath.url = URL.createObjectURL(files.target.files[0])
            },
            

            async saveBadgeInfo() {

               let data = {
                   'data': {  
                       'type': 'product_badge',
                       'attributes': {
                           'order': this.order,
                           'description': this.description,
                           'url': this.url,
                            'title': this.title,
                            'alt_tag': this.alt_tag,
                            'source_id': this.source_id,
                            'id': this.badgeId,
                            'source': 'CDN',

                        'badgePath': {
                            'url': this.badgePath.url,
                        }
                       }
                   }
               };

               if(this.type === 'product-badge-details') {
                   data.data.id = this.productbadge.id;
                   
                   try {
                       await productBadgesStore.update(data, this.productbadge.id);
                       await imageStore.update(this.badgeId, data);
                   } catch (error) {
                       console.log(error);
                       event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error')
                   }
               }
           },

            async saveNewBadgeInfo(){
                let fb = new FormData();

                fb.append('file', this.newBadgePath);

                let cdn = await cdnStore.uploadToCDN(fb);

                let data = {
                    'data': {
                        'type': 'images',
                        'attributes': {
                            'title': this.title,
                            'alt_tag': this.alt_tag,
                            'source':'CDN',
                            'source_id':cdn.filename
                        },
                    }
                };

                let tempImage = await imageStore.create(data);

                let data2 = {
                    'data': {
                        'type': 'productbadge',
                        'attributes': {
                            'image_id': tempImage.id,
                            'order': this.order,
                            'description': this.description,
                            'url': this.url,
                        }
                    }
                };

                await productBadgesStore.createBadge(data2);

            },

           async saveNewImage(){
               let fb = new FormData();

               fb.append('file', this.newBadgePath);

                let cdn = await cdnStore.uploadToCDN(fb);

                let data = {
                    'data': {
                        'type': 'images',
                        'attributes': {
                            'title': this.title,
                            'alt_tag': this.alt_tag,
                            'source':'CDN',
                            'source_id':cdn.filename
                        },
                    }
                };

                let tempImage = await imageStore.create(data);

                let newBadgeDetails = {
                    'data':this.productbadge
                };

                newBadgeDetails.data.attributes.image_id = tempImage.id;
                productBadgesStore.saveNewImage(newBadgeDetails.data.id, newBadgeDetails);

            },

        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

    #productBadgeDetails{


        input[type="text"]{
            width:100px;
        }
        
    }

    .brandImageSection {

        padding-bottom: 20px;
    }

</style>