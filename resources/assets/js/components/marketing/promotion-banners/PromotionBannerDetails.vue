<template>
    <div class="details-form">
        <div class="details-form__body">
            <div>
                <label>Promotion Banner Title</label>
                <input v-model="title" name="Title" v-validate="'required'" type="text"/>
            </div>
            <span v-for="error in errors.collect('Title')" :key="error+'a'" class="error-message">{{ error }}</span>
            <div>
                <label>Promotion Banner Alt Tag</label>
                <input v-model="alt_tag" name="Alt Tag" v-validate="'required'" type="text"/>
            </div>
            <span v-for="error in errors.collect('Alt Tag')" :key="error+'b'" class="error-message">{{ error }}</span>
            <div>
                <label>Promotion Banner URL</label>
                <input v-model="link" name="URL" v-validate="'required'" type="text"/>
            </div>
            <span v-for="error in errors.collect('URL')" :key="error+'c'" class="error-message">{{ error }}</span>
              <div>
                <label>Promotion Banner Order</label>
                <input v-model="order" name="Order" v-validate="'required'" type="text"/>
            </div>
             <span v-for="error in errors.collect('Order')" :key="error+'d'" class="error-message">{{ error }}</span>
            <div>
                <label>Active</label>
                <input type="checkbox" v-model="active" name="active" data-vv-as="Active" v-validate="'included:1,0'"/>
            </div>
            <span v-for="error in errors.collect('active')" :key="error+'e'" class="error-message">{{ error }}</span>
        </div>
             <div class="brandImageSection__Buttons">
                  <label>Select An Image</label>
                  <input class="fileUpload" name="Image" ref="uploadBanner" v-validate="'required'" @change="pickFiles($event, 'mainLogo')" type="file" accept="image/png, image/jpeg">
                  <div v-if="this.view === 'create-promotion-banner'">
                      <span v-for="error in errors.collect('Image')" :key="error+'g'" class="error-message">{{ error }}</span>
                  </div>
                </div>
                <div v-if="newImageTemp" style="margin-bottom: 20px;">
                    <img style="max-width:100px;"  :src="newImageTemp"/>
                </div>
        <div class="details-form__cta">
            <div class="details-form__cta">
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="savePromotionBanner()">Save Promotion Banner</button>
            <button v-show="view == 'edit-promotion-banner'" class="btn btn-danger" @click="deletePromotionBanner()">Delete Promotion Banner</button>
        </div>
    </div>
    </div>
</template>

<script>
    import {promotionBannerStore} from "@/stores";
    import {cdnStore} from "@/stores";
    import {event, endPoints} from '@/services';

    export default {
        components:{},

        props:['banner', 'view'],

        data(){
            return{
                title: '',
                'alt_tag': '',
                link: '',
                order: '',
                Image: null,
                edit: false,
                errorResponse: null,
                newImageTemp: null,
                loadedImage: null,
                active: false
            }
        },

        watch:{
            view()
            {
                this.$validator.reset();
            },
            async banner() {
                this.$refs.uploadBanner.value = null
                if (this.banner != null && this.view === 'edit-promotion-banner') {
                    if (this.banner.type === 'promotion-banners') {
                        this.title = this.banner.attributes.title;
                        this.alt_tag = this.banner.attributes.alt_tag;
                        this.link = this.banner.attributes.link;
                        this.order = this.banner.attributes.order;
                        this.newImageTemp = endPoints.cdnFile + this.banner.attributes.banner_image_id;
                        this.active = this.banner.attributes.active
                    }
                }else{
                    this.title = '';
                    this.alt_tag = '';
                    this.link = '';
                    this.order = '';
                    this.newImageTemp = null
                    this.active = false
                }
            },

        },



        methods:{

            async deletePromotionBanner() {
                    try{
                await promotionBannerStore.deletePromotionBanner(this.banner);
                    }catch(error){
                        console.log(error);
                    }
            },

            pickFiles(files, type){
                this.newImageTemp = URL.createObjectURL(files.target.files[0]);
                if(this.Image === null) {
                    this.Image = {
                        'attributes': {
                            'target': files.target.files[0],
                            'alt_tag': '',
                            'title': '',
                            'url':''
                        }
                    }
                    if(this.view === 'edit-promotion-banner') {
                        this.edit = true;
                    }

                }else{
                    this.Image.attributes.url = '';
                    this.Image.attributes.target = files.target.files[0];
                }
            },


           async savePromotionBanner()
           {
               await this.$validator.validateAll();

                if(this.errors.has('title') || this.errors.has('alt_tag') || this.errors.has('order') || this.errors.has('link')) { 
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                }

                let data = {};

                if(this.view === 'create-promotion-banner'){

                    if(this.$validator.errors.any()) {
                        return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                    }

                    let fb = new FormData();
                    fb.append('file', this.Image.attributes.target);
                    let cdn = await cdnStore.uploadToCDN(fb)
                    this.edit = false;
        
                    data = {
                        'data':{
                            'type':'promotion-banners',
                            'attributes':{
                                'title':this.title,
                                'alt_tag': this.alt_tag,
                                'order': this.order,
                                'link': this.link,
                                'banner_image_id': cdn.filename,
                                'active': this.active
                            }
                        }
                    };

                   try{
                    await promotionBannerStore.createPromotionBanner(data);
                   }catch(error){
                       console.log(error);
                   }

               }else if(this.view === 'edit-promotion-banner'){



                   data = {'data':this.banner};

                   data.data.attributes.title = this.title;
                   data.data.attributes.alt_tag = this.alt_tag;
                   data.data.attributes.link = this.link;
                   data.data.attributes.order = this.order;
                   data.data.attributes.active = this.active;
                   if(this.edit == true) {
                    let fb = new FormData();
                    fb.append('file', this.Image.attributes.target);
                    let cdn = await cdnStore.uploadToCDN(fb)
                       data.data.attributes.banner_image_id = cdn.filename;
                   }

                   try{
                       console.log(data)
                       await promotionBannerStore.updatePromotionBanner(data);
                       this.edit = false;
                   }catch(error){
                       console.log(error);
                   }
               }
         }
      }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    .details-form__body label{
        min-width:150px;
    }


</style>