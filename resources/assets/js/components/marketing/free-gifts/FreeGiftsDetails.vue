<template>
    <div class="details-form">
        <div class="details-form__body">
            <div>
                <label>Free Gift Name</label>
                <input v-model="Name" name="Name" v-validate="'required'" type="text"/>
            </div>
            <span v-for="error in errors.collect('Name')" :key="error+'a'" class="error-message">{{ error }}</span>
            <div>
                <label>Free Gift Description</label>
                <input v-model="Description" name="Description" v-validate="'required'" type="text"/>
            </div>
            <span v-for="error in errors.collect('Description')" :key="error+'b'" class="error-message">{{ error }}</span>
            <div>
                <label>Free Gift DP Value</label>
                <input v-model="DP_Value" name="Free Gift DP Value" v-validate="'required|numeric'" type="text"/>
            </div>
            <span v-for="error in errors.collect('Free Gift DP Value')" :key="error+'c'" class="error-message">{{ error }}</span>
              <div>
                <label>Gift Number</label>
                <input v-model="Gift_number" name="Gift Number" v-validate="'required|alpha_num'" type="text"/>
            </div>
             <span v-for="error in errors.collect('Gift Number')" :key="error+'d'" class="error-message">{{ error }}</span>
             <div>
                <label>Image Title</label>
                <input v-model="title" name="Title" v-validate="'required'" type="text"/>
            </div>
             <span v-for="error in errors.collect('Title')" :key="error+'e'" class="error-message">{{ error }}</span>
             <div>
                <label>Image Alt Tag</label>
                <input v-model="alt_tag" name="Alt Tag" v-validate="'required'" type="text"/>
            </div>
            <span v-for="error in errors.collect('Alt Tag')" :key="error+'f'" class="error-message">{{ error }}</span>
        </div>
             <div class="brandImageSection__Buttons">
                  <label>Select An Image</label>
                  <input class="fileUpload" name="Image" ref="uploadgift" v-validate="'required'" @change="pickFiles($event, 'mainLogo')" type="file" accept="image/png, image/jpeg">
                  <div v-if="this.view === 'create-freegifts'">
                      <span v-for="error in errors.collect('Image')" :key="error+'g'" class="error-message">{{ error }}</span>
                  </div>
                </div>
                <div v-if="newImageTemp" style="margin-bottom: 20px;">
                    <img style="max-width:100px;"  :src="newImageTemp"/>
                </div>
        <div class="details-form__cta">
            <div class="details-form__cta">
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveFreeGift()">Save Free Gift</button>
            <button v-show="view == 'edit-freegifts'" class="btn btn-danger" @click="deleteFreeGift()">Delete Free Gift</button>
        </div>
    </div>
    </div>
</template>

<script>
    import {Datetime} from 'vue-datetime';
    import {freeGiftStore} from "@/stores";
    import {cdnStore} from "@/stores";
    import {event, endPoints} from '@/services';

    export default {
        components:{Datetime},

        props:['freeGift', 'view'],

        data(){
            return{
                Name: '',
                Description: '',
                DP_Value: '',
                Gift_number: '',
                alt_tag: '',
                title: '',
                Image: null,
                edit: false,
                errorResponse: null,
                newImageTemp: null,
                loadedImage: null
            }
        },

        watch:{
            view()
            {
                this.$validator.reset();
            },
            async freeGift() {
                this.$refs.uploadgift.value = null
                if (this.freeGift != null && this.view === 'edit-freegifts') {
                    if (this.freeGift[0].type === 'free-gifts') {
                        this.Name = this.freeGift[0].attributes.Name;
                        this.Description = this.freeGift[0].attributes.Description
                        this.DP_Value = this.freeGift[0].attributes.DP_Value
                        this.Gift_number = this.freeGift[0].attributes.Gift_number
                        this.title= this.freeGift[0].attributes.title
                        this.alt_tag = this.freeGift[0].attributes.alt_tag
                        this.newImageTemp = endPoints.cdnFile + this.freeGift[0].attributes.CDN_ID;
                    }
                }else{
                    this.Name = '';
                    this.Description = '';
                    this.DP_Value = '';
                    this.Gift_number = '';
                    this.title = '',
                    this.alt_tag = '',
                    this.newImageTemp = null

                }
            },

        },



        methods:{

            async deleteFreeGift() {
                    try{
                await freeGiftStore.deleteFreeGifts(this.freeGift[0]);
                    }catch(error){
                        console.log(error);
                    }
            },

            pickFiles(files, type){
                this.newImageTemp = URL.createObjectURL(files.target.files[0]);
                if(this.Image === null) {
                    this.Image = {
                        'attributes': {
                            'target': files.target.files[0],
                            'alt_tag': '',
                            'title': '',
                            'url':''
                        }
                    }
                    if(this.view === 'edit-freegifts') {
                        this.edit = true;
                    }

                }else{
                    this.Image.attributes.url = '';
                    this.Image.attributes.target = files.target.files[0];
                }
            },


           async saveFreeGift()
           {
               await this.$validator.validateAll();

            if(this.errors.has('Name') || this.errors.has('Description') || this.errors.has('Free Gift DP Value') || this.errors.has('Gift Number') || this.errors.has('Title') || this.errors.has('Alt Tag')) { 
                 return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
            }
               let data = {};

               if(this.view === 'create-freegifts'){

                if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }

                let fb = new FormData();
                    fb.append('file', this.Image.attributes.target);
                    let cdn = await cdnStore.uploadToCDN(fb)
                this.edit = false;
                   data = {
                       'data':{
                           'type':'free-gifts',
                           'attributes':{
                               'Name':this.Name,
                               'Description': this.Description,
                               'DP_Value': this.DP_Value,
                               'Gift_number': this.Gift_number,
                               'alt_tag': this.alt_tag,
                               'title': this.title,
                               'CDN_ID': cdn.filename
                           }
                       }
                   };

                   try{
                    await freeGiftStore.createFreeGift(data);
                   }catch(error){
                       console.log(error);
                   }

               }else if(this.view === 'edit-freegifts'){



                   data = {'data':this.freeGift[0]};

                   data.data.attributes.Name = this.Name;
                   data.data.attributes.Description = this.Description;
                   data.data.attributes.DP_Value = this.DP_Value;
                   data.data.attributes.Gift_number = this.Gift_number;
                   data.data.attributes.alt_tag = this.alt_tag;
                   data.data.attributes.title = this.title;
                   if(this.edit == true) {
                    let fb = new FormData();
                    fb.append('file', this.Image.attributes.target);
                    let cdn = await cdnStore.uploadToCDN(fb)
                       data.data.attributes.CDN_ID = cdn.filename;
                   }

                   try{
                       await freeGiftStore.updateFreeGifts(data);
                       this.edit = false;
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