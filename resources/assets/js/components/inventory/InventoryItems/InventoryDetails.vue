<template>
        <div class="details-form">
            <div style="float:right;" class="details-form__cta">
                <button :disabled="$validator.errors.any() || disabled == 1" @click="submitInventory()" class="btn btn-primary createButton">{{buttonTitle}}</button>
            </div>
            <div class="details-form__body">
                <div id="inventoryStockCode">
                    <label>Stock Code: </label>
                    <input v-model="stockCode" type="text" title="Stock Code" data-vv-as="Stock Code" name="stockCode" v-validate="'required'" placeholder="Please Enter a Stock Code" autofocus >
                </div>
                <span class="error-message" v-for="error in errors.collect('stockCode')" :key="error+'a'">{{error}}</span>
                <div id="inventoryStockTitle">
                    <label>Stock Title: </label>
                    <input v-model="stockTitle" type="text" title="Stock Title" data-vv-as="Stock Title" name="stockTitle" v-validate="'required'" placeholder="Please Enter a Stock Title" required>
                </div>
                <span class="error-message" v-for="error in errors.collect('stockTitle')" :key="error+'b'">{{error}}</span>
                <div>
                    <label>Product Group</label>
                    <select v-model="currentGroupID" name="currentGroupID" data-vv-as="Product Group" v-validate="'excluded:Please Select'" >
                        <option disabled>Please Select</option>
                        <option v-for="(productGroup, index) in groups.productGroups" :value="productGroup.attributes.sage_id" :key="index">{{productGroup.attributes.name + ' - ' + productGroup.attributes.code}}</option>
                    </select>
                </div>
                <span class="error-message" v-for="error in errors.collect('currentGroupID')" :key="error+'c'">{{error}}</span>
                <div>
                    <label>Stock Type</label>
                    <select v-model="currentType" name="currentType" v-validate="'required|included:BOM,Standard,Variant,Configurable'" data-vv-as="Stock Type">
                        <option value="Standard">Standard</option>
                        <option value="BOM">BOM</option>
                        <option value="Variant">Variant</option>
                        <option value="Configurable">Configurable</option>
                    </select>
                    <span class="error-message" v-for="error in errors.collect('currentType')" :key="error+'d'">{{error}}</span>
                </div>
                <div>
                    <label>Delivery Type</label>
                    <select v-model="currentShipping" name="currentShipping" v-validate="'excluded:Please Select'">
                        <option disabled>Please Select</option>
                        <option v-for="(shipping, index) in shippingTypes" :value="shipping.id" :key="index">{{shipping.attributes.availability}}</option>
                    </select>
                    <span class="error-message" v-for="error in errors.collect('currentShipping')" :key="error+'d'">{{error}}</span>
                </div>
                <div>
                    <label for="activeField">Active: </label>
                    <input id="activeField" name="activeField" v-model="activeProduct" type="checkbox">
                </div>

                <div>
                    <label>Brand</label>
                    <select v-model="currentBrand" name="currentShipping" v-validate="'excluded:Please Select'">
                        <option disabled value="">Please Select</option>
                        <option v-for="(brand, index) in brands" :value="brand.id" :key="index">{{brand.attributes.name}}</option>
                    </select>
                </div>

                <div>
                    <label for="useFeed">Use Feed: </label>
                    <input id="useFeed" name="useFeed" data-vv-as="Feed" v-model="useFeed" type="checkbox">
                </div>

                <div>
                    <label for="useFeedDesc">Use Feed Desc: </label>
                    <input id="useFeedDesc" name="useFeedDesc" data-vv-as="FeedDesc" v-model="useFeedDesc" type="checkbox">
                </div>

                <div>
                    <label for="useFeedStock">Use Feed Stock: </label>
                    <input id="useFeedStock" name="useFeedStock" data-vv-as="FeedStock" v-model="useFeedStock" type="checkbox">
                </div>

                <div>
                    <label for="useFeedAppend">Use Feed Append: </label>
                    <input id="useFeedAppend" name="useFeedAppend" data-vv-as="FeedAppend" v-model="useFeedAppend" type="checkbox">
                </div>

                <div>
                    <label for="googleFeed">Use Google Feed: </label>
                    <input id="googleFeed" name="googleFeed" data-vv-as="GoogleFeed" v-model="googleFeed" type="checkbox">
                </div>

                <div>
                    <label>EAN Number: </label>
                    <input v-model="eanNo" type="text" title="eanNo" data-vv-as="EAN Number" name="eanNo" placeholder="Please Enter a EAN Number" required>
                </div>

                <div>
                    <label>Manufacturers Number: </label>
                    <input v-model="manuNumber" type="text" title="eanNo" name="eanNo" placeholder="Please Enter a Manufacturers Number" required>
                </div>

                <div>
                    <label>Min On Stock: </label>
                    <input v-model="minOnStock" type="number" title="Min On Stock" name="minOnStock" placeholder="Please Enter a Min On Stock" required>
                </div>

                <div>
                    <label>Item Weight (grams)</label>
                    <input  v-model="itemWeight" type="number" title="Stock Item Weight" placeholder="please enter the items weight in Grams">
                </div>

                <div>
                    <label for="overview">Overview</label>
                    <tinymce id="overview" v-model="overview" title="Overview Overview" name="invOverview" data-vv-as="MobileOverview" placeholder="Please Enter Overview Description">
                    </tinymce>
                </div>

                <div class="prices">
                    <h1>Prices</h1>
                    <div>
                        <label>Standard Price</label>
                        <div class="prices__section">
                            <span>£</span>
                            <input type="number" v-model="standardPrice" name="standardPrice" data-vv-as="Standard Price" v-validate="'decimal|required'">
                        </div>
                    </div>
                    <span class="error-message" v-for="error in errors.collect('standardPrice')" :key="error+'e'">{{error}}</span>
                    <div>
                        <label>Trade Price</label>
                        <div class="prices__section">
                            <span>£</span>
                            <input type="number" v-model="tradePrice" name="tradePrice" data-vv-as="Trade Price" v-validate="'decimal|required'">
                        </div>
                    </div>
                    <span class="error-message" v-for="error in errors.collect('tradePrice')" :key="error+'f'">{{error}}</span>

                    <div>
                        <label>Old Price: </label>
                        <div class="prices__section">
                         <span>£</span>
                            <input v-model="oldPrice" type="number" title="Old Price"  name="oldPrice">
                        </div>
                    </div>

                    <!--<div>-->
                        <!--<label>Price Impact Type: </label>-->
                        <!--<div class="prices__section">-->
                            <!--<select v-model="priceImpactType">-->
                                <!--<option value ="0">Please Select</option>-->
                                <!--<option value="1">Percentage</option>-->
                                <!--<option value="2">Price</option>-->
                            <!--</select>-->
                        <!--</div>-->
                    <!--</div>-->

                    <div>
                        <label>Price Impact: </label>
                        <input v-model="priceImpact" type="text" title="Price Impact" name="priceImpact" placeholder="Please Enter a Price Impact">
                    </div>



                </div>
                <div>
                    <label>Hidden Price</label>
                    <input type="checkbox" name="hiddenprice" v-model="hidePrice">
                </div>
                <br>
            </div>

            <div class="details-form__cta">
                <button :disabled="$validator.errors.any() || disabled == 1" @click="submitInventory()" class="btn btn-primary createButton">{{buttonTitle}}</button>
            </div>
        </div>
</template>

<script>
    import {inventoryStore} from '@/stores';
    import {productGroupsStore} from '@/stores';
    import {deliveryTypeStore, stockAvailabilityStore, brandsStore} from '@/stores';
    import {event} from '@/services';
	import axios from 'axios';

    export default {

        props:['view' ,'stockitem'],

        data() {
            return {
                stockCode: '',
                stockTitle: '',
                error: false,
                confirmation: true,
                disabled: 1,
                currentGroupID:'Please Select',
                currentShipping: 'Please Select',
                standardPrice:'',
                tradePrice:'',
                productId:'',
                stockItem:'',
                productGroup:[],
                currentType:'Standard',
                groups:{'productGroups':[]},
                shippingTypes: [],
                buttonTitle:'',
                brands:[],
                currentBrand:'',
                overview: '',
				        useFeedDesc: false,
				        useFeed: false,
				        useFeedStock: false,
				        useFeedAppend: false,
                eanNo: "",
                sageInfoId: 0,
                priceImpact: 0,
                oldPrice: 0,
                priceImpactType: 1,
                minOnStock: 0,
                googleFeed: false,
                hidePrice:0,
                itemWeight:0,
                manuNumber:'',
                activeProduct:false
            }
        },

        watch:{
           async view(){
                if(this.view === 'create-inventory'){
                    this.groups.productGroups = await productGroupsStore.checkLoad();
                    this.shippingTypes = await stockAvailabilityStore.checkLoading();
                    this.stockCode = '';
                    this.brands = await brandsStore.loadCheck(1);
                    this.stockTitle = '';
                    this.error = false;
                    this.confirmation = true;
                    this.disabled = 1;
                    this.currentGroupID = 'Please Select';
                    this.currentDelivery = 'Please Select';
                    this.currentShipping ='Please Select';
                    this.standardPrice = '';
                    this.tradePrice = '';
                    this.productId = '';
                    this.stockItem = '';
                    this.productGroup = [];
                    this.currentType = 'Standard';
                    this.buttonTitle = 'Create Inventory Item';
                    this.currentBrand = '';
                    this.overview = '';
                    this.hidePrice = 0;
                    this.useFeedDesc = 0;
                    this.useFeed = 0;
                    this.useFeedStock = 0;
                    this.useFeedAppend = 0;
                    this.eanNo = "";
                    this.sageInfoId = 0;
                    this.priceImpact = 0;
                    this.oldPrice = 0;
                    this.priceImpactType = 1;
                    this.minOnStock = 0;
                    this.googleFeed = 0;
                    this.itemWeight = 0;
                    this.manuNumber = '';
                    this.activeProduct = false;

                }
                this.$validator.reset();
            },

            async stockitem(){

                if(this.view === 'edit-stock') {
                    this.stockItem = this.stockitem;

                    if(this.stockitem.attributes.overview){
                        this.overview = this.stockitem.attributes.overview;
                    }else{
                        this.overview = '';
                    }

                    if (this.stockitem != null) {
                        this.brands = await brandsStore.loadCheck(1);
                        this.shippingTypes = await stockAvailabilityStore.checkLoading();
                        this.standardPrice = this.stockitem.attributes.standard_price;
                        this.tradePrice = this.stockitem.attributes.trade_price;

                        if ((this.groups.productGroups) && (this.groups.productGroups.length < 2)) {
                            this.groups.productGroups = await productGroupsStore.checkLoad();
                        }
                        this.stockCode = this.stockitem.attributes.code;
                        this.stockTitle = this.stockitem.attributes.description;
                        this.productGroup = this.groups.productGroups;
                        this.productId = this.stockitem.id;
                        this.currentType = this.stockitem.attributes.stock_type;
                        this.buttonTitle = 'Update Inventory Item';
                        this.currentBrand = this.stockitem.attributes.brand_id;
                        this.currentShipping = this.stockitem.attributes.delivery;
                        this.useFeedDesc = this.stockitem.attributes.use_feed_desc;
                        this.useFeed = this.stockitem.attributes.use_feed;
                        this.useFeedStock = this.stockitem.attributes.use_feed_stock;
                        this.useFeedAppend = this.stockitem.attributes.use_feed_append;
                        this.itemWeight = this.stockitem.attributes.weight;
                        this.eanNo = this.stockitem.attributes.ean_no;
                        this.sageInfoId = this.stockitem.attributes.sage_info_id;
                        this.priceImpact = this.stockitem.attributes.price_impact;
                        this.oldPrice = this.stockitem.attributes.old_price;
                        this.priceImpactType = this.stockitem.attributes.old_price_type ? this.stockitem.attributes.old_price_type : 1;
                        this.minOnStock = this.stockitem.attributes.min_on_stock;
                        this.googleFeed = this.stockitem.attributes.google_feed;
                        this.hidePrice = this.stockitem.attributes.hide_price;
                        this.manuNumber = this.stockitem.attributes.manuNumber;

                        for (let i = 0; i < this.productGroup.length; i++) {
                            if (this.productGroup[i].attributes.sage_id.toString() === this.stockitem.attributes.product_group_id.toString()) {
                                this.currentGroupID = this.groups.productGroups[i].attributes.sage_id;
                            }
                        }

                        if (this.stockitem.attributes.active === 1) {
                            this.activeProduct = true;
                        } else {
                            this.activeProduct = false;
                        }
                    }
                }
            },

            stockCode(){
                this.lengthCheck();
            },

            stockTitle(){
                this.lengthCheck();
            }
        },

        methods: {
            // setPrice(priceBand){
            //     switch(priceBand['price_band']) {
            //         case 1:
            //             let sPrice = priceBand['value'] / 100;
            //             this.standardPrice = sPrice.toFixed(2);
            //             break;
            //         case 2:
            //             let tPrice = priceBand['value'] / 100;
            //             this.tradePrice = tPrice.toFixed(2);
            //             break;
            //         default:
            //             let defaultPrice = priceBand['value'] / 100;
            //             this.standardPrice = defaultPrice.toFixed(2);
            //             break;
            //     }
            // },

            lengthCheck(){
                if((this.stockCode.length > 0) && (this.stockTitle.length > 0)){
                    this.disabled = 0;
                }else{
                    this.disabled = 1;
                }
            },

            clear(){
                this.stockCode = '';
                this.stockTitle = '';
                this.currentGroupID = 'Please Select';
                this.currentDelivery = 'Please Select';
                this.currentType = 'Standard';
                this.standardPrice = '';
                this.tradePrice = '';
                this.$validator.reset();
                this.hidePrice = 0;

            },

            async submitInventory() {
               await this.$validator.validateAll();
               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }

                let data = {
                    'data': {
                        'type':'stockitems',
                        'attributes': {
                            'code': this.stockCode,
                            'delivery_id':this.currentShipping,
                            'description': this.stockTitle,
                            'active': this.activeProduct,
                            'type':this.currentType,
                            'standard_price':this.standardPrice,
                            'trade_price':this.tradePrice,
                            'product_group_id':this.currentGroupID,
                            'brand_id':this.currentBrand,
                            'overview': this.overview,
                            'use_feed_desc': this.useFeedDesc,
                            'use_feed': this.useFeed,
                            'use_feed_stock': this.useFeedStock,
                            'use_feed_append': this.useFeedAppend,
                            'ean_no': this.eanNo,
                            'sage_info_id': this.sageInfoId,
                            'price_impact': this.priceImpact,
                            'old_price': this.oldPrice,
                            'old_price_type': this.priceImpactType,
                            'min_on_stock': this.minOnStock,
                            'google_feed': this.googleFeed,
                            'hide_price': this.hidePrice,
                            'weight': this.itemWeight,
                            'manufacturer_number': this.manuNumber
                        },
                    }
                };

                if(this.view === 'create-inventory') {
                    try {
                        let resource = await inventoryStore.create(data);
                        data.data.id = resource.id;
                    } catch (error) {
                        event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error');
                    }
                }else if(this.view === 'edit-stock'){
                    data.data.id = this.productId;

                    try {
                        await inventoryStore.edit(data, this.productId);
                    } catch (error) {
                        event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error');
                    }
                }

                // Update Product For ES Index
                // this.searchUpdate(data.data.id)
            },
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
</style>
