<template>
    <div class="details-form">
        <div class="details-form__body">
            <div>
                <label>Description</label>
                <input v-model="d.attributes.Desc1" name="desc1" v-validate="'required'" type="text"/>
            </div>
            <span v-for="error in errors.collect('desc1')" :key="error+'a'" class="error-message">{{ error }}</span>
            <div>
                <label>Item Number</label>
                <input v-model="d.attributes.ItemNum" name="itemno" v-validate="'required'" type="text"/>
            </div>
            <span v-for="error in errors.collect('itemno')" :key="error+'b'" class="error-message">{{ error }}</span>
            <div>
                <label>Spend  Amount (Data Points)</label>
                <input type="number" v-model="d.attributes.SpendAmount" name="spendamount" v-validate="'required|numeric'"/>
            </div>
            <span v-for="error in errors.collect('spendamount')" :key="error+'c'" class="error-message">{{ error }}</span>
        <div class="details-form__cta">
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveDonation()">Save Donation</button>
            <button v-show="view == 'edit-donation'" class="btn btn-danger" @click="deleteDonation()">Delete Donation</button>
        </div>
    </div>
    </div>
</template>

<script>
    import {donationStore, sharedStore} from '@/stores';
    import {event} from '@/services';

    export default {

        props:['donation', 'view'],

        data(){
            return{
                d: {
                    type: 'donations',
                    attributes: {}
                },
            }
        },

        watch:{
            donation()
            {
                if(this.donation && this.view === 'edit-donation') {
                    this.d = this.donation[0]
                } else {
                    this.d.attributes = {}
                }
            },
            view()
            {
                this.$validator.reset();
            },
        },



        methods:{

            async deleteDonation() {
                sharedStore.showLandingPage();
                await donationStore.deleteDonation(this.donation[0]);                    
            },

           async saveDonation()
           {
            await this.$validator.validateAll();

            if(this.$validator.errors.any()) {
                 return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
            }
            
            sharedStore.showLandingPage();
            let data = {data:this.d};

            if(this.view === 'create-donation'){

                data = {data: this.d};

                try{
                await donationStore.createDonation(data);
                }catch(error){
                    console.log(error);
                }

            }else if(this.view === 'edit-donation'){

                try{
                    console.log(data)
                    await donationStore.updateDonation(data);
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

    .details-form__body label{
        min-width:150px;
    }


</style>