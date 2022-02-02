<template>
    <div>
        <h3>Exclusions Locations</h3>
        <div v-for='(location, index) in activeLocations'>
            <label>{{location.attributes.name}}</label>
            <input v-model="location.attributes.active" @change="statusChange(index)" type="checkbox"/>
        </div>
        <div class="btn btn-primary" @click="updateExclusions()">Update Exclusions</div>
    </div>
</template>

<script>
    import {deliveryTypeStore} from "../../../stores";

    export default {
        name: "DeliveryExclusionZones",

        props:['delivery', 'locations'],

        data(){
            return{
                activeLocations:[],
                toBeChanged:{
                    'save':[],
                    'remove':[]
                }
            }
        },

        watch:{
            delivery(){
                if(this.delivery.length >0) {
                    this.sortLocations();
                }
          }
        },

        methods:{
            sortLocations(){
                this.activeLocations = this.locations;
                if(this.activeLocations.length > 0 && this.delivery[0].type === "deliverytype"){
                    for(let x = 0; x < this.activeLocations.length; x++){
                        this.activeLocations[x].attributes.active = false;
                        for(let y = 0; y < this.delivery[0].attributes.exclusions.length; y++){
                            if(this.delivery[0].attributes.exclusions[y].location_value === this.activeLocations[x].attributes.value){
                                this.activeLocations[x].attributes.active = true;
                            }
                        }
                    }
                }
            },

            statusChange(index){
                if(this.toBeChanged.save.length > 0 || this.toBeChanged.remove.length > 0) {
                    this.checkStatus(this.activeLocations[index]);
                }

                if (this.activeLocations[index].attributes.active === true) {
                    this.toBeChanged.save.push(this.activeLocations[index].id)
                } else {
                    this.toBeChanged.remove.push(this.activeLocations[index].id)
                }

            },

            checkStatus(obj){
                let action = '';
                if(obj.attributes.active){
                    action = 'remove';
                }else {
                    action = 'save';
                }

                for(let y = 0; y < this.toBeChanged[action].length; y++){
                    if(this.toBeChanged[action][y] === obj.id){
                        this.toBeChanged[action].splice(y);
                    }
                }
            },

            async updateExclusions(){

                let data = {
                    'data':{
                        'type':'delivery-locations-exclusion',
                        'attributes':{
                            'add':this.toBeChanged['save'],
                            'remove':this.toBeChanged['remove'],
                            'delivery_id':this.delivery[0].id
                        }
                    }
                };

               await deliveryTypeStore.saveExclusionZone(data);
            }
        }

    }
</script>

<style scoped>

</style>