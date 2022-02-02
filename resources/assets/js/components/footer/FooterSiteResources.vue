<template>
    <div class="details-form">
        <div class="details-form__body" >
            <div>
                <h2>Footer Site Resource</h2>
            </div>
            <!--<draggable @change="setNewFeatureOrder()">-->
                <div class="siteResourcesSection" v-for="(resourceData, index) in siteResourceData" :key="index">
                    <div class="siteResourcesNameContainer inlineFormElements">
                        <label for="siteResourcesName">Name: </label>
                        <input :id="'siteResourcesName_'+index" class="smallerInput" v-model='resourceData.attributes.name' type="text" title="Site Resource Name" :name="'siteResourceName_'+index" data-vv-as="Site Resource Name" v-validate="'required'" placeholder="Please enter the link name" >
                        <br> 
                        <span class="error-message" >{{errors.first('siteResourceName_'+index)}}</span>
                    </div>

                    <div class="siteResourceOrderContainer inlineFormElements">
                        <label for="siteResourceOrder">Website Order: </label>
                        <input :id="'siteResourceOrder_'+index" class="inputOrderBox" v-model='resourceData.attributes.order' type="text" title="Order for link" :name="'siteResourceOrder_'+index" data-vv-as="Order for link" v-validate="'required|numeric'" placeholder="Please enter the order">
                        <br>
                        <span class="error-message" >{{errors.first('siteResourceOrder_'+index)}}</span>

                    </div>
                 
                    <div class="siteResourceLinkContainer inlineFormElements">
                        <label for="siteResourceURL">URL: </label>
                        <input :id="'siteResourceURL_'+index" class="smallerInput" v-model='resourceData.attributes.url' type="url" title="Resource URL" :name="'siteResourceURL_'+index" data-vv-as="Resource URL" v-validate="'required'" placeholder="Please enter the URL">
                        <br>
                        <span class="error-message" >{{errors.first('siteResourceURL_'+index)}}</span>
                    </div>
                   

                    <button class="btn btn-primary" :disabled="$validator.errors.has('siteResourceName_'+index) || $validator.errors.has('siteResourceOrder_'+index) || $validator.errors.has('siteResourceURL_'+index)" @click="updateFooterResource(index)">Update Resource</button>
                    <hr>
                </div>
            <!--</draggable>-->
            <div>
                <button @click="addNewResource()">Add New Resource</button>
            </div>

        </div>
    </div>
</template> 

<script>
    import {event} from '@/services';
    import {http} from '@/services';
    import {footerContactInfoStore} from '@/stores';
    import draggable from 'vuedraggable';

    export default {
        name: "FooterSiteResources",

        props:['footersiteresources', 'tab'],

        components:{draggable},

        data(){
            return{
                siteResourceData: []
            }
        },

        watch:{
            footersiteresources(){
                this.siteResourceData = this.footersiteresources;
            },
            tab() {
                this.$validator.reset();
            }
        },

        methods:{
            async updateFooterResource(key){
               await this.$validator.validateAll();
               if(this.$validator.errors.has('siteResourceName_'+key) || this.$validator.errors.has('siteResourceOrder_'+key) || this.$validator.errors.has('siteResourceURL_'+key)) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
                let data = http.createData(this.siteResourceData[key]);

                if(data.data.id){
                    footerContactInfoStore.updateSiteResource(data, this.siteResourceData[key].id);
                }else{
                    footerContactInfoStore.addNewSiteResource(data, key);
                }

            },

            addNewResource(){
                if(this.siteResourceData.length <= 9) {
                    let newData = {
                        'attributes': {
                            'name': '',
                            'order': this.siteResourceData.length + 1,
                            'url': ''
                        },
                        'type': 'footersiteresources'
                    };

                    this.siteResourceData.push(newData);
                }else{
                    event.emit(event.names.USER_MESSAGE, 'You are only allowed a maximum of 8 resources. Please edit an existing resource', 'error');
                }
            },

            // setNewFeatureOrder(){
            //     for(let y = 0; y < this.siteResourceData.length; y++){
            //         let oldOrder = this.siteResourceData[y].attributes.order;
            //         let newOrder = y+1;
            //         this.siteResourceData[y].attributes.order = newOrder;
            //
            //         if (oldOrder !== newOrder) {
            //             this.addToChangedArray(this.siteResourceData[y]);
            //         }
            //
            //     }
            // }
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