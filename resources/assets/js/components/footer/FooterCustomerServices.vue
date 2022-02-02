<template>
    <div class="details-form">
        <div class="details-form__body" >
            <div>
                <h2>Footer Customer Services</h2>
            </div>
            <div v-for="(data, index) in customerServiceData" :key="index">
                <div id="customerServiceNameContainer"  class="inlineFormElements">
                    <label for="customerServiceName">Name: </label>
                    <input :id="'customerServiceName_'+index" class="smallerInput" v-model="data.attributes.name" type="text" title="Customer Service Name" data-vv-as="Customer Service Name" :name="'customerServiceName_'+index" placeholder="Please enter the link name" v-validate="'required'">
                    <br> 
                    <span v-if="errors.has('customerServiceName_'+index)" class="error-message" >{{errors.first('customerServiceName_'+index)}}</span>
                </div>

                <div id="customerServiceOrderContainer" class="inlineFormElements">
                    <label for="customerServiceOrder">Website Order: </label>
                    <input :id="'customerServiceOrder_'+index"  class="inputOrderBox" v-model="data.attributes.order" type="number" title="Order for link" data-vv-as="Order for link" :name="'customerServiceOrder_'+index" placeholder="Please enter the order" v-validate="'required|numeric'">
                    <br> 
                    <span v-if="errors.has('customerServiceOrder_'+index)"  class="error-message" >{{errors.first('customerServiceOrder_'+index)}}</span>
                </div>

                <div id="customerServiceLinkContainer" class="inlineFormElements">
                    <label for="customerServiceURL">URL: </label>
                    <input :id="'customerServiceURL_'+index" class="smallerInput" v-model="data.attributes.url" type="url" title="Service URL" data-vv-as="Service URL" :name="'customerServiceURL_'+index" placeholder="Please enter the URL" v-validate="'required'">
                    <br> 
                    <span v-if="errors.has('customerServiceURL_'+index)" class="error-message" >{{errors.first('customerServiceURL_'+index)}}</span>
                </div>
                <button class="btn btn-primary" :disabled="$validator.errors.has('customerServiceOrder_'+index) || $validator.errors.has('customerServiceOrder_'+index) || $validator.errors.has('customerServiceURL_'+index)" @click="updateLinks(index)">Update Links</button>
                <hr>
            </div>
            <div>
                <button @click="addNewLink()">Add New Link</button>
            </div>
        </div>
    </div>
</template> 

<script>
    import {event} from '@/services';
    import {http} from '@/services';
    import {footerContactInfoStore} from '@/stores';


    export default {
        name: "FooterCustomerServices",

        components: {},

        props:['footercustomerservices', 'tab'],

        data(){
            return{
                customerServiceData: []
            }
        },

        watch:{
            footercustomerservices(){
                this.customerServiceData = this.footercustomerservices;
            },
            tab() {
                this.$validator.reset();
            }
        },

        methods:{
            async updateLinks(key){

               await this.$validator.validateAll();
               if(this.$validator.errors.has('customerServiceName_'+key) || this.$validator.errors.has('customerServiceOrder_'+key) || this.$validator.errors.has('customerServiceURL_'+key)) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
                let data = http.createData(this.customerServiceData[key]);

                if(data.data.id) {
                    footerContactInfoStore.updateCustomerServiceLinks(data, data.data.id);
                }else{
                    footerContactInfoStore.storeCustomerServiceLinks(data, key);
                }
            },

            addNewLink(){
                if(this.customerServiceData.length <= 9) {
                    let newData = {
                        'attributes': {
                            'name': '',
                            'order': this.customerServiceData.length + 1,
                            'url': ''
                        },
                        'type': 'footercustomerservice'
                    };

                    this.customerServiceData.push(newData);
                }else{
                    event.emit(event.names.USER_MESSAGE, 'You are only allowed a maximum of 8 Links. Please edit an existing resource', 'error');
                }
            }
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

    .form-row {
        float:left;
        padding:10px;
    }

    div.container {
        display: flex;
    }

</style>