<template>
  <div class="details-form">
    <div class="details-form__body">
      <div>
        <h3>Drop Down Options</h3>
        <button class="btn btn-success" @click="showPartCodes = !showPartCodes">See Part Codes</button>
      </div>
      <configurable-product-label :stockid="stockid" v-for="(configLabel, key) in configLabels" :key="key" :configLabel="configLabel"></configurable-product-label>
      <configurable-part-codes-modal v-show="showPartCodes" :partCodes="partCodes"></configurable-part-codes-modal>
      <button @click="addNewLabel('option')">Add New Label</button>
    </div>

    <hr>

    <div class="details-form__body">
      <div>
        <h3>Customer Input</h3>
      </div>
      <configurable-product-input-label :stockid="stockid" v-for="(inputLabel, key) in configInputLabels" :key="'A'+key" :inputLabel="inputLabel"></configurable-product-input-label>
      <button @click="addNewLabel('input')">Add New Label</button>
    </div>
  </div>
</template>

<script>
    import {event} from '@/services';
    import {configProductStore} from '@/stores';
    import ConfigurableProductLabel from "./ConfigurableProductLabel";
    import ConfigurablePartCodesModal from "./ConfigurablePartCodesModal";
    import ConfigurableProductInputLabel from "./ConfigurableProductInputLabel";

    export default {
        components: {ConfigurableProductInputLabel, ConfigurablePartCodesModal, ConfigurableProductLabel},

        props:['stockid', 'stockitem'],

        data(){
            return{
                configLabels:[],
                partCodes:[],
                showPartCodes:false,
                configInputLabels:[]
            }
        },

        created(){
            event.on(event.names.CLOSE_PART_CODE_MODAL, (state)=>{
                this.showPartCodes = state;
            })
        },

        watch:{
            stockitem(){

                if(this.stockitem.attributes.config_labels.length > 0)
                {
                    this.partCodes = this.stockitem.attributes.config_part_codes.length > 0 ? this.stockitem.attributes.config_part_codes : [];
                    let options = this.stockitem.attributes.config_labels.filter(row => row.label_type === 'options');
                    let input = this.stockitem.attributes.config_labels.filter(row => row.label_type === 'input');

                    this.configLabels = options.length > 0 ? options : [
                        {
                            'variant_label':'',
                            'options':[],
                            'inputs':{
                                'unit':'',
                                'min':0,
                                'max':0,
                                'price_per_unit':0
                            },
                            'stock_id':this.stockid,
                            "priority": 1,
                            "label_type":'options'
                        }
                    ];

                    this.configInputLabels = input.length > 0 ? input : [
                        {
                            'variant_label':'',
                            'options':[],
                            'inputs':{
                                'unit':'',
                                'min':0,
                                'max':0,
                                'price_per_unit':0
                            },
                            'stock_id':this.stockid,
                            "priority": 1,
                            "label_type":'input'
                        }
                    ];
                }


          }
        },

        methods: {

            addNewLabel(type){
                console.log(type);

                if(type === 'option'){
                    this.configLabels.push({
                        "stock_id":this.stockid,
                        "variant_label":"",
                        "priority":this.configLabels.length +1,
                        "label_type":"input",
                        "options":[],
                        "inputs":{"id":null,"configurable_variant_id":"","unit":"","min":0,"max":0,"price_per_unit":0,"type":"input"}
                    })
                }else if(type === 'input'){
                    this.configInputLabels.push({
                        "stock_id":this.stockid,
                        "variant_label":"",
                        "priority":this.configLabels.length +1,
                        "label_type":"input",
                        "options":[],
                        "inputs":{"id":null,"configurable_variant_id":"","unit":"","min":0,"max":0,"price_per_unit":0,"type":"input"}
                    })
                }

            },

        }
    }
</script>