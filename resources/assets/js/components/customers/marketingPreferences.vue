<template>
    <div class="details-form">
        <div class="details-form__body" >
            <div>
                <label>Promotions</label>
                <input v-model="preferences.promotions" type="checkbox"/>
            </div>
            <div>
                <label>Industry News</label>
                <input v-model="preferences.industry_news" type="checkbox"/>
            </div>
            <div>
                <label>Product Information</label>
                <input v-model="preferences.product_info" type="checkbox"/>
            </div>
            <div>
                <label>Exhibitions</label>
                <input v-model="preferences.exhibitions" type="checkbox"/>
            </div>
            <div>
                <label>Account Support</label>
                <input v-model="preferences.account_support" type="checkbox"/>
            </div>
            <button class="btn btn-primary" @click="update()">Update Preferences</button>
        </div>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {sharedStore} from '@/stores';
    import {customerStore} from '@/stores';
    import {http} from "@/services";
    import customerStub from '@/stubs/Customers';


    export default {

        props:['customer'],

        data() {
            return {
                preferences: {
                    'promotions':0,
                    'industry_news':0,
                    'product_info':0,
                    'exhibitions':0,
                    'account_support':0,
                }
            }
        },

        watch:{
            customer(){
                if(this.customer) {
                    if ((this.customer.type === 'customer-details')&&(this.customer.attributes.marketing_preferences)) {
                        this.preferences = this.customer.attributes.marketing_preferences;
                    }else{
                        this.preferences = {
                            'promotions':0,
                            'industry_news':0,
                            'product_info':0,
                            'exhibitions':0,
                            'account_support':0,
                        }
                    }
                }
            }
        },

        methods: {
            update(){
                if(this.preferences.user_id) {
                    customerStore.updateMarketingPref(this.preferences);
                }else{
                    this.preferences.user_id = this.customer.id;
                    customerStore.saveMarketingPref(this.preferences);
                }
            },

        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    .errorMessage{
        margin: 0;
        padding: 10px;
        color: white;
        font-weight: bold;
    }

</style>