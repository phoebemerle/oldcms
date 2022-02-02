<template>
    <div id="googleShoppingProfile">
        <h2>Google Shopping Profile</h2>
        <br>
        <div>
            <div class="googleShoppingProfileSections">
                <label for="profileTitle">Title</label>
                <input v-model="googleProfile.attributes.title" id="profileTitle" type="text"/>
            </div>
            <div class="googleShoppingProfileSections">
                <label for="profileProductType">Product Type</label>
                <input v-model="googleProfile.attributes.ProdType" id="profileProductType" type="text"/>
            </div>
            <div class="googleShoppingProfileSections">
                <label for="profileGoogleCatProd">Google Product Category</label>
                <input v-model="googleProfile.attributes.GoogleProdCat" id="profileGoogleCatProd" type="text"/>
            </div>
            <div class="googleShoppingProfileSections">
                <label for="profileDescription">Description</label>
                <tinymce :id="'profileDescription'" v-model="googleProfile.attributes.description" name="profileDescription"></tinymce>
            </div>
            <div class="googleShoppingProfileSections">
                <label for="profileLabel0">Custom Label 0</label>
                <input v-model="googleProfile.attributes.custom_label_0" id="profileLabel0" type="text"/>
            </div>
            <div class="googleShoppingProfileSections">
                <label for="profileLabel2">Custom Label 2</label>
                <input v-model="googleProfile.attributes.custom_label_2" id="profileLabel2" type="text"/>
            </div>
            <div class="googleShoppingProfileSections">
                <label for="profileLabel3">Custom Label 3</label>
                <input v-model="googleProfile.attributes.custom_label_3" id="profileLabel3" type="text"/>
            </div>
            <div class="googleShoppingProfileSections">
                <label for="profileLabel4">Custom Label 4</label>
                <input v-model="googleProfile.attributes.custom_label_4" id="profileLabel4" type="text"/>
            </div>
            <div class="googleShoppingProfileSections">
                <label for="profileActive">Active</label>
                <input v-model="googleProfile.attributes.active" id="profileActive" type="checkbox"/>
            </div>
            <div>
                <button @click="saveProfile()" class="btn btn-primary">Save</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {googleProfileStore} from "@/stores";
    import {event} from '@/services';
    import {http} from '@/services';

    export default {
        name: "googleProfileDetails",

        props:['stockitem'],

        data(){
            return{
                googleProfile:{
                    'type':'google-shopping-profile',
                    'attributes':{
                        'GoogleProdCat':'',
                        'ProdType':'',
                        'custom_label_0':'',
                        'custom_label_2':'',
                        'custom_label_3':'',
                        'custom_label_4':'',
                        'description':'',
                        'title':'',
                        'active':false,
                        'stockitem_id':null
                    },
                }
            }
        },

        watch:{
            stockitem() {
                if(this.stockitem.attributes) {
                    if(this.stockitem.attributes.googleshoppingprofile && this.stockitem.attributes.googleshoppingprofile.title != null) {
                        this.googleProfile.attributes = this.stockitem.attributes.googleshoppingprofile;
                    }
                }
            }
        },

        methods:{
            async saveProfile(){
                let data = http.createData(this.googleProfile);

                    try{
                        await googleProfileStore.updateProfile(data, this.stockitem.id);
                    }catch(error){
                        console.log(error)
                    }
            },

            resetProfile(){
                this.googleProfile= {
                    'type':'google_shopping_profile',
                        'attributes':{
                            'GoogleProdCat':'',
                            'ProdType':'',
                            'custom_label_0':'',
                            'custom_label_2':'',
                            'custom_label_3':'',
                            'custom_label_4':'',
                            'description':'',
                            'title':'',
                            'active':false
                    },
                }
            },

            async deleteProfile(){
                try{
                    await googleProfileStore.deleteProfile(this.profile.id);
                    event.emit(event.names.UPDATE_SHOPPING_PROFILES, this.googleProfile, 'Remove Profile');
                    this.resetProfile()
                }catch(error){
                    console.log(error);
                }



            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    #googleShoppingProfile{
        padding:10px;

        h2{
            margin-bottom:10px;
        }

        button{
            font-size:14px;
        }

        &_noProfile{
            font-size:13px;
            color:red;
        }


        .googleShoppingProfileSections{
            font-size:14px;
            margin:5px 0;
            font-weight:bold;

            input, tinymce{
                border:1px solid #c9c9c9;
                width:400px
            }

            label{
                width:150px;
                vertical-align:top;
            }

        }
    }

</style>