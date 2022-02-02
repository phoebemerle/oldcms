<template>
    <div class="details-form">
        <div class="details-form__body" >
            <div>
                <label for="homePageTextHeading">Home Page Text Heading</label>
                <input id="homePageTextHeading" type="text" v-model="newContent.attributes.text_heading" name="homePageTextHeading" data-vv-as="Home Page Text Heading" v-validate="'required'">
            </div>
            <span class="error-message" v-for="error in errors.collect('homePageTextHeading')" :key="error+'a'">{{error}}</span>
            <div>
                <label for="homePageTextSubHeading1">Home Page Text Sub Heading 1</label>
                <input id="homePageTextSubHeading1" type="text" v-model='newContent.attributes.heading_1' name="homePageTextSubHeading1" data-vv-as="Home Page Text Sub Heading 1" v-validate="'required'">
            </div>
            <span class="error-message" v-for="error in errors.collect('homePageTextSubHeading1')" :key="error+'b'">{{error}}</span>
            <div>
                <label for="homePageText1">Home Page Text 1</label>
                <tinymce :id="'homePageText1'" v-model='newContent.attributes.subtext_1' name="homePageText1" v-validate="'required'"></tinymce>
            </div>
            <span class="error-message" v-for="error in errors.collect('homePageText1')" :key="error+'c'">{{error}}</span>
            <div>
                <label for="homePageTextSubHeading2">Home Page Text Sub Heading 2</label>
                <input id="homePageTextSubHeading2" type="text" v-model='newContent.attributes.heading_2'>
            </div>

            <div>
                <label for="homePageText2">Home Page Text 2</label>
                <tinymce :id="'homePageText2'" v-model='newContent.attributes.subtext_2'></tinymce>
            </div>

            <div>
                <label for="homePageTextSubHeading3">Home Page Text Sub Heading 3</label>
                <input id="homePageTextSubHeading3" type="text" v-model='newContent.attributes.heading_3'>
            </div>

            <div>
                <label for="homePageText3">Home Page Text 3</label>
                <tinymce :id="'homePageText3'" v-model='newContent.attributes.subtext_3'></tinymce>
            </div>

            <div>
                <label for="homePageTextSubHeading4">Home Page Text Sub Heading 4</label>
                <input id="homePageTextSubHeading4" type="text" v-model='newContent.attributes.heading_4'>
            </div>

            <div>
                <label for="homePageText4">Home Page Text 4</label>
                <tinymce :id="'homePageText4'" v-model='newContent.attributes.subtext_4'></tinymce>
            </div>
            <div>
                <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="updateContent()">Update Content</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {event} from '@/services';
    import PageHeader from '@/components/shared/PageHeader';
    import {homePageStore} from '@/stores';

    export default {
        name: "editHomeText",

        components: {PageHeader},

        props:['content'],

        data(){
            return{
                newContent:{
                    attributes:{
                        'heading_1':'',
                        'heading_2':'',
                        'heading_3':'',
                        'heading_4':'',
                        'left_sub_banner_id':'',
                        'left_sub_banner_link':'',
                        'main_banner_id':'',
                        'main_banner_link':'',
                        'right_sub_banner_id':'',
                        'right_sub_banner_link':'',
                        'side_banner_id':'',
                        'side_banner_link':'',
                        'subtext_1':'',
                        'subtext_2':'',
                        'subtext_3':'',
                        'subtext_4':'',
                        'text_heading':''

                    }
                }
            }
        },

        watch:{
            content(){
                if(this.content) {
                    if (this.content.type === 'home-page-contents') {
                        this.newContent = this.content;
                    }
                }
            }
        },

        methods:{
            async updateContent(){
                await this.$validator.validateAll();
               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
                let data = {
                    'data':{
                        'attributes':this.newContent.attributes,
                        'type':this.content.type,
                        'id':this.content.id
                    }
                };

                try{
                    await homePageStore.updateHomePageContent(data, this.content.id);
                }catch (error) {
                    event.emit(event.names.USER_MESSAGE, 'There was a problem uploading your image', 'error');
                }

            }
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>