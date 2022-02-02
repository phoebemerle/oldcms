<template>
    <div class="details-form">
        <div class="details-form__body form-sections" >
            <div>
                <h2 style="display: inline;">Product Details</h2>
                <div class="details-form__cta" style="float:right">
                    <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="updateProduct()">{{buttonTitle}}</button>
                </div>
            </div>
            <div id="productTitleContainer">
                <label for="productTitle">Product Title: </label>
                <input id="productTitle" v-model="productTitle" type="text" title="Product Title" name="productTitle" placeholder="Please Enter a Product Title" data-vv-as="Title" v-validate="'required'">
            </div>
            <span class="error-message" v-for="error in errors.collect('productTitle')" :key="error+'a'">{{error}}</span>

            <div v-if="view === 'edit-product'">
                <a target="_blank" style="color:blue;" :href="website + 'products/'+urlStub"><p>{{website}}products/{{urlStub}}</p></a>
            </div>

            <div id="productActiveStatus">
                <label for="productActive">Live Publish: </label>
                <input id="productActive" v-model="productActive" type="checkbox" title="Product Title" name="productTitle" >
            </div>

            <div id="productStagingStatus">
                <label for="productStaging">Staging Publish: </label>
                <input id="productStaging" v-model="productStaging" type="checkbox" title="Product Title" name="productTitle" >
            </div>

            <div class="productRedirectContainter">
                <div>
                    <label for="productRedirect">Redirects: </label>
                    <input type="text" id="productRedirect" name="productRedirect" v-model="productRedirect" placeholder="Please Enter a Redirect" >
                </div>
                <div>
                    <label>Redirect Type</label>
                    <br>
                    <label for="categoryRedirectType">Category</label>
                    <input type="radio" id="categoryRedirectType" value="category"  @change="changeRedirectType()" v-model="redirectType">
                    <br>
                    <label for="productRedirectType">Product</label>
                    <input type="radio" id="productRedirectType" value="product" @change="changeRedirectType()" v-model="redirectType">
                </div>
            </div>

             <div class="productOverviewContainter">
                <label>Overview Headline: </label>
                <input type="text" id="productShortDesc" name="productShortDesc" v-model="productShortDesc" placeholder="Please Enter a Short Description" >
            </div>

            <div class="productOverviewContainter">
                <label>Manufacture Overview: </label>
                <tinymce :id="'productLongDesc'" v-model="productLongDesc" title="Product Long Description" name="productLongDesc" data-vv-as="Long Description"  placeholder="Please Enter a Description">
                </tinymce>
            </div>


            <div id="overviewImageUploadContainer">
                <label @click="showImage = !showImage">Overview Image Upload - Please upload your images here and then use the given URL for the overview.</label>
                <single-uploader></single-uploader>
            </div>


            <div id="productMobileOverviewContainer">
                <label for="productMobileOverview">Mobile Overview: </label>
                <tinymce :id="'productMobileOverview'" v-model="productMobileOverview" title="Product Mobile Overview" name="productMobileOverview" data-vv-as="MobileOverview" placeholder="Please Enter a Product Mobile Overview">
                </tinymce>
            </div>
              <!--<button class="btn btn-primary" @click="copyProductOverview()">Copy Product Overview</button>-->
        </div>

        <div v-show="view === 'edit-product'" class="form-sections" >
            <div id="productSashContainer">
                <label for="productSash">Product Sash: </label>
                <select id="productSash" v-model="productSashID" type="text" title="Product Sash" name="productSash">
                    <option disabled value="">Please Select</option>
                    <option v-for="(sash, index) in productsashes" :value="sash.id" :key="index">{{sash.attributes.title}}</option>
                </select>
            </div>
        </div>

        <div class="details-form__cta">
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="updateProduct()">{{buttonTitle}}</button>
        </div>
    </div>
</template>

<script>
    import {productStore} from '@/stores';
    import {productSashesStore} from '@/stores';
    import {RedirectStore} from '@/stores';
    import {productGroupsStore} from '@/stores';
    import SingleUploader from '@/components/shared/CDNUpload/single-uploader';
    import {event, endPoints} from '@/services';

export default {
        components: {SingleUploader},
        props:['view', 'product', 'attachedStock', 'related'],

        data(){
            return{
                website: endPoints.website,
                productTitle:'',
                productShortDesc:'',
                productLongDesc: '',
                productMobileOverview: '',
                buttonTitle:'',
                showSearch: false,
                productsashes: [],
                productSashID: '',
                productActive :false,
                productStaging:'',
                showImage:false,
                productRedirect:'/products/',
                redirectType:'product',
                newRedirect:'',
                urlStub:''

            }
        },

        watch:{
            async view(){
                this.$validator.reset();
                if(this.view === 'create-product'){
                    this.buttonTitle = 'Create Product';
                      this.productsashes = productSashesStore.state.productsashes;
                    this.resetProduct();
                }else if(this.view === 'edit-product'){

                    this.productActive = this.product.attributes.active;
                    this.productStaging = this.product.attributes.staging;
                    this.productTitle = this.product.attributes.title;
                    this.productsashes = productSashesStore.state.productsashes;
                    this.urlStub = this.product.attributes.url_stub;

                    if(this.product.attributes.short_desc) {
                        this.productShortDesc = this.product.attributes.short_desc;
                    } else {
                        this.productShortDesc = '';
                    }
                    if(this.product.attributes.long_desc) {
                        this.productLongDesc = this.product.attributes.long_desc;
                    } else {
                        this.productLongDesc = '';
                    }
                    if(this.product.attributes.mobile_overview) {
                        this.productMobileOverview = this.product.attributes.mobile_overview;
                    } else {
                        this.productMobileOverview = '';
                    } 
                     if(this.product.attributes.sash != 0) {
                        this.productSashID = this.product.attributes.sash[0].id;
                    } else {
                        this.productSash = '';
                    }

                     this.checkURL();
                    this.buttonTitle = 'Update Product';
                }
                this.errors.clear();
            },

            product:{
                handler: async function () {
                    if((this.product.length > 1) &&( this.product.attributes === "products")) {

                        this.productActive = this.product.attributes.active;
                        this.productsashes = productSashesStore.state.productsashes;
                        this.productTitle = this.product.attributes.title;
                        this.productStaging = this.product.attributes.staging;


                        if(this.product.attributes.short_desc) {
                            this.productShortDesc = this.product.attributes.short_desc;
                        } else {
                            this.productShortDesc = '';
                        }
                        if(this.product.attributes.long_desc) {
                            this.productLongDesc = this.product.attributes.long_desc;
                        } else {
                            this.productLongDesc = '';
                        }
                        this.productLongDesc = this.product.attributes.long_desc;
                        if(this.product.attributes.mobile_overview) {
                            this.productMobileOverview = this.product.attributes.mobile_overview;
                        } else {
                            this.productMobileOverview = '';
                        }
                        if(this.product.attributes.sash != 0) {
                            this.productSashID = this.product.attributes.sash[0].id;
                        } else {
                            this.productSash = '';
                        }

                        this.checkURL();
                    }
                },
                deep: true
            }

        },

        methods:{
            changeRedirectType(){
                if(this.redirectType === 'product'){
                    this.newRedirect = '/products/';
                }else if (this.redirectType === 'category'){
                    this.newRedirect = '/categories/';
                }
            },

            async checkURL(){
                this.redirectType = [];
                let slug = '/products/'+this.product.attributes.url_stub;
                let oldSlug = slug+'/';

                this.newRedirect = await RedirectStore.getUrlRedirect(slug, oldSlug);

                this.productRedirect = this.newRedirect;

                if(this.newRedirect) {
                    if (this.newRedirect.includes('/products/') || this.newRedirect.includes('/products.php/')) {
                        this.redirectType = 'product';
                    } else if (this.newRedirect.includes('/categories2.php/') || this.newRedirect.includes('/categories/')) {
                        this.redirectType = 'category';
                    }
                }else{
                    this.redirectType = 'product';
                    this.newRedirect = '/products/';

                }

            },

            copyProductOverview(){
                this.productMobileOverview = this.productLongDesc;
            },


            resetProduct(){
                this.productTitle = '';
                this.productShortDesc = '';
                this.productLongDesc = '';
                this.productMobileOverview = '';
                this.stockItems = [];
                this.productSashID = '';
                this.productActive = false;
                this.productStaging = false;
                this.urlStub = '';


            },

            async updateProduct(){

                await this.$validator.validateAll();

               if(this.$validator.errors.any()) {
                    return event.emit(event.names.USER_MESSAGE, 'Validation not met!', 'error');
               }

                if(this.productMobileOverview === ''){
                    this.productMobileOverview = this.productLongDesc;
                }

                let data = {
                    'data': {
                        'type':'products',
                        'attributes': {
                            'title': this.productTitle,
                            'short_desc': this.productShortDesc,
                            'overview': this.productLongDesc,
                            'mobile_overview': this.productMobileOverview,
                            'active': this.productActive,
                            'staging': this.productStaging
                        },
                        'relationships':{
                            'stock_items':{
                                'data':[]
                            },
                            'relatedproducts': {
                                'data':[]
                            }
                        }
                    }
                };

                if(this.view === 'create-product'){
                    try {
                        let newProductInfo =await productStore.create(data);
                        await productSashesStore.attachSashViaProduct(this.productSashID, this.product);
                        this.urlStub = newProductInfo.attributes.url_stub;

                        this.view = 'edit-product';
                    } catch (error) {
                        console.log(error);
                        event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error');
                    }
                }else if(this.view === 'edit-product') {

                    data.data.id = this.product.id;

                    try {
                        let newProductInfo = await productStore.update(data ,this.product);
                        await productSashesStore.attachSashViaProduct(this.productSashID, this.product);
                        this.urlStub = newProductInfo.attributes.url_stub;
                    } catch (error) {
                        console.log(error);
                        event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error');
                    }
                }



                // this.urlStub = $newProd

                // if((this.newRedirect !== '') && (this.newRedirect !== '/products/') && (this.newRedirect !== '/categories/') && (this.newRedirect !== this.productRedirect)){
                //     let slug = '/products/'+this.product.attributes.url_stub;
                //     let oldSlug = slug+'/';
                //
                //     let data = {
                //         'old_url': slug,
                //         'older_url': oldSlug,
                //         'new_url': this.productRedirect
                //     };
                //
                //     this.newRedirect = await RedirectStore.savedNewRedirect(data);
                //     this.productRedirect = this.newRedirect;
                // }
            }
        }
    }
</script>
s
<style lang="scss">
    @import "~#/variables";

    #productSelectedStockItems{
        li {
            font-size: 1.4rem;
        }

        span{
            font-size:1.2rem;
        }
    }


    .productOverviewContainter{
        textarea{
            width:80rem;
            height:10rem;
        }

        label{
            vertical-align: top;
        }

    }

    #overviewImageUploadContainer{

        padding:5px 10px;
        border: 1px solid #c9c9c9;
        border-radius: 5px;

        label{
            width:100%;
        }

        form{
            input{
                width:unset;
                display: inline-block;
            }

        }
    }

</style>