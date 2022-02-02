<template>
    <div>
        <div>
            <div>
                <h3>Main Brand Logo</h3>
                <input class="fileUpload" @change="pickFiles($event, 'mainLogo')" type="file" name="mainLogoUpload" v-validate="'image'" data-vv-as="Main Logo" accept="image/png, image/jpeg">
            </div>
            <span class="error-message" v-for="error in errors.collect('mainLogoUpload')" :key="error+'a'">{{ error }}</span>
            <div class="brandImageSection" v-if="mainLogo">
                <div  class="brandImageSection__Info">
                    <div  v-if="mainLogo.source_id"  class="brandImageSection__Info__Image">
                        <img :src="'https://comximages.blob.core.windows.net/files/'+mainLogo.source_id"/>
                    </div>
                    <div  class="brandImageSection__Info__Details">
                        <div>
                            <label>Title</label>
                            <input v-model="mainLogo.title" name="mainLogoTitle" v-validate="'required'" data-vv-as="Title" type="text"/>
                        </div>
                        <span class="error-message" v-for="error in errors.collect('mainLogoTitle')" :key="error+'b'">{{ error }}</span>
                        <div>
                            <label>Alt Tag</label>
                            <input v-model="mainLogo.alt_tag" name="mainLogoAltTag" type="text" v-validate="'required'"/>
                        </div>
                        <span class="error-message" v-for="error in errors.collect('mainLogoAltTag')" :key="error+'c'">{{ error }}</span>
                    </div>
                    <div class="brandImageSection__Buttons">
                        <div class="mediaInputSection">
                            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="uploadMedia(mainLogo, 'main')">Save</button>
                        </div>
                        <div class="mediaInputSection">
                            <button class="btn btn-danger" @click="removeMedia('mainLogo')">Remove</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <hr>
        <div>
            <div>
                <h3>Partner Logo</h3>
                <input class="fileUpload" @change="pickFiles($event, 'partnerLogo')" type="file" name="partnerLogoUpload" v-validate="'image'" data-vv-as="Partner Logo" accept="image/png, image/jpeg">
            </div>
            <span class="error-message" v-for="error in errors.collect('partnerLogoUpload')" :key="error+'d'">{{ error }}</span>
            <div class="brandImageSection" v-if="partnerLogo.source_id">
                <div class="brandImageSection__Info">
                    <div class="brandImageSection__Info__Image">
                        <img :src="'https://comximages.blob.core.windows.net/files/'+partnerLogo.source_id"/>
                    </div>
                    <div class="brandImageSection__Info__Details">
                        <div>
                            <label>Title</label>
                            <input v-model="partnerLogo.title" type="text"/>
                        </div>
                        <div>
                            <label>Alt Tag</label>
                            <input v-model="partnerLogo.alt_tag" type="text"/>
                        </div>
                    </div>
                </div>
                <div class="brandImageSection__Buttons">
                    <div class="mediaInputSection">
                        <button class="btn btn-primary" @click="uploadMedia(partnerLogo, 'partner')">Save</button>
                    </div>
                    <div class="mediaInputSection">
                        <button class="btn btn-danger" @click="removeMedia('partnerLogo')">Remove</button>
                    </div>
                </div>
            </div>
            <div class="brandImageSection" v-if="!partnerLogo">
                <div class="brandImageSection__Info__NoImage">
                    <div>No Image</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {imageStore} from '@/stores';

    export default {
        name: "BrandImages",

        props:['brandImages', 'brandInfo'],

        data(){
            return{
                mainLogo:{},
                partnerLogo:{},
            }
        },

        watch:{
            brandImages:{
                handler: function () {
                    if(this.brandImages.main_logo) {
                        this.mainLogo = this.brandImages.main_logo;
                    }
                    if(this.brandImages.partner_logo) {
                        this.partnerLogo = this.brandImages.partner_logo;
                    }
                },
                deep: true
            },
            view()
            {
                this.$validator.reset();
            }
        },

        methods:{
            pickFiles(files, type){
                if(!this[type].attributes) {
                    this[type] = {
                        'attributes': {
                            'target': files.target.files[0],
                            'alt_tag': '',
                            'title': '',
                            'url':URL.createObjectURL(files.target.files[0])
                        }
                    }
                }else{

                    this[type].attributes.url = '';
                    this[type].attributes.target = files.target.files[0];
                }
            },

            async uploadMedia(data, type){
               await this.$validator.validateAll();

               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
                event.emit(event.names.SAVE_BRAND_MEDIA,  data, type);
            },

            async removeMedia(type){                               
                let brand = this.brandInfo;
                event.emit(event.names.REMOVE_BRAND_MEDIA, brand, type)
                this[type] = {attributes:null};
                await imageStore.delete(this[type].attributes.id);
            },
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

    h3{
        margin-bottom:20px;
    }

    .brandImageSection{

        margin-top:15px;

        &__Info{

            &__Image{
                display:inline-block;
                margin-right:50px;

                img{
                    width:auto;
                    min-height:50px;
                    max-height:200px;
                }
            }

            &__NoImage{
                border:4px dotted #666666;
                width:150px;
                height:150px;
                text-align:center;
                position:relative;

                div{
                    position: absolute;
                    top: 55px;
                    left: 30px;
                    font-size:20px;
                }
            }

            &__Details{
                display:inline-block;

                input[type="text"]{
                    border:1px solid #c9c9c9;
                    border-radius: 5px;
                    width:300px;
                    font-size:14px;
                }

                div{
                    margin:10px 0;
                }

                label{
                    font-size:16px;
                    width:60px;
                }

            }

        }

        &__Buttons{
            margin:10px 0;
        }

    }

</style>