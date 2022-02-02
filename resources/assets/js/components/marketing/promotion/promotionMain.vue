<template>
    <div>
        <a href="javascript:history.go(-1)"><button class="btn btn-primary">Back to campaign info</button></a>
        <div class="main-sections__editForm" v-show="promotion">
            <div class="overviewTabs">
                <ul class="list-inline" style="margin-bottom:0;">
                    <li v-bind:class="{ activeTab: tab === 'promotion' }" @click="changeTab('promotion')">Promotion Overview</li>
                    <li v-bind:class="{ activeTab: tab === 'targets' }" @click="changeTab('targets')">Promotion Targets</li>
                </ul>
            </div>
            <div class="main-sections__editForm__container">
                <promotion-details v-show="tab === 'promotion'" :promotion="promotion" :targets="targets"/>
                <promotion-targets v-show="tab === 'targets'" :promotion="promotion" :targets="targets"/>
            </div>
        </div>
        <div v-show="!promotion">
            <h3>
                You cannot add Targets before you save the promotion. <a href="#" style="color:#2b45ff" onclick="history.go(-1)">Please click here to go back and save the promotion first.</a>
            </h3>
        </div>
    </div>
</template>

<script>
    import {promotionsStore} from "@/stores";
    import {promotionTargetStore} from "@/stores";
    import {event} from '@/services';
    import PromotionDetails from '@/components/marketing/promotion/PromotionDetails';
    import PromotionTargets from '@/components/marketing/promotion/PromotionTargets';

    export default {
        name: "promotionMain",

        components:{PromotionDetails, PromotionTargets},

        props:['promotion'],

        data(){
            return {
                tab:'promotion',
                targets:[],
                view:''
            }
        },

        watch:{
            promotion(){
                if(this.promotion && this.promotion.type === 'promotions') {
                    if (this.promotion.relationships.promotion_targets.data.length > 0) {
                        this.getPromotionTarget();
                    }
                }
            },
            view()
            {
                if(this.targets.length > 0) {
                    this.getPromotionTarget()
                }
            }
        },

        created(){
            event.on(event.names.UPDATE_NAVIGATION_VIEW, (view) => {
                this.view = view;
            })

            event.on(event.names.UPDATE_SELECTED, (selectedTargets, type) =>{
                if(type === 'promotionTarget') {

                    let attached = false;
                    for (let a = 0; a < this.targets.length; a++) {

                        if ((this.targets[a].attributes.target_id.toString() === selectedTargets.id.toString()) && (this.targets[a].attributes.target_type.toString() === selectedTargets.type.toString())) {
                            attached = true;
                        }
                    }

                    if (attached) {
                        event.emit(event.names.USER_MESSAGE,'This target is already attached', 'error');
                    } else {
                        let data = {
                            'data': {
                                'type': 'promotion-targets',
                                'attributes': {
                                    'promotion_id': this.promotion.id,
                                    'target_type': selectedTargets.type,
                                    'target_id': selectedTargets.id
                                }
                            }
                        };
                        this.addTarget(data, selectedTargets);
                    }
                } else if(type === 'productGroupTarget') {
                    let attached = false;
                    for (let a = 0; a < this.targets.length; a++) {

                        if ((this.targets[a].attributes.target_id.toString() === selectedTargets.id.toString()) && (this.targets[a].attributes.target_type.toString() === selectedTargets.type.toString())) {
                            attached = true;
                        }
                    }

                    if (attached) {
                        event.emit(event.names.USER_MESSAGE,'This target is already attached', 'error');
                    } else {
                        let data = {
                            'data': {
                                'type': 'promotion-targets',
                                'attributes': {
                                    'promotion_id': this.promotion.id,
                                    'target_type': selectedTargets.type,
                                    'target_id': selectedTargets.id
                                }
                            }
                        };
                        this.addTarget(data, selectedTargets);
                    }
                }
            });

            event.on(event.names.REMOVE_TARGET, (target) =>{
                this.removeTarget(target.id);
            });
        },

        methods:{
            changeTab(tab){
                this.tab = tab;
            },

            async addTarget(data, targetInfo){
                let savedData = await promotionTargetStore.saveTargets(data);
                if(targetInfo.type === 'stockitems'){
                    savedData = this.setStockTargetInfo(savedData, targetInfo);
                }else if(targetInfo.type === 'products'){
                    savedData = this.setProductTargetInfo(savedData, targetInfo);
                }else if(targetInfo.type === 'category'){
                    savedData = this.setCatTargetInfo(savedData, targetInfo);
                }
                else if(targetInfo.type === 'brands'){
                    savedData = this.setBrandInfo(savedData, targetInfo);
                }
                else if(targetInfo.type === 'productgroup'){
                    savedData = this.setBrandInfo(savedData, targetInfo);
                }

                this.targets.push(savedData);

            },

            setStockTargetInfo(savedData, targetInfo){

                savedData.attributes.description = targetInfo.attributes.description
                savedData.attributes.coupon = targetInfo.attributes.code

                return savedData;
            },

            setProductTargetInfo(savedData, targetInfo){
                savedData.attributes.details = {
                    'title':targetInfo.attributes.title,
                    'short_desc': targetInfo.attributes.short_desc,
                    'overview':targetInfo.attributes.long_desc,

                };

                return savedData;
            },

            setCatTargetInfo(savedData, targetInfo){
                savedData.attributes.details = {
                    'title':targetInfo.attributes.title,
                    'contain':targetInfo.attributes.attached_type,

                };

                return savedData;
            },

            setBrandInfo(savedData, targetInfo){
                savedData.attributes.details = {
                    'name':targetInfo.attributes.name,
                };

                return savedData;
            },

            async getPromotionTarget()
                {
                    this.targets = await promotionTargetStore.checkTargets(this.promotion.id);
                },

            async removeTarget(id){
                try{
                    await promotionTargetStore.removeTarget(id);

                    for(let a = 0; a < this.targets.length; a++){
                        if(this.targets[a].id.toString() === id.toString()){
                            this.targets.splice(a, 1);
                        }
                    }

                }catch(error){
                    console.log(error);
                }
            }
        }
    }
</script>


<style lang="scss">
    @import "~#/variables";



</style>