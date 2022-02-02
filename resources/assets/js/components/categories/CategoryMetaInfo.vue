<template>
    <div class="details-form">
        <div class="details-form__body" >
            <h2>Category Meta Information</h2>
            <div>
                <label for="categoryMetaTitle">Meta Title</label>
                <input id="categoryMetaTitle" v-model="newMetaInfo.title" data-vv-scope="meta" name="categoryMetaTitle" data-vv-as="Title" v-validate="'required'"/>
            </div>
            <span class="error-message" v-for="error in errors.collect('meta.categoryMetaTitle')" :key="error+'a'">{{ error }}</span>
            <div>
                <label for="categoryMetaDesc">Meta Description</label>
                <tinymce :id="'categoryMetaDesc'" v-model="newMetaInfo.description" data-vv-scope="meta" name="categoryMetaDesc" data-vv-as="Description" v-validate="'max:320|required'" maxlength="320"></tinymce>
            </div>
            <span class="error-message" v-for="error in errors.collect('meta.categoryMetaDesc')" :key="error+'b'">{{ error }}</span>
            <div>
                <label for="categoryMetaKeywords">Meta Keywords</label>
                <input id="categoryMetaKeywords" v-model="newMetaInfo.keywords" data-vv-scope="meta" name="categoryMetaKeywords" data-vv-as="Meta Keywords"/>
            </div>
        <span class="error-message" v-for="error in errors.collect('meta.categoryMetaKeywords')" :key="error+'c'">{{ error }}</span>
        <br>
        </div>
        <div class="details-form__cta">
            <button class="btn btn-primary" :disabled="$validator.errors.any('meta')" @click="updateMetaInfo()">Update Meta Description</button>
        </div>
    </div>
</template>

<script>
import {event} from '@/services';

    export default {
        name: "CategoryMetaInfo",

        props:['metaInfo', 'tab'],

        data(){
            return{
                newMetaInfo: {
                    'title': '',
                    'description': '',
                    'keywords': ''
                }
            } 
        },

        watch:{
            metaInfo(){
                this.newMetaInfo = this.metaInfo;
            },
            tab() {
                this.$validator.reset();
            },
        },

        methods:{
            async updateMetaInfo(){
               await this.$validator.validateAll('meta');

               if(this.$validator.errors.any('meta')) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }

                event.emit(event.names.UPDATE_CATEGORY_INFORMATION, this.newMetaInfo);

            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>