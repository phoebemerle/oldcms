<template>
    <div style="padding:10px;">
        <div>
            <label>Title</label>
            <input v-model="imageInfo.attributes.title" type="text" name="imgTitle" v-validate="'required'" />
              <br>
            <span class="error-message" v-for="(error, index) in errors.collect('imgTitle')" :key="index">{{error}}</span>
        </div>
        <div>
            <label>Alt Tags</label>
            <input v-model="imageInfo.attributes.alt_tag" type="text" name="imgAltTag" v-validate="'required'"/>
            <br>
            <span class="error-message" v-for="(error, index) in errors.collect('imgAltTag')" :key="index">{{error}}</span>
        </div>
        <div  class="imageSection">
            <div v-if="!imageInfo.attributes.url" class="imageSection__Info__NoImage">
                <div>No Image</div>
            </div>
            <div v-if="imageInfo.attributes.url" class="imageSection__Info__Image">
                <div>
                    <img :src="imageInfo.attributes.url"/>
                </div>
            </div>
        </div>
        <div>
            <button class="btn btn-primary" :disabled="$validator.errors.has('imgAltTag') || $validator.errors.has('imgTitle')" @click="updateInfo()">Update Icon</button>
        </div>
    </div>
</template>

<script>
    import {http} from '@/services';
    import {footerContactInfoStore} from '@/stores';
    import {imageStore} from '@/stores';
    import {event} from '@/services';

    export default {
        name: "EditSocialIcon",

        components:{},

        props:['image'],

        data(){
            return{
                imageInfo:{
                    'attributes':{
                        'title':'',
                        'alt_tag':'',
                        'url':null
                    }
                }
            }
        },

        watch:{
            image(){
                this.imageInfo = this.image;
            }
        },

        methods: {
            async updateInfo(){
                await this.$validator.validateAll();

                if(this.$validator.errors.has('imgTitle') || this.$validator.errors.has('imgAltTag')) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                }
                let data = http.createData(this.imageInfo);

                try{
                    imageStore.update(data.data.id, data);
                    event.emit(event.names.USER_MESSAGE, 'Your image was uploaded successfully', 'success');
                }catch (error) {
                    event.emit(event.names.USER_MESSAGE, 'There was a problem', 'error');
                }



            }
        }

    }
</script>


<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>