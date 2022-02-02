<template>
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
                <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveFinder()">Save New Finder</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {finderStore} from '@/stores';

    export default {
        name: "expressFinderCreate",

        data(){
            return{
                finderTitle:''
            }
        },

        methods:{
            saveFinder(){

                let data = {
                    'data': {
                        'type': 'express-finder',
                        'attributes': {
                            'Name':this.finderTitle
                        }
                    }
                };

                finderStore.storeNewFinder(data);
            }
        }
    }
</script>

<style scoped>

</style>