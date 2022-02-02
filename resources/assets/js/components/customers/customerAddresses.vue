<template>
    <div class="details-form">
        <div class="details-form__body" >
            <div id="deliveryAddresses" class="sections">
                <h2 @click="showDelivery = !showDelivery">Delivery Addresses</h2>
                <div v-if="showDelivery">
                    <edit-address v-for="(address, index) in customer.attributes.deliveryaddresses" :address="address" :key="index"></edit-address>
                </div>
            </div>
            <div id="invoiceAddresses" class="sections">
                <h2 @click="showInvoice = !showInvoice">Invoice Addresses</h2>
                <div v-if="showInvoice">
                    <edit-address v-for="(address, index) in customer.attributes.invoiceaddresses" :address="address" :key="index"></edit-address>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import EditAddress from '@/components/customers/addresses/editAddresses';

    export default {
        components: {EditAddress},


        props:['customer', 'tab', 'subview'],

        data() {
            return {
                showDelivery:false,
                showInvoice:false,
            }
        },

        watch:{

        },

        methods: {

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