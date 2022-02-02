<template>
<div class="main-sections__editForm__container">
    <div class="details-form">
        <div class="details-form__body form-sections">
            <div>
                <h3>Delivery Type Details:</h3>
            </div>

            <div id="deliveryDescriptionSection">
                <label for="deliveryDescription">Delivery Description: </label>
                <input id="deliveryDescription" v-model="delivery.attributes.description" type="text" v-validate="'required'" title="Delivery Type Description" data-vv-as="Delivery Description" name="deliveryTypeDescription" placeholder="Please enter the delivery description">
            </div>
            <span class="error-message" v-for="(error, index) in errors.collect('deliveryTypeDescription')" :key="index+'a'">{{error}}</span>

            <div id="deliveryLongDescriptionSection">
                <label for="deliveryLongDescription">Long Description: </label>
                <textarea id="deliveryLongDescription" v-model="delivery.attributes.longdesc" title="Delivery Type Description" v-validate="'required'" data-vv-as="Long Description" name="deliveryDescription" placeholder="Please enter the delivery description"></textarea>
            </div>
            <span class="error-message" v-for="(error, index) in errors.collect('deliveryDescription')" :key="index+'b'">{{error}}</span>

            <div id="deliveryPriceSection1">
                <label for="deliveryPrice1">Band 1 Price: </label>
                <input id="deliveryPrice1" v-model="delivery.attributes.price1" type="number" title="Delivery Type Price 1" name="deliveryPrice1" data-vv-as="Price 1" v-validate="'required|decimal'" placeholder="Please enter the band price">
            </div>
            <span class="error-message" v-for="(error, index) in errors.collect('deliveryPrice1')" :key="index+'c'">{{error}}</span>

            <div id="deliveryPriceSection2">
                <label for="deliveryPrice2">Band 2 Price: </label>
                <input id="deliveryPrice2" v-model="delivery.attributes.price2" type="number" title="Delivery Type Price 2" name="deliveryPrice2" data-vv-as="Price 2" v-validate="'required|decimal'" placeholder="Please enter the band price">
            </div>
            <span class="error-message" v-for="(error, index) in errors.collect('deliveryPrice2')" :key="index+'d'">{{error}}</span>

            <div id="deliveryPriceSection3">
                <label for="deliveryPrice3">Band 3 Price: </label>
                <input id="deliveryPrice3" v-model="delivery.attributes.price3" type="number" title="Delivery Type Price 3" name="deliveryPrice3" data-vv-as="Price 3" v-validate="'required|decimal'" placeholder="Please enter the band price">
            </div>
            <span class="error-message" v-for="(error, index) in errors.collect('deliveryPrice3')" :key="index+'e'">{{error}}</span>

            <div id="deliveryPriceSection4">
                <label for="deliveryPrice4">Band 4 Price: </label>
                <input id="deliveryPrice4" v-model="delivery.attributes.price4" type="number" title="Delivery Type Price 4" name="deliveryPrice4" data-vv-as="Price 4" v-validate="'required|decimal'" placeholder="Please enter the band price">
            </div>
            <span class="error-message" v-for="(error, index) in errors.collect('deliveryPrice4')" :key="index+'f'">{{error}}</span>

            <div id="deliveryDeliveryCodeSection">
                <label for="deliveryDeliveryCode">Delivery Code: </label>
                <input id="deliveryDeliveryCode" v-model="delivery.attributes.delivery_code" type="text" title="Delivery Type Code" v-validate="'required'" data-vv-as="Delivery Code" name="deliveryDeliveryCode" placeholder="Please enter the delivery code">
            </div>
            <span class="error-message" v-for="(error, index) in errors.collect('deliveryDeliveryCode')" :key="index+'g'">{{error}}</span>

            <div>
                <label>Days Of Delivery</label>
                <select v-model="delivery.attributes.day_name" name="daysOfDelivery" data-vv-as="Days of Delivery" v-validate="'required|included:0,WEEKDAY,WEEKEND'">
                    <option value="0" disabled>Please Select</option>
                    <option value="WEEKDAY">Weekdays</option>
                    <option value="WEEKEND">Weekends</option>
                </select>
            </div>
            <span class="error-message" v-for="(error, index) in errors.collect('daysOfDelivery')" :key="index+'h'">{{error}}</span>

            <div id="deliveryOverseasSection">
                <label for="deliveryLocation">Location: </label>
                <select v-model="location_id" name="deliveryLocation" data-vv-as="Delivery Location" v-validate="'required'">
                    <option value="0">Please Select a Location</option>
                    <option v-for="(location, index) in locations" :value="location.id" :key="index">{{location.attributes.name}}</option>
                </select>
            </div>
            <span class="error-message" v-for="(error, index) in errors.collect('deliveryLocation')" :key="index+'i'">{{error}}</span>

            <div id="deliveryActiveStatus1">
                <label for="deliveryActiveStatus">Active: </label>
                <input id="deliveryActiveStatus" name="deliveryActiveStatus" data-vv-as="Active Status" v-model="delivery.attributes.active" type="checkbox">
            </div>
            <span class="error-message" v-for="(error, index) in errors.collect('deliveryActiveStatus')" :key="index+'j'">{{error}}</span>

            <div id="deliveryPrioritySection">
                <label for="deliveryPriority">Priority: </label>
                <input id="deliveryPriority" name="deliveryPriority" data-vv-as="Priority" v-model="delivery.attributes.priority" type="number">
            </div>
            <span class="error-message" v-for="(error, index) in errors.collect('deliveryPriority')" :key="index+'k'">{{error}}</span>

            <br>
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveDeliveryInfo()">Save Delivery Info</button>

        </div>
    </div>
           
</div>
</template>

<script>

    import {event} from '@/services';
    import {http} from '@/services';
    import {deliveryTypeStore} from '@/stores';
    import deliveryStub from '@/stubs/deliverytype';

    export default {
        name: "DeliveryTypeDetails",

        props: ['deliverytype', 'subview', 'locations'],

        data() {
            return {
                delivery:deliveryStub,
                location_id: ''
            }
        },


        watch: {
            subview() {
                this.$validator.reset();
                if ((this.subview === 'edit-delivery-type') && (this.deliverytype.type === "deliverytype")) {
                    this.delivery = this.deliverytype;
                    this.location_id = this.deliverytype.attributes.location.id;
                    // this.formatPrice(this.delivery, 'edit');
                } else {
                    this.delivery = deliveryStub;
                    
                }
            }
        },

        methods: {

            async saveDeliveryInfo() {

                await this.$validator.validateAll();
                if(this.$validator.errors.any()) {
                        return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                }

                this.delivery.attributes.location = this.location_id;

                let data = http.createData(this.delivery);

                if (this.subview === 'edit-delivery-type') {
                    try {
                        await deliveryTypeStore.update(data, this.deliverytype.id);
                    } catch (error) {
                        console.log(error);
                        event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error')
                    }
                }else if (this.subview === 'create-delivery-type') {
                    try {
                        await deliveryTypeStore.create(data);
                    } catch (error) {
                        console.log(error);
                        event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error')
                    }
                }
            },

        }
    }

</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>