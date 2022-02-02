<template>
    <div class="main-sections__editForm">
        <div v-show="view === 'brand-details'" class="overviewTabs">
            <ul class="list-inline" style="margin-bottom:0;">
                <li v-bind:class="{ activeTab: tab === 'details' }" @click="changeTab('details')">Brand Info</li>
                <li v-bind:class="{ activeTab: tab === 'contact' }" @click="changeTab('contact')">Brand Contact</li>
                <li v-bind:class="{ activeTab: tab === 'images' }" @click="changeTab('images')">Brand Images</li>
            </ul>
        </div>
        <div class="main-sections__editForm__container">
            <brand-details v-show="tab ==='details'" :brand="brands" :brandInfo="brandInfo" :view="view"></brand-details>
            <brand-images v-show="tab === 'images'" :brandImages="brandImages" :brandInfo="brandInfo"></brand-images>
            <brands-contact-info v-show="tab === 'contact'" :brand="brands" :tab="tab"></brands-contact-info>
        </div>
    </div>
</template>

<script>
    import BrandDetails from '@/components/brands/BrandsDetails';
    import BrandImages from '@/components/brands/BrandImages';
    import BrandsContactInfo from '@/components/brands/BrandsContactInfo';
    import {brandsStore} from '@/stores';
    import {cdnStore} from "@/stores";
    import {imageStore} from "@/stores";
    import {sharedStore} from "@/stores";
    import {event} from '@/services';
    import brandStub from '@/stubs/brandInfo';
    import {http} from '@/services';

    export default {
        name: "BrandsMain",

        components: {BrandDetails, BrandImages, BrandsContactInfo},

        props: ['brands', 'view'],

        data() {
            return {
                tab: 'details',
                brandInfo: {},
                brandImages: {
                    main_logo:{attributes:null}, partnership_logo:{attributes:null}}
            }
        },

        watch: {
            brands() {
                if ((this.brands.id != null) && (this.brands.type === 'brands')) {
                    this.getBrandInfo();

                } else {
                    this.brandInfo = brandStub;
                    this.brandImages = {main_logo: null, partnership_logo: null};
                }
            },

            deep: true
        },

        created() {
            event.on(event.names.UPDATE_BRAND, (data) => {
                if (data.data.id != null) {
                    this.updateBrandInfo(data);
                } else {
                    this.createBrandInfo(data);
                }
            });

            event.on(event.names.REMOVE_BRAND_MEDIA, async (brand, type) => {
                if(type === 'mainLogo') {
                    brand.attributes.main_logo_id = null
                    let data = {
                        data: brand
                    }
                    await brandsStore.updateBrandConfig(data, brand.id);
                    this.brandImages.main_logo = [];
                } else if (type === 'partnerLogo') {
                    brand.attributes.partner_logo_id = null;
                    let data = {
                        data: brand
                    }
                    await brandsStore.updateBrandConfig(data, brand.id);
                    this.brandImages.partnership_logo = [];
                }
            })


            event.on(event.names.SAVE_BRAND_MEDIA, (mediaInfo, type) => {
                if (!mediaInfo.attributes.source_id) {
                    this.saveImageToCDN(mediaInfo).then((newImage) => {

                        if (mediaInfo.attributes.id) {

                            mediaInfo.attributes.source_id = newImage.filename;
                            this.updateBrandImage(mediaInfo, type);
                        } else {

                            this.savingNewImage(mediaInfo, newImage, type);
                        }
                    });
                }
                else {
                    this.updateBrandImage(mediaInfo, type);
                }
            });
        },

        methods: {
            changeTab(tab) {
                this.tab = tab;
            },

            async getBrandInfo() {
                try {
                    this.brandInfo = await brandsStore.getBrandConfig(this.brands.id);
                    if (this.brandInfo.id != null) {
                        this.brandImages  = this.brandInfo.attributes.logo_info;
                    }
                } catch (error) {
                    sharedStore.hideLoadingPage();

                    event.emit(event.names.USER_MESSAGE, 'No brand configuration could be found for this brand.', 'error');

                    console.log('There was no brand config in the Database with this brand ID');

                    this.brandInfo = brandStub;
                    this.brandImages = {main_logo: null, partnership_logo: null};

                }
            },

            // async getBrandImage() {
            //     try {
            //         if (this.brandInfo.attributes.logo_info.main_logo.source_id) {
            //             this.brandImages.main_logo.attributes = this.brands.attributes.brandimages.mainLogo;
            //         }
            //         if (this.brandInfo.attributes.logo_info.partner_logo.partner_logo_id != null) {
            //             this.brandImages.partnership_logo = this.brandInfo.attributes.logo_info.partner_logo;
            //         }
            //     } catch (error) {
            //         console.log(error);
            //     }
            // },

            async createBrandInfo(data) {
                delete data.data.id;
                try {
                    this.brandInfo = await brandsStore.saveNewBrandConfig(data);
                } catch (error) {
                    console.log(error);
                }
            },

            async updateBrandInfo(data) {
                try {
                    this.brandInfo = await brandsStore.updateBrandConfig(data, data.data.id);
                } catch (error) {
                    console.log(error);
                }
            },

            async saveImageToCDN(mediaInfo) {
                try {
                    let formData = new FormData();
                    formData.append('file', mediaInfo.attributes.target, mediaInfo.attributes.name);
                    return cdnStore.uploadToCDN(formData)
                } catch (error) {
                    console.log(error);
                }
            },

            async updateBrandImage(newData) {
                let imageID = newData.attributes.id;
                delete newData.attributes.id;
                delete newData.attributes.url;

                let data = {
                    'data': {
                        'id':imageID,
                        'type': 'brandimages',
                        'attributes': newData.attributes,
                        "relationships": {
                            "model": {
                                'data': {
                                    'type': 'brands',
                                    'id': this.brands.id
                                }
                            }
                        }
                    }
                };

                try{
                    let tempImage = await imageStore.update(imageID, data);
                }catch(error){
                    console.log(error);
                }
            },

            async savingNewImage(info, newImage, type) {
                let data = {
                    'data': {
                        'type': 'brandimages',
                        'attributes': {
                            'title': info.title,
                            'alt_tag': info.alt_tag,
                            'source': 'CDN',
                            'source_id': newImage.filename,
                        },
                        "relationships": {
                            "model": {
                                'data': {
                                    'type': 'brands',
                                    'id': this.brands.id
                                }
                            }
                        }
                    }
                };

                try {
                    let tempImage = await imageStore.create(data);

                    if(type === 'partner'){
                        this.brandImages.partnership_logo = tempImage;
                        this.brandInfo.attributes.partner_logo_id = tempImage.id;
                    }else{
                        this.brandImages.main_logo = tempImage;
                        this.brandInfo.attributes.main_logo_id = tempImage.id;
                    }

                    event.emit(event.names.USER_MESSAGE, 'Your image was uploaded successfully', 'success');

                    this.updateBrandInfo(http.createData(this.brandInfo));

                } catch (error) {
                    console.log(error);
                    event.emit(event.names.USER_MESSAGE, 'There was a problem uploading your image', 'error');
                }
            },


        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";
</style>