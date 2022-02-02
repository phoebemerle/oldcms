<template>
    <div class="main-sections__editForm">
        <div v-show="subview === 'edit-product'" class="overviewTabs">
            <ul class="list-inline">
                <li v-bind:class="{ activeTab: tab === 'productDetails' }" @click="changeTab('productDetails')">Product Info</li>
                <li v-bind:class="{ activeTab: tab === 'stockItem' }" @click="changeTab('stockItem')" class="">Stock Item Info</li>
                <li v-bind:class="{ activeTab: tab === 'media' }" @click="changeTab('media')" class="">Media</li>
                <!-- <li v-bind:class="{ activeTab: tab === 'GSP' }" @click="changeTab('GSP')" class="">Google Shopping Profiles</li> -->
                <li v-bind:class="{ activeTab: tab === 'related' }" @click="changeTab('related')" class="">Related Products</li>
                <li v-bind:class="{ activeTab: tab === 'licenses' }" @click="changeTab('licenses')" class="">Product Licences</li>
                <li v-bind:class="{ activeTab: tab === 'costeffective' }" @click="changeTab('costeffective')" class="">Cost Effective Alternatives</li>
                <!--<li v-bind:class="{ activeTab: tab === 'badges' }" @click="changeTab('badges')" class="">Badges</li>-->
                <li v-bind:class="{ activeTab: tab === 'sections' }" @click="changeTab('sections')" class="">Sections</li>
                <li v-bind:class="{ activeTab: tab === 'meta-info' }" @click="changeTab('meta-info')" class="">Meta Info</li>
            </ul>
        </div>
        <div class="main-sections__editForm__container">
            <product-details v-show="tab ==='productDetails'" :view="subview" :product="product" :attachedStock="attachedStock"/>
            <stock-item-info v-show="tab === 'stockItem'" :product="product" :attachedStockItems="attachedStock"/>
            <media-overview v-show="tab === 'media'" :product="product" :images="images" :documents="documents"/>
            <related-products v-show="tab === 'related'" :product="product" :related="relatedProducts"/>
            <related-licence v-show="tab === 'licenses'" :product="product" :licenses="relatedLicenses"/>
            <cost-effective-alternatives v-show="tab === 'costeffective'" :product="product" :costeffective="costEffectiveAlt"/>
            <!--<attached-product-badges v-show="tab === 'badges'" :selectedBadges="selectedBadges" :product="product" :view="subview"></attached-product-badges>-->
            <product-page-sections v-show="tab === 'sections'" :savedsections="savedSections" :product="product"></product-page-sections>
            <product-meta-info  v-show="tab === 'meta-info'" :metainfo="metainfo" :product="product"></product-meta-info>
        </div>
    </div>
</template>

<script>
    import ProductDetails from '@/components/products/ProductDetails';
    import ProductMetaInfo from '@/components/products/ProductMetaInfo';
    import StockItemInfo from '@/components/products/stockitem/StockItemInfo';
    import MediaOverview from '@/components/products/media/MediaOverview';
    import GoogleProfileMain from '@/components/products/googleProfiles/googleProfileMain';
    import RelatedProducts from '@/components/products/RelatedProducts';
    import RelatedLicence from '@/components/products/ProductLicences';
    import CostEffectiveAlternatives from '@/components/products/CostEffectiveAlternatives';
    import AttachedProductBadges from '@/components/products/AttachedProductBadges';
    import ProductPageSections from '@/components/products/sections/ProductPageSections';
    import {documentStore} from "@/stores";
    import {inventoryStore} from "@/stores";
    import {productStore, sharedStore, productBadgesStore} from "@/stores";
    import {googleProfileStore} from "@/stores";
    import {imageStore} from "@/stores";
    import {cdnStore} from "@/stores";
    import {event} from '@/services';
    import {http} from '@/services';
    import {endPoints} from '@/services';
    import Vue from 'vue';

    export default {
        name: "ProductMain",

        components:{ProductDetails, StockItemInfo, MediaOverview, GoogleProfileMain, RelatedProducts, CostEffectiveAlternatives,
            AttachedProductBadges, ProductPageSections, ProductMetaInfo, RelatedLicence},

        props:['subview', 'product'],

        data(){
            return{ 
                tab:'productDetails',
                attachedStock:[],
                googleProfiles:[],
                relatedProducts: [],
                costEffectiveAlt:[],
                images:[],
                documents:[],
                selectedBadges:[],
                savedSections:[],
                metainfo:[],
                relatedLicenses:[]
            }
        },



        async mounted(){

            event.on(event.names.UPDATE_SHOPPING_PROFILES, (profile, type) => {
                if(type === 'New Profile') {
                    this.googleProfiles.push(profile);
                }else if(type === 'Remove Profile'){
                    for(let a =0; a < this.googleProfiles.length; a++){
                        if(this.googleProfiles[a].id.toString() === profile.id.toString()){
                            this.googleProfiles.splice(a,1);
                        }
                    }
                }
            });
            event.on(event.names.UPDATE_SELECTED, async (data, type, status) => {

                let counter = 0;
                if (type === 'stockItem') {
                    if (status === 'add') {
                        for (let a = 0; a < this.attachedStock.length; a++) {
                            if (this.attachedStock[a].id === data.id) {
                                counter = 1;
                            }
                        }

                        if (counter === 0) {
                            this.updateStockItems(data);
                        } else {
                            event.emit(event.names.USER_MESSAGE, data.attributes.description + ' is already an attached product', 'error');
                        }
                    }else if(status === 'remove'){
                        let data = {
                            'data': {
                                'type': 'product-stockitems',
                                'attributes':{
                                    'stockitem_id': data.id,
                                    'product_id': this.product.id
                                    }
                                }
                        };

                        this.removeStockItem(data, this.product.id);

                    }
                } else if(type === 'badge') {
                    if (status === 'add') {
                        for (let a = 0; a < this.product.attributes.badges.length; a++) {
                            if (this.product.attributes.badges[a].id === data.id) {
                                counter = 1;
                            }
                        }

                        if (counter === 0) {
                            var badgesData = await productBadgesStore.attachBadge(data, this.product);
                            this.selectedBadges.push(badgesData);
                            // let index = productBadgesStore.state.search.indexOf(badgesData);
                            // productBadgesStore.search.splice(index, 1);
                        } else {
                            event.emit(event.names.USER_MESSAGE, data.attributes.description + ' is already an attached badge', 'error');
                        }
                    }else if(status === 'remove'){
                        var responseData = await productBadgesStore.detachBadge(data, this.product);
                        for(let a = 0; a < this.selectedBadges.length; a++){
                        if(this.selectedBadges[a].id.toString() === responseData.id.toString()){
                            this.selectedBadges.splice(a, 1);
                        }
                    }
                        // let index = this.product.attributes.badges.indexOf(responseData);
                        // this.product.attributes.badges.splice(index);
                    }
                }
            });


            event.on(event.names.UPDATE_MEDIA_INFO, (type, mediaType, info,)=>{
                let attachedKey = '';
                /////////////////////////UPDATE IMAGES///////////////////////////
                if(mediaType === 'images') {
                    if (type === 'save') {
                        this.updateImage(info);
                    } else if (type === 'saveProductRelationship') {
                        sharedStore.showLandingPage();
                        try {
                            this.updateProductImageAttributes(info);
                        }catch(error){
                            console.log(error);
                        }

                    }
                    else if (type === 'delete') {
                        this.deleteImage(info.id);
                    }
                }
                /////////////////////////UPDATE DOCUMENTS///////////////////////////
                else if(mediaType === 'document') {
                    if (type === 'save') {

                        this.updateDocument(info);

                    } else if (type === 'delete') {
                        this.deleteDocument(info.id);
                    }
                }
            });

            event.on(event.names.SAVE_NEW_MEDIA, (type, mediaInfo, key)=>{

                let fb = new FormData();

                fb.append('file', mediaInfo.target, mediaInfo.name);

                let count = 0;

                if(type === 'images') {
                    if (mediaInfo.gallery === true) {
                        for (let v = 0; v < this.images.length; v++) {
                            if (this.images[v].attributes.gallery === true || this.images[v].attributes.gallery === 1){
                                count++
                            }
                        }
                        mediaInfo.order = count + 1;
                    } else {
                        mediaInfo.order = count;
                    }

                    this.savingNewImage(mediaInfo, fb, key);
                }else if (type === 'documents'){
                    this.savingNewDocument(mediaInfo, fb, key);
                }

            });
        },

        watch:{
            tab()
            {
                event.emit('tab', this.tab);
            },

            product(){
                this.tab = 'productDetails';
                this.attachedStock = [];
                this.googleProfiles=[];
                this.relatedProducts=[];
                this.costEffectiveAlt=[];
                this.images = [];
                this.documents = [];
                this.selectedBadges = [];
                this.relatedLicenses = [];
                if(this.product) {

                    if (this.product.type === 'products') {

                        if(this.product.attributes.meta_info) {
                            this.metainfo = this.product.attributes.meta_info;
                        } else {
                            this.metainfo = []
                        }

                        if(this.product.attributes.allstockitems.length > 0 ){
                            this.attachedStock = this.product.attributes.allstockitems;
                            // for(let a = 0 ; a < this.product.relationships.stockitems.data.length; a++) {
                            //     this.getStockItem(this.product.attributes.allstockitems[a].rec_id);
                            // }
                        }

                        if(this.product.attributes.images.length > 0) {
                            for (let i = 0; i < this.product.attributes.images.length; i++) {
                                this.getImages(this.product.attributes.images[i]);
                            }
                        }
                        this.documents = this.product.attributes.datasheets;

                        this.getGoogleProfiles();

                        if(this.product.attributes.related_products) {
                            if (this.product.attributes.related_products.length > 0) {
                                this.getRelated();
                            }
                        }

                        if(this.product.attributes.product_license) {
                            if (this.product.attributes.product_license.length > 0) {
                                this.getLicenses();
                            }
                        }

                        if(this.product.attributes.costeffective) {
                            if (this.product.attributes.costeffective.length > 0) {
                                this.getCostEffective();

                            }
                        }

                        //  if(this.product.attributes.badges) {
                        //     if (this.product.attributes.badges.length > 0) {
                        //         this.getProductBadges();
                        //
                        //     }
                        // }

                        this.getSections();
                    }
                }
            }
        },

        methods:{
            async getSections(){
                this.savedSections = await productStore.getSavedSections();
            },

            async getRelated(){

                for(let x = 0; x < this.product.attributes.related_products.length; x++) {
                    this.relatedProducts.push(await productStore.productByID(this.product.attributes.related_products[x].id));
                }

                for(let y = 0; y < this.relatedProducts.length; y++){
                    let related = this.findRelatedOrder(this.relatedProducts[y].id);
                    this.relatedProducts[y].order = related.order;
                }
            },

            async getLicenses(){

                for(let x = 0; x < this.product.attributes.product_license.length; x++) {

                    this.relatedLicenses.push(await productStore.productByID(this.product.attributes.product_license[x].id));
                }

                // for(let y = 0; y < this.relatedLicenses.length; y++){
                //     let related = this.findRelatedOrder(this.relatedLicenses[y].id);
                //     this.relatedLicenses[y].order = related.order;
                // }
            },

            //  async getProductBadges(){
            //
            //     for(let x = 0; x < this.product.attributes.badges.length; x++) {
            //         this.selectedBadges.push(await productBadgesStore.badgeByID(this.product.attributes.badges[x].id));
            //     }
            //
            //     for(let y = 0; y < this.selectedBadges.length; y++){
            //         let badges = this.findBadgeOrder(this.selectedBadges[y].id);
            //         this.selectedBadges[y].order = badges.order;
            //     }
            // },

            async getCostEffective(){
                
                for(let x = 0; x < this.product.attributes.costeffective.length; x++) {
                    this.costEffectiveAlt.push(await productStore.productByID(this.product.attributes.costeffective[x].id));
                 }

                for(let y = 0; y < this.costEffectiveAlt.length; y++){
                    let costeffective = this.findCostEffectiveOrder(this.costEffectiveAlt[y].id);
                    this.costEffectiveAlt[y].order = costeffective.order;
                }
            
            },

            findCostEffectiveOrder(id){
                for(let i = 0; i < this.product.attributes.costeffective.length; i++){
                    if(id.toString() === this.product.attributes.costeffective[i].id.toString()){
                        return this.product.attributes.costeffective[i];
                    }
                }
            },

            findRelatedOrder(id){
                for(let i = 0; i < this.product.attributes.related_products.length; i++){
                    if(id.toString() === this.product.attributes.related_products[i].id.toString()){
                        return this.product.attributes.related_products[i];
                    }
                }
            },

            // findBadgeOrder(id){
            //     for(let i = 0; i < this.product.attributes.badges.length; i++){
            //         if(id.toString() === this.product.attributes.badges[i].id.toString()){
            //             return this.product.attributes.badges[i];
            //         }
            //     }
            // },

            async getStockItem(id){
                let stockRelation = await inventoryStore.stockItemByID(id);
                if(this.product.attributes.allstockitems.find(row => row.rec_id === id)) {
                    stockRelation.attributes.priority = this.product.attributes.allstockitems.find(row => row.rec_id === id).priority
                } else {
                    stockRelation.attributes.priority = this.product.attributes.allstockitems.length + 1
                }
                this.attachedStock.push(stockRelation);
            },

            async getGoogleProfiles(){
                let profileArray = [];
                // for(let i = 0; i < this.product.relationships.stockitems.data.length; i++){
                //
                //     let tempProfile = await googleProfileStore.checkStore(this.product.relationships.stockitems.data[i].id);
                //     if(tempProfile != null){
                //         profileArray.push(tempProfile);
                //     }
                // }
                //
                this.googleProfiles = profileArray;
            },


             async updateStockItems(stockItem){
                let data = {
                    'data': {
                        'type': 'product-stockitems',
                        'attributes':{
                            'stockitem_id':stockItem.id,
                            'product_id':this.product.id
                        }
                    }
                };

                try {
                    await productStore.updateStock(data, this.product.id);
                    stockItem.attributes.type = stockItem.attributes.stock_type;
                    // stockItem.attributes.priority = stockItem.attributes.stock_type;
                    this.attachedStock.unshift(stockItem.attributes);
                } catch (error) {
                    console.log(error);
                }
            },

            async removeStockItem(productID, stockItemID){

                    let data = {
                    'data': {
                        'type': 'product-stockitems',
                        'attributes':{
                            'stockitem_id': stockItemID,
                            'product_id': productID
                            }
                        }
                    };

                try {
                    
                    productStore.removeStockItem(data, productID);
                    for(let a = 0; a < this.attachedStock.length; a++){
                        if(stockItemID.toString() === this.attachedStock[a].id.toString()){
                            this.attachedStock.splice(a, 1);
                        }
                    }
                }catch(error){
                    console.log(error);
                }
            },

            async getImages(imageInfo){
                let tempImage = await imageStore.loadImages(imageInfo, 'product');
                if(!tempImage.attributes.gallery) {
                    tempImage.attributes.gallery = imageInfo.pivot.gallery
                }

                this.images.push(tempImage);
            },


            async savingNewImage (info, fd, key){

                let data = {
                    'data': {
                        'type': 'images',
                        'attributes': {
                            'title': info.title,
                            'alt_tag': info.alt_tag,
                            'source':'CDN',
                            'thumbnail_source_id':null
                        },
                    }
                };

                try {
                    let cdn = await cdnStore.uploadToCDN(fd);

                    data.data.attributes.source_id = cdn.filename;

                    let tempImage = await imageStore.create(data);

                    let imageProductInfo = await this.saveImageToProduct(tempImage.id, info);

                    tempImage.attributes.gallery = imageProductInfo.attributes.gallery;
                    tempImage.attributes.order = imageProductInfo.attributes.order;

                    this.images.push(tempImage);

                    event.emit(event.names.USER_MESSAGE, 'Your image was uploaded successfully', 'success');
                    event.emit(event.names.UPDATE_UPLOAD_LIST, key);

                } catch (error) {
                    console.log(error);
                    event.emit(event.names.USER_MESSAGE, 'There was a problem uploading your image', 'error');
                }
            },

            async saveImageToProduct(imageID, imageInfo){
                let data = {
                    'data': {
                        'type': 'product-images',
                        'attributes': {
                            'image_id': imageID,
                            'product_id': this.product.id,
                            'gallery':imageInfo.gallery,
                            'order':imageInfo.order
                        }
                    }
                };
                return await imageStore.saveImageToProduct(data);
            },

            async deleteImage(id){
                try {
                    await imageStore.delete(id);

                    for(let a = 0; a < this.images.length; a++){
                        if(this.images[a].id === id){
                            this.images.splice(a, 1);
                        }
                    }

                } catch (error) {
                    console.log(error);
                }

            },


            async updateImage(Images){

                let imageData = {
                    'data':[]
                };

                for(let a = 0; a < Images.length; a++){
                    imageData.data.push({
                        'data':{
                            'id':Images[a].id,
                            'type':'images',
                            'attributes':{
                                'order':Images[a].attributes.order,
                                'gallery':Images[a].attributes.gallery,
                                'title':Images[a].attributes.title,
                                'alt_tag':Images[a].attributes.alt_tag,
                                'source':Images[a].attributes.source,
                                'source_id':Images[a].attributes.source_id
                            }
                        }
                    });
                }

              try{
                  await imageStore.update(Image.id, imageData);
                  event.emit(event.names.USER_MESSAGE, 'Your image was updated successfully', 'success');
              }catch(error){
                  console.log(error);
              }

            },

            async updateProductImageAttributes(image){
                let data = http.createData(this.product);

                for(let a = 0; a < data.data.attributes.images.length; a++){
                    for(let i = 0; i < image.length; i++){
                        if(data.data.attributes.images[a].id.toString() === image[i].id.toString()){
                            data.data.attributes.images[a].pivot.gallery = (image[i].attributes.gallery) ? 1 : 0;
                            data.data.attributes.images[a].pivot.order = image[i].attributes.order;
                        }
                    }
            }

                try {
                    await productStore.update(data, this.product);
                }catch(error){
                    console.log(error);
                }

            },
            //
            // async getDocuments(imageInfo){
            //     this.documents.push(await documentStore.loadDocuments(imageInfo));
            // },

            async savingNewDocument (info, fd, key){
                let data = {
                    'data': {
                        'type': 'documents',
                        'attributes': {
                            'title': info.title,
                            'alt_tag': info.alt_tag,
                            'source':'CDN',
                        },
                    }
                };

                try {

                    let cdn = await cdnStore.uploadToCDN(fd);
                    data.data.attributes.source_id = cdn.filename;

                    let tempDocument = await documentStore.create(data);

                    await this.saveDocumentToProduct(tempDocument.id);

                    this.documents.push(tempDocument);

                    event.emit(event.names.USER_MESSAGE, 'Your document was uploaded successfully', 'success');
                    event.emit(event.names.UPDATE_UPLOAD_LIST, key);

                } catch (error) {
                    console.log(error);
                    event.emit(event.names.USER_MESSAGE, 'There was a problem uploading your document', 'error');
                }
            },

            async saveDocumentToProduct(documentID){
                let data = {
                    'data': {
                        'type': 'product-documents',
                        'attributes': {
                            'document_id': documentID,
                            'product_id': this.product.id
                        }
                    }
                };

                return await documentStore.saveDocumentToProduct(data);
            },

            async updateDocument(document){

                let data = {
                    'data':{
                        'id':document.id,
                        'type':'documents',
                        'attributes':{
                            'title':document.attributes.title,
                            'alt_tag':document.attributes.alt_tag,
                        }
                    }
                };

                try{

                    let newDocDetails = await documentStore.update(document.id, data);

                    for(let y = 0; y < this.documents.length; y++){
                        if(this.documents[y].id.toString() === newDocDetails.id.toString()){
                            this.documents[y].attributes.title = newDocDetails.attributes.title;
                            this.documents[y].attributes.alt_tag = newDocDetails.attributes.title;
                        }
                    }

                    event.emit(event.names.USER_MESSAGE, 'Your document was updated successfully', 'success');
                }catch(error){
                    console.log(error);
                }
            },

            async deleteDocument(id){
                try{
                    await documentStore.delete(id);

                    for(let i = 0; i < this.documents.length; i++){
                        if(this.documents[i].id === id){
                            this.documents.splice(i, 1);
                        }
                    }

                event.emit(event.names.USER_MESSAGE, 'Your document was updated deleted', 'success');
                }catch(error){
                    console.log(error);
                }

            },

            changeTab(tab){
                this.tab = tab;
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>

<style>
.productsStock-Type {
    width: 9% !important;
}
</style>
