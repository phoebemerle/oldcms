<template>
    <section>
                <div id="promoTitleContainer">
                    <label for="textPromoTitle">Promo Title: </label>
                    <input id="textPromoTitle" v-model="promoTitle" type="text" title="Promo Title" v-validate="'required'" name="Title" placeholder="Please Enter a Promo Title">
                </div>
                    <span class="error-message" v-for="error in errors.collect('Title')" :key="error+'a'">{{ error }}</span>
                <div id="promoDescriptionContainer">
                    <label>Promo Description: </label>
                    <tinymce :id="'promoDescription'" v-model="promoDescription" title="Promo Description" v-validate="'required'" name="Description" placeholder="Please Enter a Promo Description">
                    </tinymce>
                </div>
                    <span class="error-message" v-for="error in errors.collect('Description')" :key="error+'b'">{{ error }}</span>
                <div id="promoLinkContainer">
                    <label for="textPromoLink">Promo Link: </label>
                    <input id="textPromoLink" v-model="promoLink" type="text" title="Promo Link" v-validate="'required'" name="Promo Link" placeholder="Please Enter a Promo Link">
                </div>
                    <span class="error-message" v-for="error in errors.collect('Promo Link')" :key="error+'c'">{{ error }}</span>
                <div id="buttonTextContainer">
                    <label for="buttonText">Button Text: </label>
                    <input id="buttonText" v-model="buttonText" type="text" title="Button Text" v-validate="'required'" name="Button Text" placeholder="Please Enter the Button Text">
                </div>
                    <span class="error-message" v-for="error in errors.collect('Button Text')" :key="error+'d'">{{ error }}</span>
                <div class="details-form__cta">
                    <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="updateTextPromo()">Update Content</button>
                </div>
    </section>
</template>

<script>
import {sharedStore} from '@/stores';
import {homePromosStore} from '@/stores';
import {event} from '@/services';

export default {

    props: ['promoInfo', 'subview', 'promoType', 'tab'],

    data() {
        return {
            promoTitle: '',
            promoDescription: '',
            promoLink: '',
            promoImageID: null,
            buttonText: '',
            error: null
        }
    },

    watch: {
        promoType() {
            this.errors.clear();
            if(this.promoInfo.attributes.promo_type === 1) {
            this.promoTitle = this.promoInfo.attributes.title;
            this.promoDescription = this.promoInfo.attributes.description;
            this.promoLink = this.promoInfo.attributes.promo_link;
            this.buttonText = this.promoInfo.attributes.button_text;
            this.promos = homePromosStore.state
            } else {
            this.promoTitle = '';
            this.promoDescription = '';
            this.promoLink = '';
            this.buttonText = '';
            this.promos = null
            }
        },
        tab() {
            this.promoInfo = homePromosStore.promoByID(this.tab)
            if(this.promoInfo.attributes.promo_type == 1) {
            this.promoTitle = this.promoInfo.attributes.title;
            this.promoDescription = this.promoInfo.attributes.description;
            this.promoLink = this.promoInfo.attributes.promo_link;
            this.buttonText = this.promoInfo.attributes.button_text;
            this.promos = homePromosStore.state
            } else {
            this.promoTitle = '';
            this.promoDescription = '';
            this.promoLink = '';
            this.buttonText = '';
            this.promos = null
            }
        }
    },
    methods: {
        async updateTextPromo(){
            await this.$validator.validateAll();
               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
            sharedStore.showLandingPage();
            var data = {
                'data': {
                    'type':'promos',
                    'attributes': {
                        'promo_type': 1,
                        'title': this.promoTitle,
                        'description': this.promoDescription,
                        'image_id': null,
                        'promo_link': this.promoLink,
                        'button_text': this.buttonText
                    }
                }
            };
            homePromosStore.update(data, this.promoInfo.id.toString());
        }
    }
}
</script>

<style>

</style>
