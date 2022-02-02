<template>
    <div class="details-form">
        <div class="details-form__body" >
            <h2>Product Meta Information</h2>
            <div>
                <label for="productMetaTitle">Meta Title</label>
                <input id="productMetaTitle" v-model="newMetaInfo.Title" data-vv-scope="metainfo" name="productMetaTitle" data-vv-as="Title" v-validate="'required'"/>
            </div>
            <span class="error-message" v-for="error in errors.collect('metainfo.productMetaTitle')" :key="error+'a'">{{ error }}</span>
            <div>
                <label for="overwriteMetaTitle">Over write auto generated Meta Title</label>
                <input id="overwriteMetaTitle" type="checkbox" v-model="newMetaInfo.overwrite_meta_title">
            </div>
            <div>
                <label for="productMetaDesc">Meta Description</label>
                <input id="productMetaDesc" v-model="newMetaInfo.MetaDescription" data-vv-scope="metainfo" name="productMetaDesc" data-vv-as="Description" v-validate="'required'"/>

                <!-- <tinymce :id="'categoryMetaDesc'" v-model="newMetaInfo.description" data-vv-scope="metainfo" name="productMetaDesc" data-vv-as="Description" v-validate="'max:320|required'" maxlength="320"></tinymce> -->
            </div>
            <span class="error-message" v-for="error in errors.collect('metainfo.productMetaDesc')" :key="error+'b'">{{ error }}</span>
            <div>
                <label for="overwriteMetaDesc">Over write auto generated Meta Description</label>
                <input id="overwriteMetaDesc" type="checkbox" v-model="newMetaInfo.overwrite_meta_desc">
            </div>
            <div>
                <label for="productMetaKeyword">Meta Keywords</label>
                <input id="productMetaKeyword" v-model="newMetaInfo.MetaKeyword" data-vv-scope="metainfo" name="productMetaKeyword" data-vv-as="Meta Keyword"/>
            </div>
        <span class="error-message" v-for="error in errors.collect('metainfo.productMetaKeyword')" :key="error+'c'">{{ error }}</span>
        <br>
        </div>
        <div class="details-form__cta">
            <button class="btn btn-primary" :disabled="$validator.errors.any('metainfo')" @click="updateMetaInfo()">Update Meta Info</button>
        </div>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {productMetaInfoStore} from '@/stores';

    export default {

        props:['metainfo', 'product'],

        data(){
            return{
                newMetaInfo: {
                    MetaKeyword: null,
                    Title: '',
                    MetaDescription: '',
                    overwrite_meta_title : 0,
                    overwrite_meta_desc: 0,
                    product_id: null
                }
            } 
        },

        watch:{
            metaInfo(){
                this.newMetaInfo = this.metainfo;
                this.$validator.reset();
            },
            product() {
                 this.newMetaInfo = this.metainfo;
            }
        },

        created() {
            // this.newMetaInfo = this.metainfo;
        },

        methods:{
            async updateMetaInfo(){
                await this.$validator.validateAll('metainfo');

                if(this.$validator.errors.any('metainfo')) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                }

                let data = {
                    data: {
                        id: this.metainfo.id.toString(),
                        type: 'product-meta-info',
                        attributes: this.newMetaInfo
                    }
                }

                await productMetaInfoStore.update(data, this.metainfo.id)
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>