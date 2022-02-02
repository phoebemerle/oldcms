<template>
    <div class="details-form" style="height: auto;">
        <div class="details-form__body" >
            <!-- <div class="addedBorder">
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
                       <input class="fileUpload" @change="pickFiles($event)" type="file" accept="image/png, image/jpeg">
                       <br>
                       <img  style="max-width:400px; max-height:150px;" :src="tempImage"/>
                   </div>
                    <div>
                        <label>Banner Position</label>
                        <select v-model="bannerPosition">
                            <option value="first_sub_banner">First Small Promo</option>
                            <option value="first_sub_banner">First Small Promo</option>
                            <option value="second_sub_banner">Second Small Promo</option>
                            <option value="bottom_banner_1">Bottom Banner 1</option>
                            <option value="bottom_banner_2">Bottom Banner 2</option>
                        </select>
                    </div>
                </div>
            </div> -->
            <div class="addedBorder">
                <div @click="displaySection('showFirstSubBannerSection')">
                    <h3>First Small Promo</h3>
                    <p class="sectionExpand">
                        <span v-show="!showFirstSubBannerSection">+</span>
                        <span v-show="showFirstSubBannerSection">-</span>
                    </p>
                </div>
                <hr>
                <saved-banner v-show="showFirstSubBannerSection" :banners="firstBanners" :homeInfo="content" imagePosition="first_sub_banner"></saved-banner>
            </div>
            <div class="addedBorder">
                <div @click="displaySection('showSecondSubBanner')">
                    <h3>Second Small Promo</h3>
                    <p class="sectionExpand">
                        <span v-show="!showSecondSubBanner">+</span>
                        <span v-show="showSecondSubBanner">-</span>
                    </p>
                </div>
                <hr>
                <saved-banner  v-show="showSecondSubBanner" :banners="secondBanners" :homeInfo="content" imagePosition="second_sub_banner"></saved-banner>
            </div>
            <div class="addedBorder">
                <div @click="displaySection('showBottomBanner1')">
                    <h3>First Bottom Banner</h3>
                    <p class="sectionExpand">
                        <span v-show="!showBottomBanner1">+</span>
                        <span v-show="showBottomBanner1">-</span>
                    </p>
                </div>
                <hr>
                <saved-banner  v-show="showBottomBanner1" :banners="bottomBanners1" :homeInfo="content" imagePosition="bottom_banner_1"></saved-banner>
            </div>
             <div class="addedBorder">
                <div @click="displaySection('showBottomBanner2')">
                    <h3>Second Bottom Banner</h3>
                    <p class="sectionExpand">
                        <span v-show="!showBottomBanner2">+</span>
                        <span v-show="showBottomBanner2">-</span>
                    </p>
                </div>
                <hr>
                <saved-banner  v-show="showBottomBanner2" :banners="bottomBanners2" :homeInfo="content" imagePosition="bottom_banner_2"></saved-banner>
            </div>
        </div>
    </div>
</template>

<script>
    import {homePageStore} from '@/stores';
    import {event} from '@/services';
    import {cdnStore} from '@/stores';
    import {imageStore} from '@/stores';
    import {http} from '@/services';
    import SavedBanner from '@/components/pages/homePage/homeSavedBanners';
    
    export default {
        name: "homePageBanners",

        components: {SavedBanner},

        props:['content'],

        data(){
            return{
                newImage:null,
                bannerPosition:'first_sub_banner',
                newTitle:'',
                newAltTag:'',
                newLink:null,
                firstBanners:[],
                secondBanners:[],
                bottomBanners1:[],
                bottomBanners2:[],
                showUploadSection:false,
                showMainBannerSection:false,
                showFirstSubBannerSection:false,
                showSecondSubBanner:false,
                showBottomBanner1: false,
                showBottomBanner2: false,
                tempImage:null
            }
        },

        watch:{
            content:{
                
                handler: function(content) {
                if(this.content){
                    
                    if (this.content.type === 'home-page-contents') {
                        if (this.content.attributes.desktop_first_sub_banner_id) {
                            this.getFirstSubBanner();
                        }
                        if (this.content.attributes.desktop_second_sub_banner_id) {
                            this.getSecondSubBanner();
                        }

                        if (this.content.attributes.desktop_bottom_banner_1_id) {
                            this.getBottomBanner1();
                        }

                          if (this.content.attributes.desktop_bottom_banner_2_id) {
                            this.getBottomBanner2();
                        }
                    }
                }
                this.$validator.reset();
            },
            deep: true
            }
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
                            'source_id':newImage.filename
                        },
                    }
                };

                let tempImage = await imageStore.create(data, newImage.data.attributes.url);

                this.updateContent(tempImage.id);


            },

            async updateContent(imageID){
                let tempContent = this.content;
                tempContent.attributes[this.bannerPosition+'_id'] = imageID;
                tempContent.attributes[this.bannerPosition+'_link']= this.newLink;
                let data = http.createData(tempContent);

                try{
                    await homePageStore.updateHomePageContent(data, data.data.id);  
                    window.location.reload();
                    
                }catch(error) {
                    event.emit(event.names.USER_MESSAGE, 'There was a problem uploading your image', 'error');
                }
            },

            saveImageToCDN(mediaInfo) {
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

            async getFirstSubBanner(){
                let tempFSubd = [];
                let tempFSubm = [];

                if(this.content.attributes.desktop_first_sub_banner_id) {
                    tempFSubd = await imageStore.loadImages(this.content.attributes.desktop_first_sub_banner_id, 'banners');

                let cdnImaged = null;

                if(tempFSubd.attributes.source === 'CDN') {
                    cdnImaged = await this.getCdnImage(tempFSubd.attributes.source_id);
                }

                tempFSubd.attributes.url = cdnImaged.data[0].attributes.url;
                tempFSubd.attributes.link = this.content.attributes.desktop_first_sub_banner_link;
                }

                if(this.content.attributes.mobile_first_sub_banner_id) {
                    tempFSubm = await imageStore.loadImages(this.content.attributes.mobile_first_sub_banner_id, 'banners');

                    let cdnImagem = null;

                    if(tempFSubm.attributes.source === 'CDN') {
                        cdnImagem = await this.getCdnImage(tempFSubm.attributes.source_id);
                    }

                    tempFSubm.attributes.url = cdnImagem.data[0].attributes.url;
                    tempFSubm.attributes.link = this.content.attributes.mobile_first_sub_banner_link;
                }

                if(tempFSubd.length === 0) {
                    tempFSubd = {
                        id: this.content.id,
                        attributes:{}
                    }
                }

                if(tempFSubm.length === 0) {
                    tempFSubm = {
                        id: this.content.id,
                        attributes:{}
                    }
                }

                this.firstBanners.push(tempFSubd)
                this.firstBanners.push(tempFSubm)
            },

            async getSecondSubBanner(){
                let tempFSubd = [];
                let tempFSubm = [];

                if(this.content.attributes.desktop_second_sub_banner_id) {
                    tempFSubd = await imageStore.loadImages(this.content.attributes.desktop_second_sub_banner_id, 'banners');

                let cdnImaged = null;

                if(tempFSubd.attributes.source === 'CDN') {
                    cdnImaged = await this.getCdnImage(tempFSubd.attributes.source_id);
                }

                tempFSubd.attributes.url = cdnImaged.data[0].attributes.url;
                tempFSubd.attributes.link = this.content.attributes.desktop_second_sub_banner_link;

                }

                if(this.content.attributes.mobile_second_sub_banner_id) {

                    tempFSubm = await imageStore.loadImages(this.content.attributes.mobile_second_sub_banner_id, 'banners');

                    let cdnImagem = null;

                    if(tempFSubm.attributes.source === 'CDN') {
                        cdnImagem = await this.getCdnImage(tempFSubm.attributes.source_id);
                    }

                    tempFSubm.attributes.url = cdnImagem.data[0].attributes.url;
                    tempFSubm.attributes.link = this.content.attributes.mobile_second_sub_banner_link;
                }

                if(tempFSubd.length === 0) {
                    tempFSubd = {
                        id: this.content.id,
                        attributes:{}
                    }
                }

                if(tempFSubm.length === 0) {
                    tempFSubm = {
                        id: this.content.id,
                        attributes:{}
                    }
                }

                this.secondBanners.push(tempFSubd)
                this.secondBanners.push(tempFSubm)
            },

            async getBottomBanner1(){
                let tempFSubd = [];
                let tempFSubm = [];

                if(this.content.attributes.desktop_bottom_banner_1_id) {
                    tempFSubd = await imageStore.loadImages(this.content.attributes.desktop_bottom_banner_1_id, 'banners');

                let cdnImaged = null;

                if(tempFSubd.attributes.source === 'CDN') {
                    cdnImaged = await this.getCdnImage(tempFSubd.attributes.source_id);
                }

                tempFSubd.attributes.url = cdnImaged.data[0].attributes.url;
                tempFSubd.attributes.link = this.content.attributes.desktop_bottom_banner_1_link;


                }

                if(this.content.attributes.mobile_bottom_banner_1_id) {

                    tempFSubm = await imageStore.loadImages(this.content.attributes.mobile_bottom_banner_1_id, 'banners');

                    let cdnImagem = null;

                    if(tempFSubm.attributes.source === 'CDN') {
                        cdnImagem = await this.getCdnImage(tempFSubm.attributes.source_id);
                    }

                    tempFSubm.attributes.url = cdnImagem.data[0].attributes.url;
                    tempFSubm.attributes.link = this.content.attributes.mobile_bottom_banner_1_link;
                }

                if(tempFSubd.length === 0) {
                    tempFSubd = {
                        id: this.content.id,
                        attributes:{}
                    }
                }

                if(tempFSubm.length === 0) {
                    tempFSubm = {
                        id: this.content.id,
                        attributes:{}
                    }
                }

                this.bottomBanners1.push(tempFSubd)
                this.bottomBanners1.push(tempFSubm)

            },

            async getBottomBanner2(){
                let tempFSubd = [];
                let tempFSubm = [];

                if(this.content.attributes.desktop_bottom_banner_2_id) {
                    tempFSubd = await imageStore.loadImages(this.content.attributes.desktop_bottom_banner_2_id, 'banners');

                let cdnImaged = null;

                if(tempFSubd.attributes.source === 'CDN') {
                    cdnImaged = await this.getCdnImage(tempFSubd.attributes.source_id);
                }

                tempFSubd.attributes.url = cdnImaged.data[0].attributes.url;
                tempFSubd.attributes.link = this.content.attributes.desktop_bottom_banner_2_link;

                }

                if(this.content.attributes.mobile_bottom_banner_2_id) {

                    tempFSubm = await imageStore.loadImages(this.content.attributes.mobile_bottom_banner_2_id, 'banners');

                    let cdnImagem = null;

                    if(tempFSubm.attributes.source === 'CDN') {
                        cdnImagem = await this.getCdnImage(tempFSubm.attributes.source_id);
                    }

                    tempFSubm.attributes.url = cdnImagem.data[0].attributes.url;
                    tempFSubm.attributes.link = this.content.attributes.mobile_bottom_banner_2_link;
                }

                if(tempFSubd.length === 0) {
                    tempFSubd = {
                        id: this.content.id,
                        attributes:{}
                    }
                }

                if(tempFSubm.length === 0) {
                    tempFSubm = {
                        id: this.content.id,
                        attributes:{}
                    }
                }

                this.bottomBanners2.push(tempFSubd)
                this.bottomBanners2.push(tempFSubm)
            },

            async getCdnImage(id){
                return await cdnStore.checkCDN(id);
            },

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