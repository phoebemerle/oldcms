<template>
    <div class="details-form" style="height: auto;">
        <div class="details-form__body">
         <div>
                <h3>Main Banner:</h3>
            </div>
            <div class="addedBorder">
                <div @click="displaySection('showUploadSection')">
                    <h3>Upload Section</h3>
                    <p class="sectionExpand">
                        <span v-show="!showUploadSection">+</span>
                        <span v-show="showUploadSection">-</span>
                    </p>
                </div>
                <hr>
                <div v-show="showUploadSection">
                    <div>
                        <div> 
                            <label for="newLink">Banner Link: </label>
                            <input v-model="newLink" id="newLink" name="newLink" type="text" v-validate="'required'"/>
                        </div>
                        <span class="error-message" v-for="error in errors.collect('newLink')" :key="error+'a'">{{error}}</span>
                        <div> 
                            <label for="newPriority">Banner Priority: </label>
                            <input v-model="newPriority" id="newPriority" name="newPriority" type="number" v-validate="'required|min_value:1|max_value:5'"/>
                        </div>
                         <span class="error-message" v-for="error in errors.collect('newPriority')" :key="error+'b'">{{error}}</span>
                        <div> 
                            <label for="newImageTitle">Image Title: </label>
                            <input v-model="newTitle" id="newImageTitle" name="newImageTitle" type="text" v-validate="'required'"/>
                        </div>
                         <span class="error-message" v-for="error in errors.collect('newImageTitle')" :key="error+'c'">{{error}}</span>
                    <div>
                        <label for="newImageAlt">Image Alt Tag: </label>
                        <input v-model="newAltTag" id="newImageAlt" name="newImageAlt" type="text" v-validate="'required'"/>
                    </div>
                     <span class="error-message" v-for="error in errors.collect('newImageAlt')" :key="error+'d'">{{error}}</span>
                    <div>
                        <label for="bannnertype">Banner Type: </label>
                        <select name="bannertype" v-model="bannerType" data-vv-as="Banner Type" v-validate="'required'">
                            <option disabled value="">Select One</option>
                            <option value="desktop">Desktop</option>
                            <option value="mobile">Mobile</option>
                        </select>
                    </div>
                     <span class="error-message" v-for="error in errors.collect('bannertype')" :key="error+'d'">{{error}}</span>
                     <br>
                       <input class="fileUpload" @change="pickFiles($event)" name="fileUpload" v-validate="'required'" type="file" accept="image/png, image/jpeg">
                       <br>
                       <img  style="max-width:400px; max-height:150px;" :src="tempImage"/>
                        <span class="error-message" v-for="error in errors.collect('fileUpload')" :key="error+'e'">{{error}}</span>
                       <div>
                    <button class="btn btn-primary" @click="uploadNewBanner()">Save New Banner</button>
                </div>
                   </div>
                    <div>
                    </div>
                </div>
            </div>
            <h3 v-show="mainbanners.filter(row => row.attributes.banner_type === 'desktop').length > 0">Desktop</h3>
            <banner-image v-show="mainbanners.filter(row => row.attributes.banner_type === 'desktop').length > 0" v-for="(banner, key) in desktopBanners" :banner="banner" :mainbanners="desktopBanners" :key="key + 'a'"></banner-image>
            <h3 v-show="mainbanners.filter(row => row.attributes.banner_type === 'mobile').length > 0">Mobile</h3>
            <banner-image v-show="mainbanners.filter(row => row.attributes.banner_type === 'mobile').length > 0" v-for="(banner, index) in mobileBanners" :banner="banner" :mainbanners="mobileBanners" :key="index + 'b'"></banner-image>
            </div>
        </div>
</template>

<script>
    import {mainBannerStore} from '@/stores';
    import {event} from '@/services';
    import {cdnStore} from '@/stores';
    import {imageStore} from '@/stores';
    import {http} from '@/services';
    import BannerImage from '@/components/pages/homePage/mainBannerImage';
    
    export default {
        name: "MainBanner",

        components: {BannerImage},

        props:['mainBanners'],

        data(){
            return{
                newImage:null,
                newTitle:'',
                newAltTag:'',
                newLink:null,
                newPriority: '',
                tempImage:null,
                showUploadSection:false,
                mainbanners: [],
                bannerType:'',
                desktopBanners:[],
                mobileBanners:[]
            }
        },

        watch:{
           async mainBanners(){
                    
                    if (this.mainbanners != null) {
                        
                    //    await this.getMainBanners();

                       this.mainbanners = this.mainBanners;

                       this.desktopBanners = this.mainBanners.filter(row => row.attributes.banner_type === 'desktop')
                       this.mobileBanners = this.mainBanners.filter(row => row.attributes.banner_type === 'mobile')
                       
                       if(this.mainbanners.length > 0) {
                       this.mainbanners = this.sortBanners(this.mainbanners);
                       this.desktopBanners = this.sortBanners(this.desktopBanners);
                       this.mobileBanners = this.sortBanners(this.mobileBanners);
                }
                }
                this.$validator.reset();
            },
            deep: true
            },

        methods:{
            async uploadNewBanner(){
                await this.$validator.validateAll();
               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
                this.newImage.attributes.alt_tag = this.newAltTag;
                this.newImage.attributes.title = this.newTitle;

                let newImage = await this.saveImageToCDN(this.newImage);


                let data = {
                    'data': {
                        'type': 'images',
                        'attributes': {
                            'title': this.newTitle,
                            'alt_tag': this.newAltTag,
                            'source':'CDN',
                            'source_id':newImage.filename,
                            'thumbnail_source_id':newImage.filename
                        },
                    }
                };

                let tempImage = await imageStore.create(data);

                this.addNewBanner(tempImage.id);


            },

             sortBanners(mainbanner) {

                return mainbanner.slice().sort(function(a, b) {
                    return a.attributes.priority - b.attributes.priority;
                });
            },

            async addNewBanner(imageID){
                
                if(this.mainbanners.filter(row => row.attributes.banner_type === this.bannerType).length <= 4){
                    let data = {
                        'data': {
                            'type': 'home-main-banners',
                            'attributes': {
                                'image_id': imageID,
                                'priority': this.newPriority,
                                'banner_link': this.newLink,
                                'banner_type': this.bannerType
                            }
                        }
                    };

                     let newBanner = await mainBannerStore.createNewBanner(data);
                    }
                    else {
                        event.emit(event.names.USER_MESSAGE, 'You are only allowed a maximum of 5 '+this.bannerType+' banner images. Please remove an existing banner', 'error');
                    }
            },

            saveImageToCDN(mediaInfo){
                try {
                    let formData = new FormData();
                    formData.append('file', mediaInfo.attributes.target, mediaInfo.attributes.name);
                    return cdnStore.uploadToCDN(formData)
                } catch (error) {
                    console.log(error);
                }
            },


            displaySection(type){
                this[type] = !this[type];
            },

            // async getMainBanners(){

            //     for (let p = 0; p < this.mainbanners.length; p++){

            //     let tempFSub = await imageStore.loadImages(this.mainbanners[p].attributes.image_id, 'banners');

            //     let cdnImage = null;

            //     if(tempFSub.attributes.source === 'CDN') {
            //         cdnImage = await this.getCdnImage(tempFSub.attributes.source_id);
            //     }

            //     this.mainbanners[p].attributes.url = cdnImage.data[0].attributes.url;

            //     }
            // },


            pickFiles(files, type){
                this.tempImage = URL.createObjectURL(files.target.files[0]);
                if(this.newImage === null) {
                    this.newImage = {
                        'attributes': {
                            'target': files.target.files[0],
                            'alt_tag': '',
                            'title': '',
                            'url':''
                        }
                    }
                }else{
                    this[type].attributes.url = '';
                    this[type].attributes.target = files.target.files[0];
                }
            },
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    .sectionExpand{
        display: inline-block;
        float: right;
        font-size: 30px;
        padding: 0 30px;
        cursor: pointer;
    }

    .details-form__body {
        input{
            width:400px;
        }

        label{
            min-width: 70px;
        }

        h3{
            display:inline-block;
        }
    }

    .bannerImageSection{

        &__Info{

            &__NoImage{
                border: 4px dotted #666666;
                width: 150px;
                height: 150px;
                text-align: center;
                position: relative;

                div{
                    margin-top: 6rem;
                }
            }
        }

    }

</style>