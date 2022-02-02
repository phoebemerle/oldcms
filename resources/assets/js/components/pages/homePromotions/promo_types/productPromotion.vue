<template>
    <section>
            <div><strong>Attached Product:</strong> {{ productName }}</div>
            <br>
            <product-search type="attachToHomePromo"/>
            <div class="details-form__cta">
                <button class="btn btn-primary" :disabled="productName == 'No Product Selected'" @click="updatePromo()">Update Content</button>
            </div>
    </section>
</template>

<script>
import {homePromosStore} from '@/stores';
import {productStore} from '@/stores';
import {inventoryStore} from '@/stores';
import {sharedStore} from '@/stores';
import ProductSearch from '@/components/products/ProductSearch';
import {event} from '@/services';

export default {
    props: ['promoInfo', 'subview', 'promoType', 'tab'],

    components:{ProductSearch},

    data() {
        return {
            selectedProduct:{},
            savedProduct:{},
            productName: 'No Product Selected',
            images: null,
            products: []
        }
    },
    created() {
            this.products = productStore.state;
            event.on(event.names.UPDATE_HOMEPROMO, (product) =>{
                this.selectedProduct = product;
                this.productName = product.attributes.title;
            });
            
    },
    watch: {
        promoType() {
            if(this.promoInfo && this.promoInfo.attributes.promo_type == 2) {
                this.productName = this.promoInfo.attributes.title;
                this.selectedProduct = this.promoInfo;
                
            } else {
                this.productName = 'No Product Selected'
            }
        },

        
        tab() {
            this.promoInfo = homePromosStore.promoByID(this.tab)
             if(this.promoInfo.attributes.promo_type == 2) {
            this.productName = this.promoInfo.attributes.title;
                this.selectedProduct = this.promoInfo;
            }
        }
    },
    methods: {
        updatePromo(){
            sharedStore.showLandingPage();

            if(this.selectedProduct.relationships) {
                if(this.selectedProduct.relationships.images.data[0]) {
                this.images = this.selectedProduct.relationships.images.data[0].id;
                }
            } else if(this.images == null) {
                this.images = this.promoInfo.attributes.image_id;
            }
            var data = {
                'data': {
                    'type':'promos',
                    'attributes': {
                        'promo_type': 2,
                        'title': this.selectedProduct.attributes.title,
                        'description': this.selectedProduct.attributes.overview,
                        'image_id': this.images,
                        'promo_link': '/products/'+this.selectedProduct.attributes.title.toLowerCase().split(' ').join('_'),
                        'button_text': null
                    }
                }
            };
            homePromosStore.update(data, this.promoInfo.id);
        }

    }
}
</script>

<style>
    .box {
        height: 500px;
        overflow: scroll
    }
</style>
