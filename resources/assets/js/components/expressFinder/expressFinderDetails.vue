<template>
    <div>
        <div class="details-form">
            <div class="details-form__body form-sections" >
                <div>
                    <h2>Express Finder Details</h2>
                </div>
                <div id="productTitleContainer">
                    <label for="finderTitle">Finder Title: </label>
                    <input id="finderTitle" v-model="finderTitle" type="text" title="Finder Title" name="finderTitle" placeholder="Please Enter a Finder Title" data-vv-as="Title" v-validate="'required'">
                </div>
                <div class="details-form__cta">
                    <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="editFinderTitle()">Update Finder Name</button>
                </div>
            </div>
        </div>

        <div class="details-form">
            <div class="details-form__body form-sections" >
                <div>
                    <h2>Attached Headers</h2>
                </div>
                <div>
                    <express-finder-headers :headers="headers" :finder="finder"></express-finder-headers>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {finderStore} from '@/stores';
    import ExpressFinderHeaders from "./expressFinderHeaders";

    export default {
        name: "expressFinderDetails",
        components: {ExpressFinderHeaders},
        props:['finder'],

        data(){
            return{
                finderTitle:this.finder.attributes.Name,
                headers:[]
            }
        },

        created(){
            this.getHeaders();
        },

        methods:{
            editFinderTitle(){

                let data = {
                    'data': {
                        'type': 'express-finder',
                        'id':this.finder.id,
                        'attributes': {
                            'Name':this.finderTitle
                        }
                    }
                };

                finderStore.editFinderTitle(data, this.finder.id);
            },

            async getHeaders(){
                this.headers = await finderStore.getAllHeaders();
            }
        },

    }
</script>

<style scoped>

</style>