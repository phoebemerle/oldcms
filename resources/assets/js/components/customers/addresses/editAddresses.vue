<template>
    <div class="details-form">
        <div class="details-form__body" >
            <div>
                <label>Company</label>
                <input type="text" v-model="editAddress.AddressCompany"/>
            </div>
            <div>
                <div>
                    <label>Contact First Name</label>
                    <input type="text" v-model="editAddress.AddressContactFirstName"/>
                </div>
                <div>
                    <label>Contact First Name</label>
                    <input type="text" v-model="editAddress.AddressContactLastName"/>
                </div>
            </div>
            <div>
                <label>Address Line 1</label>
                <input type="text" v-model="editAddress.AddressLine1"/>
            </div>
            <div>
                <label>Address Line 1</label>
                <input type="text" v-model="editAddress.AddressLine2"/>
            </div>
            <div>
                <label>Postcode</label>
                <input type="text" v-model="editAddress.Postcode"/>
            </div>
            <div>
                <label>City</label>
                <input type="text" v-model="editAddress.AddressCity"/>
            </div>
            <div>
                <label>County</label>
                <input type="text" v-model="editAddress.AddressCounty"/>
            </div>
            <div>
                <label>Country</label>
                <input type="text" v-model="editAddress.AddressCountry"/>
            </div>
            <div>
                <label>Contact Number</label>
                <input type="text" v-model="editAddress.Telephone"/>
            </div>
            <div>
                <label>Default Address?</label>
                <input type="checkbox" v-model="editAddress.Default"/>
            </div>
            <div>
                <label>Priority</label>
                <input type="number" v-model="editAddress.Priority"/>
            </div>
            <button class="btn btn-primary" @click="updateAddress()">Update Address</button>
        </div>
        <hr>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {sharedStore} from '@/stores';
    import {customerStore} from '@/stores';
    import {http} from "@/services";
    import customerStub from '@/stubs/Customers';


    export default {

        props:['address'],

        data() {
            return {
                editAddress:this.address
            }
        },

        methods: {
            async updateAddress(){
                await customerStore.updateAddress(this.editAddress);
            }
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