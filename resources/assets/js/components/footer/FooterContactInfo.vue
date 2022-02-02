<template>
    <div class="details-form">
        <div class="details-form__body" >
            <div>
                <h2>Footer Contact Info</h2>
            </div>
            <div id="footerBusinessNameContainer">
                <label for="footerBusinessName">Business Name: </label>
                <input id="footerBusinessName" v-model="contactInfo.attributes.business_name" type="text" title="Business Name" data-vv-as="Business Name" name="footerBusinessName" v-validate="'required'" placeholder="Please enter the business name">
            </div>
            <span class="error-message" v-for="error in errors.collect('footerBusinessName')" :key="error+'a'">{{error}}</span>
            
            <div id="footerAddressLineOneContainer">
                <label for="footerAddressLineOne">Address Line One:</label>
                <input id="footerAddressLineOne" v-model="contactInfo.attributes.address_line_one" type="text" title="Address Line One" data-vv-as="Address Line One" name="footerAddressLineOne" v-validate="'required'" placeholder="Address Line One">
            </div>
            <span class="error-message" v-for="error in errors.collect('footerAddressLineOne')" :key="error+'b'">{{error}}</span>
            
            <div id="footerAddressLineTwoContainer">
                <label for="footerAddressLineTwo">Address Line Two:</label>
                <input id="footerAddressLineTwo" v-model="contactInfo.attributes.address_line_two" type="text" title="Address Line Two" name="footerAddressLineTwo" placeholder="Address Line Two">
            </div>

            <div id="footerCountyContainer">
                <label for="footerCounty">County:</label>
                <input id="footerCounty" v-model="contactInfo.attributes.county" type="text" title="County" name="footerCounty" data-vv-as="County" v-validate="'required'" placeholder="County">
            </div>
            <span class="error-message" v-for="error in errors.collect('footerCounty')" :key="error+'c'">{{error}}</span>

            <div id="footerPostcodeContainer">
                <label for="footerPostcode">Postcode:</label>
                <input id="footerPostcode" v-model="contactInfo.attributes.postcode" type="text" title="Postcode" name="footerPostcode" data-vv-as="Postcode" v-validate="'required'" placeholder="Postcode">
            </div>
            <span class="error-message" v-for="error in errors.collect('footerPostcode')" :key="error+'d'">{{error}}</span>

            <div id="footerPhoneNumberContainer">
                <label for="footerPhoneNumber">Phone Number:</label>
                <input id="footerPhoneNumber"   v-model="contactInfo.attributes.phone_number" type="text" title="Phone Number" name="footerPhoneNumber" v-validate="{ required: true, regex:/^[0-9\s+]+$/ }" data-vv-as="Phone Number" placeholder="Phone Number">
            </div>
            <span class="error-message" v-for="error in errors.collect('footerPhoneNumber')" :key="error+'e'">{{error}}</span>

            <div id="footerFaxContainer">
                <label for="footerFax">Fax Number:</label>
                <input id="footerFax" v-model="contactInfo.attributes.fax" type="text" title="Fax Number" name="footerFax" placeholder="Fax Number" v-validate="{ regex:/^[0-9\s+]+$/ }" data-vv-as="Fax Number">
            </div>
            <span class="error-message" v-for="error in errors.collect('footerFax')" :key="error+'f'">{{error}}</span>

            <div class="details-form__cta">
                <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="updateFooterContact()">Update Footer Contact Info</button> 
            </div>
        </div>
    </div>
</template> 

<script>

    import {footerContactInfoStore} from '@/stores';
    import {http} from '@/services';
    import {event} from '@/services';

    export default {
        name: "FooterContactInfo",

        props:['footercontactinfo', 'tab'],

        data(){
            return{
                contactInfo:{
                    attributes:{
                        'business_name':'',
                        'address_line_one':'',
                        'address_line_two':'',
                        'county':'',
                        'postcode':'',
                        'phone_number':'',
                        'fax':''
                    }
                },
            }
            
        },
        watch:{
            footercontactinfo()
            {
                if(this.footercontactinfo) {
                    if(this.footercontactinfo.type === 'footercontact') {
                        this.contactInfo = this.footercontactinfo;
                    }
                }
            },
            tab() {
                this.$validator.reset();
            }
            
        },


        methods:{
           
           async updateFooterContact() {
               await this.$validator.validateAll();
               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }

                let data = http.createData(this.contactInfo);

               footerContactInfoStore.updateFooterContact(data, this.contactInfo.id);
            }
            

        }
    }




</script>

<style lang="scss">
    @import "~#/variables";

</style>