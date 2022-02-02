<template>
    <div style="border: 1px solid #c9c9c9; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
        <div class="attached_container" id="homePageBrandsSection">
            <h3>Attached brands</h3>
            <table class="table table-hover attachedTable homePageBrands">
                <tr>
                    <td class="homePageBrands__name">Name</td>
                    <td class="homePageBrands__view">View</td>
                    <td class="homePageBrands__remove">Remove</td>
                </tr>
                <tr v-if="attachedTargets.length < 1" class="noAttachmentsFound">
                    <td colspan="4">
                        <span>No Brands Have Been Attached Yet</span>
                    </td>
                </tr>
                <tr v-show="attachedTargets.length > 0" v-for="(target, key) in attachedTargets" :key="key">
                    <td class="homePageBrands__name">{{target.attributes.name}}</td>
                    <a :href="'/#!/brands/edit/'+target.attributes.brand_id">
                        <td class="homePageBrands__view attachedTableView"><i class="fas fa-eye"></i></td>
                    </a>
                    <td class="homePageBrands__remove attachedTableRemove" @click="removeTarget(key)"></td>
                </tr>
            </table>
        </div>
        <brand-search type="featuredBrands" :attachedTargets="attachedTargets"/>
    </div>
</template>

<script>
    import BrandSearch from '@/components/brands/BrandSearch';
    import brandStub from '@/stubs/brandInfo';
    import {brandsStore} from '@/stores';
    import {homePageStore} from '@/stores';
    import {event} from '@/services';
    import {http} from '@/services';

    export default {
        name: "featuredBrands",

        components: {BrandSearch},

        props:['featuredBrands'],

        data(){
            return{
                attachedTargets:[]
            }
        },

        methods:{

            async saveNewFeaturedBrand(brand){
                let brandConfig = await brandsStore.getBrandConfig(brand.id);

                if(!brandConfig){
                    this.createBrandConfig(brand)
                }else{
                    this.updateConfig(brand, brandConfig);
                }

            },

            async createBrandConfig(brand){
                let data = http.createData(brandStub);

                data.data.attributes.brand_id = brand.id.toString();
                data.data.attributes.featured = 1;

                delete data.data.id;

                let newConfig = await brandsStore.saveNewBrandConfig(data);

                newConfig.attributes.name = brand.attributes.name;

                this.attachedTargets.push(newConfig);
            },

            async updateConfig(brand, config){
                let data = http.createData(config);

                config.attributes.featured = 1;

                let newConfig = await brandsStore.updateBrandConfig(data, config.id);

                newConfig.attributes.name = brand.attributes.name;

                this.attachedTargets.push(newConfig);
            },

            async removeTarget(key){
                let data = http.createData(this.attachedTargets[key]);

                data.data.attributes.featured  = 0;

                await brandsStore.updateBrandConfig(data, this.attachedTargets[key].id);

                this.attachedTargets.splice(key, 1);
            },

            checkBrands(selected){
                let found = false;
                for(let x = 0 ; x < this.attachedTargets.length; x++){
                    if(selected.id.toString() === this.attachedTargets[x].attributes.brand_id){
                        found = true;
                        break;
                    }
                }

                return found;
            }

        },

        mounted(){
            event.on(event.names.ADD_FEATURED, (feature, type) =>{
                if(type === 'fBrands') {
                    let found = this.checkBrands(feature);
                    if(!found) {
                        this.saveNewFeaturedBrand(feature);
                    }else{
                        event.emit(event.names.USER_MESSAGE, 'Brand could not be added because it is already a featured brand', 'error');
                    }
                }
            });
        },

        watch:{
            featuredBrands() {
                this.attachedTargets = this.featuredBrands;
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    .homePageBrands{

        table{
            width:100%;
        }

        &__name{
            width:60%;
        }

        &__view{
            width:20%;
        }

        &__remove{
            width:10%;
        }

    }

</style>