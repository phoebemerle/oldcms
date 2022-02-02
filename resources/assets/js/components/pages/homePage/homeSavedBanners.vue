<template>
    <div class="bannerImageSection">
        <div class="bannerImageSection__Info">
            <h3>Desktop</h3>
            <div class="bannerImageSection__Info__NoImage" v-if="!bannerInfo[0].attributes.url">
                <div>No Image</div>
            </div>
            <div class="bannerImageSection__Info__Image">
                <div>
                    <img style="max-width: 600px;" :src="bannerInfo[0].attributes.url">
                </div>
                <div class="homePageBannerInfo">
                    <div>
                        <label for="mainBannerTitle">Title</label>
                        <input id="mainBannerTitleValidate" name="mainBannerTitleValidate" data-vv-as="Banner Title" v-validate="'required'" type="text" v-show="imagePosition === 'main_banner' || imagePosition === 'bottom_banner_1'" v-model="bannerInfo[0].attributes.title"/>
                        <input id="mainBannerTitle" type="text" v-show="imagePosition != 'main_banner' && imagePosition != 'bottom_banner_1'" v-model="bannerInfo[0].attributes.title"/>
                    </div>
                    <span v-show="imagePosition === 'main_banner' || imagePosition === 'bottom_banner_1'" class="error-message" v-for="error in errors.collect('mainBannerTitleValidate')" :key="error+'c'">{{error}}</span>
                    <div>
                        <label for="mainBannerAltTag">Alt Tag</label>
                         <input id="mainBannerAltTagValidate" name="mainBannerAltTagValidate" data-vv-as="Banner Alt Tag" v-validate="'required'" type="text" v-show="imagePosition === 'main_banner' || imagePosition === 'bottom_banner_1'" v-model="bannerInfo[0].attributes.alt_tag"/>
                        <input id="mainBannerAltTag" type="text" v-show="imagePosition != 'main_banner' && imagePosition != 'bottom_banner_1'" v-model="bannerInfo[0].attributes.alt_tag"/>
                    </div>
                    <span v-show="imagePosition === 'main_banner' || imagePosition === 'bottom_banner_1'" class="error-message" v-for="error in errors.collect('mainBannerAltTagValidate')" :key="error+'c'">{{error}}</span>
                    <div>
                        <label for="mainBannerLink">Banner Link</label>
                        <input id="mainBannerLinkValidate" name="mainBannerLinkValidate" data-vv-as="Banner Link" type="text" v-show="imagePosition === 'main_banner' || imagePosition === 'bottom_banner_1'" v-validate="'required'" v-model="bannerInfo[0].attributes.link"/>
                        <input id="mainBannerLink" type="text" v-model="bannerInfo[0].attributes.link" v-show="imagePosition != 'main_banner' && imagePosition != 'bottom_banner_1'" />
                    </div>
                    <span v-show="imagePosition === 'main_banner' || imagePosition === 'bottom_banner_1'" class="error-message" v-for="error in errors.collect('mainBannerLinkValidate')" :key="error+'c'">{{error}}</span>
                    <input class="fileUpload" type="file" name="" @change="pickFile($event, 0)">
                    <br>
                    <button @click="updateBannerInfo(0)" :disabled="$validator.errors.any()"  v-show="imagePosition === 'main_banner' || imagePosition === 'bottom_banner_1'" >Update Main Banner Info</button>
                    <button @click="updateBannerInfo(0)"  v-show="imagePosition != 'main_banner' && imagePosition != 'bottom_banner_1'" >Update Main Banner Info</button>
                </div>
            </div>
            <hr>
            <h3>Mobile</h3>
            <div class="bannerImageSection__Info__NoImage" v-if="!bannerInfo[1].attributes.url">
                <div>No Image</div>
            </div>
            <div class="bannerImageSection__Info__Image" >
                <div>
                    <img style="max-width: 600px;" :src="bannerInfo[1].attributes.url">
                </div>
                <div class="homePageBannerInfo">
                    <div>
                        <label for="mainBannerTitle">Title</label>
                        <input id="mainBannerTitleValidate" name="mainBannerTitleValidate" data-vv-as="Banner Title" v-validate="'required'" type="text" v-show="imagePosition === 'main_banner' || imagePosition === 'bottom_banner_1'" v-model="bannerInfo[1].attributes.title"/>
                        <input id="mainBannerTitle" type="text" v-show="imagePosition != 'main_banner' && imagePosition != 'bottom_banner_1'" v-model="bannerInfo[1].attributes.title"/>
                    </div>
                    <span v-show="imagePosition === 'main_banner' || imagePosition === 'bottom_banner_1'" class="error-message" v-for="error in errors.collect('mainBannerTitleValidate')" :key="error+'c'">{{error}}</span>
                    <div>
                        <label for="mainBannerAltTag">Alt Tag</label>
                         <input id="mainBannerAltTagValidate" name="mainBannerAltTagValidate" data-vv-as="Banner Alt Tag" v-validate="'required'" type="text" v-show="imagePosition === 'main_banner' || imagePosition === 'bottom_banner_1'" v-model="bannerInfo[1].attributes.alt_tag"/>
                        <input id="mainBannerAltTag" type="text" v-show="imagePosition != 'main_banner' && imagePosition != 'bottom_banner_1'" v-model="bannerInfo[1].attributes.alt_tag"/>
                    </div>
                    <span v-show="imagePosition === 'main_banner' || imagePosition === 'bottom_banner_1'" class="error-message" v-for="error in errors.collect('mainBannerAltTagValidate')" :key="error+'c'">{{error}}</span>
                    <div>
                        <label for="mainBannerLink">Banner Link</label>
                        <input id="mainBannerLinkValidate" name="mainBannerLinkValidate" data-vv-as="Banner Link" type="text" v-show="imagePosition === 'main_banner' || imagePosition === 'bottom_banner_1'" v-validate="'required'" v-model="bannerInfo[1].attributes.link"/>
                        <input id="mainBannerLink" type="text" v-model="bannerInfo[1].attributes.link" v-show="imagePosition != 'main_banner' && imagePosition != 'bottom_banner_1'" />
                    </div>
                    <span v-show="imagePosition === 'main_banner' || imagePosition === 'bottom_banner_1'" class="error-message" v-for="error in errors.collect('mainBannerLinkValidate')" :key="error+'c'">{{error}}</span>
                    <input class="fileUpload" type="file" name="" @change="pickFile($event, 1)">                    
                    <br>
                    <button @click="updateBannerInfo(1)" :disabled="$validator.errors.any()"  v-show="imagePosition === 'main_banner' || imagePosition === 'bottom_banner_1'" >Update Main Banner Info</button>
                    <button @click="updateBannerInfo(1)"  v-show="imagePosition != 'main_banner' && imagePosition != 'bottom_banner_1'" >Update Main Banner Info</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {http} from '@/services';
    import {imageStore, cdnStore} from "@/stores";
    import {homePageStore} from "@/stores";


    export default {
        name: "SavedBanner",

        props:['banners', 'homeInfo', 'imagePosition'],

        data(){
            return{
                bannerInfo: [{
                    attributes:{
                        url:null
                    }
                },
                {
                    attributes:{
                        url:null
                    }
                }],
            }
        },

        watch:{
            banners(){
                this.bannerInfo = this.banners;
            }
        },

        methods:{
            pickFile(files, key){
                this.bannerInfo[key].attributes.url = URL.createObjectURL(files.target.files[0])
                this.bannerInfo[key].image = files.target.files[0]
            },
            async updateBannerInfo(key){

                if(this.imagePosition === 'main_banner' || this.imagePosition === 'bottom_banner_1') {
                    await this.$validator.validateAll();
                    if(this.$validator.errors.any()) {
                        return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                    }
                }

                let formData = new FormData();
                formData.append('file', this.bannerInfo[key].image);

                let cdn = await cdnStore.uploadToCDN(formData)

                let prefix = ''

                if(key === 0) {
                    prefix = 'desktop_'
                } else if(key === 1) {
                    prefix = 'mobile_'
                }
                this.homeInfo.attributes[prefix + this.imagePosition+'_link'] = this.bannerInfo[key].attributes.link;

                delete this.bannerInfo[key].attributes.link;
                delete this.bannerInfo[key].attributes.url;
                delete this.bannerInfo[key].image;
                this.bannerInfo[key].attributes.source_id = cdn.filename;
                this.bannerInfo[key].attributes.source = 'CDN';

                data = http.createData(this.bannerInfo[key]);

                let image = [];

                if(this.homeInfo.attributes[prefix + this.imagePosition+'_id'] === 0) {
                    image = await imageStore.create(data);
                }else {
                    image = await imageStore.update(this.bannerInfo[key].id, data);
                }

                let data = http.createData(this.homeInfo);              
                data.data.attributes[prefix + this.imagePosition+'_id'] = image.id;

                homePageStore.updateHomePageContent(data, this.homeInfo.id);
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>