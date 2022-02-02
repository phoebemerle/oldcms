<template>
    <div class="main-sections__editForm">
        <div v-show="subview === 'edit-express-finder'" class="overviewTabs">
            <ul class="list-inline">
                <li v-bind:class="{ activeTab: tab === 'details' }" @click="changeTab('details')">Express Finder Name</li>
                <li v-bind:class="{ activeTab: tab === 'categories' }" @click="changeTab('categories')" >Categories</li>
                <li v-bind:class="{ activeTab: tab === 'products' }" @click="changeTab('products')">Products</li>
            </ul>
        </div>
        <div class="main-sections__editForm__container">
            <express-finder-details v-show="tab === 'details'" :finder="finder"></express-finder-details>
            <express-finder-categories v-show="tab === 'categories'" :finder="finder"></express-finder-categories>
            <express-finder-products  v-show="tab === 'products'" :finder="finder"></express-finder-products>
        </div>
    </div>
</template>

<script>
    import ExpressFinderDetails from "./expressFinderDetails";
    import ExpressFinderCategories from "./expressFinderCategories";
    import {finderStore} from '@/stores';
    import ExpressFinderProducts from "./expressFinderProducts";


    export default {
        name: "expressFinderEdit",
        components: {ExpressFinderProducts, ExpressFinderCategories, ExpressFinderDetails},

        props:['finder', 'subview'],

        data(){
            return{
                tab:'products',
            }
        },

        methods:{
            changeTab(tab){
                this.tab = tab;
            },
        }
    }
</script>
