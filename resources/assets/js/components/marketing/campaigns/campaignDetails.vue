<template>
    <div class="details-form">
        <div class="details-form__body">
            <div>
                <label>Campaign Title</label>
                <input v-model="campaignTitle" name="campaignTitle" data-vv-as="Title" v-validate="'required'" type="text"/>
            </div>
            <span class="error-message" v-for="error in errors.collect('campaignTitle')" :key="error+'a'">{{error}}</span>
            <div>
                <label>Start Date</label>
                <datetime id="startDate" v-model="campaignStartDate" type="datetime"></datetime>
            </div>
            <div>
                <label>End Date</label>
                <datetime id="endDate" v-model="campaignEndDate" type="datetime"></datetime>
            </div>
        </div>
        <div class="details-form__cta">
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveCampaign()">Save Campaign</button>
        </div>
    </div>
</template>

<script>
    // import { Datetime } from 'vue-datetime';
    import {campaignStore} from '@/stores';
    import {event} from '@/services';

    export default {
        // components:{Datetime},

        props:['campaign', 'view'],

        data(){
            return{
                campaignTitle:'',
                campaignStartDate:'',
                campaignEndDate:'',
                promotions:[],

            }
        },
        
        watch:{
            campaign() {
                if (this.campaign != null) {
                    if (this.campaign.type === 'campaigns') {
                        this.campaignTitle = this.campaign.attributes.title;

                        let startDate = new Date(this.campaign.attributes.start_date);
                        let endDate = new Date(this.campaign.attributes.end_date);

                        this.campaignStartDate = startDate.toISOString();
                        this.campaignEndDate = endDate.toISOString();
                    }
                }else{
                    this.campaignTitle = '';
                    this.campaignStartDate = null;
                    this.campaignEndDate=null;
                    this.promotions=[];

                }
            },
            view()
            {
                this.$validator.reset();
            }

        },

        methods:{
           async saveCampaign(){
               await this.$validator.validateAll();
               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }
               let data = {};
               let startDate = this.campaignStartDate.replace('Z', '').replace('T', ' ').replace('.000', '');
               let endDate = this.campaignEndDate.replace('Z', '').replace('T', ' ').replace('.000', '');

               if(this.view === 'create-campaign'){
                   data = {
                       'data':{
                           'type':'campaigns',
                           'attributes':{
                               'title':this.campaignTitle,
                               'start_date': startDate,
                               'end_date': endDate
                           }
                       }
                   };

                   try{
                       await campaignStore.createCampaign(data);

                   }catch(error){
                       console.log(error);
                   }

               }else if(this.view === 'edit-campaign'){

                   data = {'data':this.campaign};

                   data.data.attributes.title = this.campaignTitle;
                   data.data.attributes.start_date = startDate;
                   data.data.attributes.end_date = endDate;

                   try{
                       await campaignStore.updateCampaign(data);
                   }catch(error){
                       console.log(error);
                   }
               }

            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    .vdatetime{
        width: 20%;
    }

</style>