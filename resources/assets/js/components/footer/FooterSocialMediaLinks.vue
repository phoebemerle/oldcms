<template>
    <div class="details-form">
        <div class="details-form__body" id="">
            <div>
                <h2>Footer Social Media Links</h2>
            </div>
            <div>
                <div id="footerSocialNameSection" >
                    <label for="socialNameInput">Social Media Name</label>
                    <input id="socialNameInput" name="socialNameInput" data-vv-as="Social Media Name" class="smallerInput" v-validate="'required'" type="text" v-model="siteSocialLinks.attributes.name"/>
                    <br>
                    <span class="error-message" v-for="(error, index) in errors.collect('socialNameInput')" :key="index">{{ error }}</span>
                </div>  
                <div id="footerSocialUrlSection">
                    <label for="socialURLInput">Social URL</label>
                    <input id="socialURLInput" class="smallerInput" type="text" name="socialURLInput" data-vv-as="Social URl" v-validate="'required'" v-model="siteSocialLinks.attributes.url"/>
                    <br>
                    <span class="error-message" v-for="(error, index) in errors.collect('socialURLInput')" :key="index">{{ error }}</span>
                </div>
                <div id="footerSocialOrderSection">
                    <label for="socialOrderInput">Website Order</label>
                    <input id="socialOrderInput" name="socialOrderInput" data-vv-as="Website Order" class="inputOrderBox" v-validate="'required|numeric'" type="text" v-model="siteSocialLinks.attributes.order"/>
                    <br>
                    <span class="error-message" v-for="(error, index) in errors.collect('socialOrderInput')" :key="index">{{ error }}</span>
                </div>
                <div id="footerSocialIconSection">
                    <label for="footerSocialIconInput">Icon Class</label>
                    <input id="footerSocialIconInput" name="socialSocialInput" type="text" v-model="siteSocialLinks.attributes.icon"/>
                    <br>
                    <p>You will find the icon class at <a style="color:blue" href="https://fontawesome.com">fontawesome</a></p>
                </div>
                <div id="footerSocialActiveSection">
                    <label for="socialActiveInput">Active</label>
                    <input id="socialActiveInput" name="socialActiveInput" data-vv-as="Active" type="checkbox" v-model="siteSocialLinks.attributes.active"/>
                    <br>
                    <span class="error-message" v-for="(error, index) in errors.collect('socialActiveInput')" :key="index">{{ error }}</span>
                </div>

                <div class="details-form__cta">
                    <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="updateLink()">Update Social Links</button>
                </div>
                <hr>
            </div>
        </div>
    </div>
</template> 

<script>
    import {event} from '@/services';
    import {http} from '@/services';
    import {footerContactInfoStore} from '@/stores';
    import {imageStore} from '@/stores';
    import {cdnStore} from '@/stores';

    export default {
        name: "FooterSocialMediaLinks",

        props:['footersocialmedialinks', 'footerTab', 'row'],

        data(){
            return{
                siteSocialLinks: this.footersocialmedialinks,
                socialImage:[],
                tab:'add-new-icon'
            }
        },

        watch:{
            footersocialmedialinks(){
                this.siteSocialLinks = this.footersocialmedialinks;
            },
            footerTab() {
                this.$validator.reset();
            }
        },

        methods:{
            async updateLink(){
                if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                }
                let data = http.createData(this.siteSocialLinks);
                if(!this.siteSocialLinks.id) {
                    this.siteSocialLinks = await footerContactInfoStore.storeSocialLinks(data, this.row)
                } else {
                    await footerContactInfoStore.updateSocialLinks(data, data.data.id);
                }

            },

            changeTab(tab){
                this.tab = tab;
            },
        }



    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>