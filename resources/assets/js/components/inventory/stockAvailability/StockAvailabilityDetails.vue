<template>
    <div class="details-form">
        <div class="details-form__body">
            <div>
                <label>Stock Availability:</label>
                <input v-model="stockAvailabilityData.attributes.availability" name="availability" v-validate="'required'" type="text"/>
            </div>
            <span v-for="(error, index) in errors.collect('availability')" :key="index" class="error-message">{{ error }}</span>
        </div>
        <div class="details-form__cta">
            <div class="details-form__cta">
                <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveStockAvailability()">Save</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {Datetime} from 'vue-datetime';
    import {stockAvailabilityStore} from "@/stores";
    import {event, http} from '@/services';
    import stub from '@/stubs/stockAvailability';

    export default {
        components:{Datetime},

        props:['stockAvailability', 'view'],

        data(){
            return{
                stockAvailabilityData: stub,
            }
        },

        watch:{
            view()
            {
                this.$validator.reset();
                if(this.view === 'stock-availability-edit') {
                    this.stockAvailabilityData = this.stockAvailability;
                }else if(this.view === 'stock-availability-create') {
                    this.stockAvailabilityData = stub
                }
            },

        },



        methods:{
           async saveStockAvailability()
           {
               await this.$validator.validateAll();

                if(this.$validator.errors.any()) { 
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
                }
               let data = http.createData(this.stockAvailabilityData);;

               if(this.view === 'stock-availability-create'){

                   try{
                    await stockAvailabilityStore.create(data)
                   }catch(error){
                       console.log(error);
                   }

               }else if(this.view === 'stock-availability-edit'){

                   try{
                    await stockAvailabilityStore.update(data, data.data.id)
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