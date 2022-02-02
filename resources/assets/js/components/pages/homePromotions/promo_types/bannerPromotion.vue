<template>
    <section>
            <div id="promoTitleContainer">
                <label for="promoTitle">Promo Title: </label>
                <input id="promoTitle" v-model="promoTitle" type="text" title="Promo Title" v-validate="'required'" name="Title" placeholder="Please Enter a Promo Title" required>
            </div>
                    <span class="error-message" v-for="error in errors.collect('Title')" :key="error+'a'">{{ error }}</span>
            <div id="altTagContainer">
                <label for="altTag">Alt Tag: </label>
               <input id="altTag" v-model="altTag" type="text" title="altTag" v-validate="'required'" name="altTag" placeholder="Please enter an Alt Tag" required>
            </div>
                    <span class="error-message" v-for="error in errors.collect('Description')" :key="error+'b'">{{ error }}</span>
             <div id="promoLinkContainer">
                 <div class="brandImageSection__Buttons">
                  <label>Select An Image</label>
                  <input class="fileUpload" name="promoImageID" data-vv-as="Image" @change="pickFiles($event, 'mainLogo')" type="file" accept="image/png, image/jpeg">
                </div>
                    <span class="error-message" v-for="error in errors.collect('promoImageID')" :key="error+'c'">{{ error }}</span>
            <div v-if="newImageTemp">
                <img  style="max-width:100px;"  :src="newImageTemp"/>
            </div>
            </div>
            <div id="promoLinkContainer">
                <label for="promoLink">Promo Link: </label>
                <input id="promoLink" v-model="promoLink" type="text" title="Promo Link" v-validate="'required|alpha_num'" name="Promo Link" placeholder="Please Enter a Promo Link" required>
            </div>
                    <span class="error-message" v-for="error in errors.collect('Promo Link')" :key="error+'d'">{{ error }}</span>
            <div class="details-form__cta">
                <button class="btn btn-primary" @click="updatePromo()">Update Content</button>
            </div>
    </section>
</template>

<script>
import {sharedStore} from '@/stores';
import {homePromosStore} from '@/stores';
import {cdnStore} from '@/stores';
import {event} from '@/services';
export default {

    props: ['promoInfo', 'subview', 'promoType'],
    data() {
        return {
            promoTitle: '',
            altTag: '',
            promoLink: '',
            promoImageID: null,
            newImageTemp: '',
            image: '',
            error: ''
        }
    },

    watch: {
        async promoType() {
            this.errors.clear();
            if(this.promoInfo.attributes.promo_type === 3) {
            this.promoTitle = this.promoInfo.attributes.title;
            this.altTag = this.promoInfo.attributes.description;
            this.promoLink = this.promoInfo.attributes.promo_link;
            this.buttonText = this.promoInfo.attributes.button_text;
            this.promos = homePromosStore.state
            this.image = await cdnStore.getFromCDN(this.promoInfo.attributes.image_id);
            this.newImageTemp = this.image.data[0].attributes.url;

            this.promos = homePromosStore.state;

            } else {
            this.promoTitle = null;
            this.altTag = null;
            this.promoLink = null;
            this.buttonText = null;
            this.promos = null
            }
        },
        tab() {
            this.promoInfo = homePromosStore.promoByID(this.tab)
            if(this.promoInfo.attributes.promo_type == 3) {
            this.promoTitle = this.promoInfo.attributes.title;
            this.altTag = this.promoInfo.attributes.description;
            this.promoLink = this.promoInfo.attributes.promo_link;
            this.buttonText = this.promoInfo.attributes.button_text;
            this.promos = homePromosStore.state
            } else {
            this.promoTitle = null;
            this.altTag = null;
            this.promoLink = null;
            this.buttonText = null;
            this.promos = null
            }
        }

    },

    methods: {
            pickFiles(files, type){
                this.newImageTemp = URL.createObjectURL(files.target.files[0])
                if(this.promoImageID === null) {
                    this.promoImageID = {
                        'attributes': {
                            'target': files.target.files[0],
                            'alt_tag': '',
                            'title': '',
                            'url':''
                        }
                    }
                }else{
                    this.promoImageID.attributes.url = '';
                    this.promoImageID.attributes.target = files.target.files[0];
                }
            },
            async updatePromo(){

                await this.$validator.validateAll();

               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
                sharedStore.showLandingPage();
                let data = {};

                if(this.promoInfo.attributes.promo_type === 3 && this.promoImageID == null) {
                data = {
                    'data': {
                        'type':'promos',
                        'attributes': {
                            'promo_type': 3,
                            'title': this.promoTitle,
                            'description': this.altTag,
                            'image_id': this.promoInfo.attributes.image_id,
                            'promo_link': this.promoLink,
                            'button_text': this.buttonText
                            }
                        }
                    };
                } else {

                let fb = new FormData();
                fb.append('file', this.promoImageID.attributes.target);
                let cdn = await cdnStore.uploadToCDN(fb);

                data = {
                    'data': {
                        'type':'promos',
                        'attributes': {
                            'promo_type': 3,
                            'title': this.promoTitle,
                            'description': this.altTag,
                            'image_id': cdn.filename,
                            'promo_link': this.promoLink,
                            'button_text': this.buttonText
                            }
                        }
                    };
                }

                try {
                   await homePromosStore.update(data ,this.promoInfo.id);
                } catch (error) {
                    console.log(error);
                    event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error');
                }
            }
    }

}
</script>

<style>

</style>
