<template>
    <div class="details-form">
        <div class="details-form__body">
            <div>
                <label>Sage Short Description</label>
                <br>
                <input v-model="sageinfo.sage_desc" name="shortdesc" data-vv-as="Short Description" v-validate="'required|max:60'" type="text"/>
            </div>
            <span v-for="(error, index) in errors.collect('shortdesc')" :key="index" class="error-message">{{ error }}</span>
            <div>
                <label for="catDescArea">Sage Long Description</label>
                <br> 
                <tinymce :id="'longdesc'" v-model="sageinfo.sage_longdesc" data-vv-as="Long Description" name="longdesc" v-validate="'required|max:255'"></tinymce>
            </div>
            <span v-for="(error, index) in errors.collect('longdesc')" :key="index" class="error-message">{{ error }}</span>
        </div>
        <div class="details-form__cta">
            <div class="details-form__cta">
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="save()">Save Sage Info</button>
        </div>
    </div>
    </div>
</template>

<script>
    import {event, http} from '@/services';
    import {sageInfoStore} from '@/stores';

    export default {

        props:['stockitem', 'view'],

        data(){
            return{
                sageinfo:[]
            }
        },


        watch: {
            view()
            {
                this.$validator.reset();
            },

            stockitem()
            {
                if(this.stockitem.attributes && this.stockitem.type === 'stockitems') {
                    this.sageinfo = this.stockitem.attributes.sage_info;
                } else {
                    this.sageinfo = []
                }
            }
        },

        methods:{

           async save()
           {
            await this.$validator.validateAll();

            if(this.$validator.errors.any()) { 
                return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
            } else {
                let data = {
                   data: {
                       type: 'sage-info',
                        attributes: {
                            stockitem_id: this.stockitem.id,
                            sage_desc: this.sageinfo.sage_desc,
                            sage_longdesc: this.sageinfo.sage_longdesc
                        }
                   }
                }

                sageInfoStore.create(data)
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