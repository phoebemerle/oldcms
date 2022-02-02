<template>
    <div class="main-sections__editForm">
        <div v-show="subview === 'edit-footer'" class="overviewTabs">
            <ul class="list-inline">
                <li v-bind:class="{ activeTab: tab === 'footer-contact-info' }" @click="changeTab('footer-contact-info')">Contact Info</li>
                <li v-bind:class="{ activeTab: tab === 'footer-site-resources' }" @click="changeTab('footer-site-resources')" class="">Site Resources</li>
                <li v-bind:class="{ activeTab: tab === 'footer-customer-services' }" @click="changeTab('footer-customer-services')" class="">Customer Services</li>
                <li v-bind:class="{ activeTab: tab === 'footer-social-media-links' }" @click="changeTab('footer-social-media-links')" class="">Social Media Links</li>
            </ul>
        </div>
        <div class="main-sections__editForm__container">
            <footer-contact-info v-show="tab ==='footer-contact-info'" :footercontactinfo="footerContactInfo" :tab="tab"/>
            <footer-site-resources v-show="tab === 'footer-site-resources'" :footersiteresources="footerSiteResource" :tab="tab"/>
            <footer-customer-services v-show="tab === 'footer-customer-services'" :footercustomerservices="footerCustomerService" :tab="tab"/>
            <div class="details-form__cta" v-show="tab === 'footer-social-media-links'">
                <button class="btn btn-primary" style="margin:5px 0px 5px 0px; font-size: 1.25rem;" @click="addSocialMediaLink()" >Add Social Media Link</button>
            </div>
            <footer-social-media-links v-for="(data, index) in footerSocialMedia" v-show="tab === 'footer-social-media-links'" :footersocialmedialinks="data" :row="index" :footerTab="tab" :key="index"/>
        </div>
    </div>
</template> 

<script>
    import {event} from '@/services';
    import {footerContactInfoStore} from '@/stores';
    import FooterContactInfo from '@/components/footer/FooterContactInfo';
    import FooterSiteResources from '@/components/footer/FooterSiteResources';
    import FooterCustomerServices from '@/components/footer/FooterCustomerServices';
    import FooterSocialMediaLinks from '@/components/footer/FooterSocialMediaLinks';
    import stub from '@/stubs/footerSocialMedia.js';

    export default {
        name: "FooterMain",

        components: {FooterContactInfo, FooterSiteResources, FooterCustomerServices, FooterSocialMediaLinks},

        props:['subview', 'footerinfo'],

        data(){
            return{
                tab: 'footer-contact-info',
                footerContactInfo: [],
                footerSiteResource:[],
                footerCustomerService:[],
                footerSocialMedia:[],
                footerSocialMediaStub: stub
            }
        },

        watch:{

            subview(){
                this.tab = 'footer-contact-info';
            },

            footerinfo() {
                if(this.footerinfo.length > 0){
                    if(this.footerinfo[0].type === 'footerInfo'){
                        this.footerContactInfo = this.footerinfo[0].footerContactInfo[0];
                        this.footerSiteResource = this.footerinfo[0].footerSiteResources;
                        this.footerCustomerService = this.footerinfo[0].footerCustomerLinks;
                        this.footerSocialMedia = this.footerinfo[0].footerSocialLinks;
                    }
                }
            }
        },


        methods:{
            changeTab(tab){
                this.tab = tab;
            },
            async addSocialMediaLink()
            {
                var addValue = stub;
                addValue.attributes.order = this.footerSocialMedia.length+1;
                await this.footerSocialMedia.push(addValue)
                window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
            }
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>