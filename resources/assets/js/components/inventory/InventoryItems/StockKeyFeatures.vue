<template>
  <div class="details-form">
        <div class="details-form__body">
            <label>Feature</label>
                <div v-for="(feature, index) in key_features" :key="index">
                    <input style="display:inline-block" v-model="key_features[index].feature" name="feature" data-vv-as="key feature" type="text" v-validate="'required'"/>
                    <input style="display:inline-block; width:50px" v-model="key_features[index].order" name="featureOrder" type="number"/>
                    <button class="btn btn-danger" @click="removeFeature(index)">-</button>
                </div>
             <span v-for="(error, index) in errors.collect('feature')" :key="index+'z'" class="error-message">{{ error }}</span>
           
        </div>
        <div class="details-form__body">
            <!--<input v-model="newFeature" name="newFeature" type="text" @keyup.enter="addFeature()"/>-->
            <input style="display:inline-block" v-model="newFeature" name="newFeature" type="text"/>

            <input style="display:inline-block; width:50px" v-model="newOrder" name="newFeatureOrder" type="number"/>
            <button class="btn btn-success" :disabled="newFeature.length === 0" @click="addFeature()">+</button>
        </div>
        <br>
        <div class="details-form__cta">
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveFeatures()">Save Features</button>
        </div>
    </div>
</template>
<script>
import {keyFeatureStore} from '@/stores';

export default {

    props: ['stockitem', 'view'],

    data() {
        return {
            key_features:[],
            newFeature:'',
            newOrder:''

        }
    },

    watch: {
        stockitem()
        {
            if(this.stockitem.attributes) {
                if(this.stockitem.attributes.key_features) {
                    this.key_features = this.stockitem.attributes.key_features;
                    this.newOrder = this.stockitem.attributes.key_features.length + 1;
                }
            }
        }
    },

    methods: {
        addFeature()
        {
            if(this.newFeature.length > 0) {
                let data = {
                    feature: this.newFeature,
                    order:this.newOrder
                };

                this.key_features.push(data);

                this.newFeature = '';
                this.newOrder = this.key_features.length+1;
            }
        },

        removeFeature(index)
        {
            this.key_features.splice(index, 1);
        },

        async saveFeatures()
        {
            await this.$validator.validateAll();

               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               } else {
                let data = {
                    data: {
                        attributes: {
                            id: this.stockitem.id,
                            features: this.key_features,
                        }
                    }
                };

                keyFeatureStore.addFeatures(data);

                }
          
        }
    }
}
</script>