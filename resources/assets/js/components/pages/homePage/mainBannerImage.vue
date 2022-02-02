<template>
  <div class="addedBorder">
                <div @click="displaySection('showSection')">
                    <h3>{{banner.attributes.banner_type.charAt(0).toUpperCase() + banner.attributes.banner_type.substr(1).toLowerCase()}} Banner Image {{banner.attributes.priority}}</h3>
                    <p class="sectionExpand">
                        <span v-show="!showSection">+</span>
                        <span v-show="showSection">-</span>
                    </p>
                </div>
                <hr>
                <div v-show="showSection">
                        <div>
                            <label> Banner Link</label>
                            <input id="mainBannerLink" name="mainBannerLink" v-validate="'required'" type="text" v-model="banner.attributes.banner_link"/>
                        </div>
                        <span class="error-message" v-for="error in errors.collect('mainBannerLink')" :key="error+'a'">{{error}}</span>
                        <div>
                            <label>Banner Priority</label>
                            <input id="mainBannerPriority" name="mainBannerPriority" v-validate="'required|min_value:1|max_value:5'" type="text" v-model="banner.attributes.priority"/>
                        </div>
                        <span class="error-message" v-for="error in errors.collect('mainBannerPriority')" :key="error+'b'">{{error}}</span>
                        <div>
                            <label>Image Title</label>
                            <input id="mainBannerTitle" name="mainBannerTitle" v-validate="'required'" type="text" v-model="banner.attributes.mainbanner_attributes.title"/>
                        </div>
                         <span class="error-message" v-for="error in errors.collect('mainBannerTitle')" :key="error+'c'">{{error}}</span>
                        <div>
                            <label>Image Alt Tag</label>
                            <input id="mainBannerAltTag" name="mainBannerAltTag" v-validate="'required'" type="text" v-model="banner.attributes.mainbanner_attributes.alt_tag"/>
                        </div>
                         <span class="error-message" v-for="error in errors.collect('mainBannerAltTag')" :key="error+'d'">{{error}}</span>
                        <div>
                            <label for="bannnertype">Banner Type: </label>
                            <select name="bannertype" v-model="banner.attributes.banner_type" data-vv-as="Banner Type" v-validate="'required'">
                                <option disabled value="">Select One</option>
                                <option value="desktop">Desktop</option>
                                <option value="mobile">Mobile</option>
                            </select>
                        </div>
                     <span class="error-message" v-for="error in errors.collect('bannertype')" :key="error+'d'">{{error}}</span>
                        <div>
                            <img style="max-width: 600px;" :src="cdnendpoint + banner.attributes.mainbanner_attributes.source_id">
                        </div>
                        <div>
                            <button class="btn btn-danger" @click="updateBannerInfo(banner)">Update Banner</button>
                        </div>
                        <div>
                            <button class="btn btn-danger" @click="deleteBanner(banner)">Delete Banner</button>
                        </div>
                    </div>
            </div>
</template>

<script>
    import {http, endPoints} from '@/services';
    import {imageStore} from "@/stores";
    import {mainBannerStore} from "@/stores";

     export default {
        name: "MainBannerImage",

        props:['banner', 'mainbanners'],

        data(){
            return{
               showSection: false,
               cdnendpoint: endPoints.cdnFile
            }
        },

        watch:{

        },

        methods:{

             displaySection(type){
                this[type] = !this[type];
            },

            deleteBanner(banner){
                mainBannerStore.deleteBanner(banner);
                
            },

            async updateBannerInfo(){
                    await this.$validator.validateAll();
                    if(this.$validator.errors.any()) {
                        return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                    }

                let data = {
                    'data': {
                        'type': 'home-main-banners',
                            'attributes': {
                                'image_id': this.banner.attributes.mainbanner_attributes.id,
                                'priority': this.banner.attributes.priority,
                                'banner_link': this.banner.attributes.banner_link,
                                'banner_type': this.banner.attributes.banner_type
                            },
                            'Image': {
                                'alt_tag': this.banner.attributes.mainbanner_attributes.alt_tag,
                                'id': this.banner.attributes.mainbanner_attributes.id,
                                'source': "CDN",
                                'source_id': this.banner.attributes.mainbanner_attributes.source_id,
                                'title': this.banner.attributes.mainbanner_attributes.title,
                                'thumbnail_source_id':this.banner.attributes.mainbanner_attributes.source_id,

                            }
                    }
                };




                let image = {
                    'data': {
                        'type': 'images',
                        'attributes': {
                            'alt_tag': this.banner.attributes.mainbanner_attributes.alt_tag,
                            'source': "CDN",
                            'source_id': this.banner.attributes.mainbanner_attributes.source_id,
                            'title': this.banner.attributes.mainbanner_attributes.title,
                        },
                    }
                }
                mainBannerStore.updateBanner(data, this.banner.id);

                imageStore.update(this.banner.attributes.mainbanner_attributes.id, image);

            }
        }
    }

</script>