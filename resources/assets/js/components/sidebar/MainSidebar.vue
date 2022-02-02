<template>
    <!-- Left side column. contains the logo and sidebar -->
    <aside v-if="user.attributes" :class="{openNav: mobileNav}" class="main-sidebar sidebar-dark-primary">
        <div class="main-sidebar__title">
            Comms Express
        </div>
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <!-- Add icons to the links using the .nav-icon class
                     with font-awesome or any other icon font library -->
                <li class="nav-item has-treeview">
                    <a href="#!/home" :class="getClass('home')" >
                        <i class="fas fa-home"></i>
                        <p>
                            Home
                        </p>
                    </a>
                </li>
                <!--<li class="nav-item has-treeview" v-if="pages.filter(row => row.id === 1).length > 0 || pages.filter(row => row.id === 2).length > 0 || pages.filter(row => row.id === 3).length > 0 || pages.filter(row => row.id === 4).length > 0" :class="{'menu-open' : cmsTab}">-->
                <li class="nav-item has-treeview" :class="{'menu-open' : cmsTab}">

                <a href="#" :class="getClass('cms')" @click="openTab('cms')">
                        <i class="fas fa-store-alt"></i>
                        <p>
                            CMS
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <!--<li class="nav-item has-treeview" v-if="pages.filter(row => row.id === 1).length > 0" :class="{'menu-open' : productTab}">-->
                        <li class="nav-item has-treeview" :class="{'menu-open' : productTab}">

                        <a href="#" :class="getClass('products')" @click="openTab('products')">
                                <p>
                                    Products
                                    <i class="right fa fa-angle-left"></i>
                                </p>
                            </a>
                            <ul class="nav nav-treeview">
                                <!--<li class="nav-item" >-->
                                    <!--<a href="#!/product-dashboard/" :class="{active:tab === 'product-dashboard'}" class="nav-link">-->
                                        <!--<i class="fa fa-circle nav-icon"></i>-->
                                        <!--<p>Products Dashboard</p>-->
                                    <!--</a>-->
                                <!--</li>-->
                                <li class="nav-item">
                                    <a href="#!/products/list" :class="{active:tab === 'view-all-products'}" class="nav-link">
                                        <i class="fa fa-circle nav-icon"></i>
                                        <p>View All Products</p>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="#!/products/create" :class="{active:tab === 'create-product'}" class="nav-link">
                                        <i class="fa fa-circle nav-icon"></i>
                                        <p>Product Creation</p>
                                    </a>
                                </li>
                                <!-- <li class="nav-item">
                                    <a href="#!/productbadges" :class="{active:tab === 'view-all-product-badges'}" class="nav-link">
                                        <i class="fa fa-circle nav-icon"></i>
                                        <p>Product Badges</p>
                                    </a>
                                </li> -->
                                 <li class="nav-item">
                                    <a href="#!/productsashes" :class="{active:tab === 'view-all-product-sashes'}" class="nav-link">
                                        <i class="fa fa-circle nav-icon"></i>
                                        <p>Product Sashes</p>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <!--<li class="nav-item has-treeview" v-if="pages.filter(row => row.id === 2).length > 0" :class="{'menu-open' : categoriesTab}">-->
                        <li class="nav-item has-treeview" :class="{'menu-open' : categoriesTab}">

                        <a href="#" :class="getClass('categories')" @click="openTab('categories')">
                                <p>
                                    Categories
                                    <i class="right fa fa-angle-left"></i>
                                </p>
                            </a>
                            <!--<ul class="nav nav-treeview" v-if="pages.filter(row => row.id === 3).length > 0" >-->
                            <ul class="nav nav-treeview" >

                                <!--<li class="nav-item" >-->
                                    <!--<a href="#!/categories" :class="{active:tab === 'categories-dashboard'}" class="nav-link">-->
                                        <!--<i class="fa fa-circle nav-icon"></i>-->
                                        <!--<p>Categories Dashboard</p>-->
                                    <!--</a>-->
                                <!--</li>-->
                                <li class="nav-item">
                                    <a href="#!/categories/list" :class="{active:tab === 'view-all-categories'}" class="nav-link">
                                        <i class="fa fa-circle nav-icon"></i>
                                        <p>View All Categories</p>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="#!/categories/create" :class="{active:tab === 'create-categories'}" class="nav-link">
                                        <i class="fa fa-circle nav-icon"></i>
                                        <p>Create New Category</p>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <!--<li class="nav-item has-treeview" v-if="pages.filter(row => row.id === 3).length > 0" :class="{'menu-open' : brandsTab}">-->
                        <li class="nav-item has-treeview" :class="{'menu-open' : brandsTab}">

                        <a href="#" :class="getClass('brands')" @click="openTab('brands')">
                                <p>
                                    Brands
                                    <i class="right fa fa-angle-left"></i>
                                </p>
                            </a>
                            <ul class="nav nav-treeview">
                                <li class="nav-item">
                                    <a href="#!/brands" :class="{active:tab === 'view-all-brands'}" class="nav-link">
                                        <i class="fa fa-circle nav-icon"></i>
                                        <p>View All Brands</p>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="#!/brands/create" :class="{active:tab === 'brands-create'}" class="nav-link">
                                        <i class="fa fa-circle nav-icon"></i>
                                        <p>Create New Brand</p>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <!--<li class="nav-item has-treeview" v-if="pages.filter(row => row.id === 4).length > 0" :class="{'menu-open' : pagesTab}">-->
                        <li class="nav-item has-treeview" :class="{'menu-open' : pagesTab}">

                        <a href="#" :class="getClass('pages')" @click="openTab('pages')">
                                <p>
                                    Content
                                    <i class="right fa fa-angle-left"></i>
                                </p>
                            </a>
                            <ul class="nav nav-treeview">
                                <li class="nav-item" >
                                    <a href="#!/pages/home-page" :class="{active:tab === 'home-page-content'}" class="nav-link">
                                        <i class="fa fa-circle nav-icon"></i>
                                        <p>Home Page</p>
                                    </a>
                                </li>

                                <li class="nav-item" >
                                    <a href="#!/pages/home-promotions" :class="{active:tab === 'home-promotions'}" class="nav-link">
                                        <i class="fa fa-circle nav-icon"></i>
                                        <p>Home Promotions</p>
                                    </a>
                                </li>
                                <!--<li class="nav-item" >-->
                                    <!--<a href="#!/footer" :class="{active:tab === 'footer'}" class="nav-link">-->
                                        <!--<i class="fa fa-circle nav-icon"></i>-->
                                        <!--<p>Website Footer</p>-->
                                    <!--</a>-->
                                <!--</li>-->
                            </ul>
                        </li>
                          <li class="nav-item has-treeview" :class="{'menu-open' : templatesTab}">
                        <!--<li class="nav-item has-treeview" v-if="pages.filter(row => row.id === 10).length > 0" :class="{'menu-open' : templatesTab}">-->

                        <a href="#" :class="getClass('templates')" @click="openTab('templates')">
                                <p>
                                    Email Templates
                                    <i class="right fa fa-angle-left"></i>
                                </p>
                            </a>
                            <ul class="nav nav-treeview">
                                <li class="nav-item" >
                                    <a href="#!/templates/list" :class="{active:tab === 'view-all-templates'}" class="nav-link">
                                        <i class="fa fa-circle nav-icon"></i>
                                        <p>All Templates</p>
                                    </a>
                                </li>

                                <li class="nav-item" >
                                    <a href="#!/templates/create" :class="{active:tab === 'template-create'}" class="nav-link">
                                        <i class="fa fa-circle nav-icon"></i>
                                        <p>Create New Template</p>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li class="nav-item has-treeview" :class="{'menu-open' : glossaryTab}">
                            <a href="#" :class="getClass('glossary')" @click="openTab('glossary')">
                                <p>
                                    Glossary
                                    <i class="right fa fa-angle-left"></i>
                                </p>
                            </a>
                            <ul class="nav nav-treeview">
                                <li class="nav-item" >
                                    <a href="#!/glossary/terms" :class="{active:tab === 'view-all-terms'}" class="nav-link">
                                        <i class="fa fa-circle nav-icon"></i>
                                        <p>Glossary Terms</p>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li class="nav-item has-treeview" :class="{'menu-open' : finderTab}">
                            <a href="#" :class="getClass('finder')" @click="openTab('finders')">
                                <p>
                                    Express Finder
                                    <i class="right fa fa-angle-left"></i>
                                </p>
                            </a>
                            <ul class="nav nav-treeview">
                                <li class="nav-item" >
                                    <a href="#!/express-finder" :class="{active:tab === 'finder-list'}" class="nav-link">
                                        <i class="fa fa-circle nav-icon"></i>
                                        <p>Express Finders</p>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li class="nav-item has-treeview" :class="{'menu-open' : inventoryTab}">
                    <a href="#" :class="getClass('inventory')" @click="openTab('inventory')">
                        <i class="fas fa-box-open"></i>
                        <p>
                            Inventory
                        </p>
                    </a>
                    <ul  class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="#!/inventory/view-stock" :class="{active:tab === 'view-all-inventory'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>View All Inventory</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#!/inventory/stock-creation"  :class="{active:tab === 'create-inventory'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Inventory Creation</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#!/groups/view-all"  :class="{active:tab === 'view-all-groups'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Inventory Groups</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#!/inventory/predefined-attributes" :class="{active:tab === 'view-all-predefined-attributes'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Predefined Attributes</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#!/delivery-types"  :class="{active:tab === 'delivery-types'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Delivery Types</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#!/stock-availability"  :class="{active:tab === 'stock-availabilty'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Stock Availability</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#!/price-importer"  :class="{active:tab === 'price-importer'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Price Importer</p>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="nav-item has-treeview"  :class="{'menu-open' : marketingTab}">
                    <a href="#" :class="getClass('marketing')" @click="openTab('marketing')">
                        <i class="fas fa-poll"></i>
                        <p>
                            Marketing
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="#!/marketing/campaigns/1"  :class="{active:tab === 'view-all-campaigns'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Campaigns</p>
                            </a>
                            <a href="#!/marketing/free-gifts"  :class="{active:tab === 'view-all-freegifts'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Free Gifts</p>
                            </a>
                            <a href="#!/marketing/donations"  :class="{active:tab === 'view-all-donations'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Donations</p>
                            </a>
                            <a href="#!/marketing/promotion-banners"  :class="{active:tab === 'view-all-promotion-banners'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Promotion Banners</p>
                            </a>
                        </li>
                    </ul>
                </li>

                <li class="nav-item has-treeview" :class="{'menu-open' : customerTab}">
                    <a href="#" :class="getClass('customers')" @click="openTab('customers')">
                        <i class="fas fa-users"></i>
                        <p>
                            Customer Accounts
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="#!/customers/accounts/list" :class="{active:tab === 'customer_accounts'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Customer Accounts</p>
                            </a>
                        </li>
                    </ul>
                </li>

                <li  class="nav-item has-treeview" v-if="pages.filter(row => row.id === 9).length > 0" :class="{'menu-open' : settingsTab}">
                    <a :class="getClass('settings')" @click="openTab('settings')" style="color: rgba(255, 255, 255, 0.25);">
                        <i class="fas fa-cogs"></i>
                        <p>
                            Settings
                        </p>
                    </a>
                    <ul class="nav-item nav-treeview">
                        <li class="nav-item">
                            <a href="#!/settings/user-logs" :class="{active:tab === 'user-logs'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>User Logs</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#!/settings/user-permissions" :class="{active:tab === 'user-permissions'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Users</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#!/settings/cdn-restore" :class="{active:tab === 'view-all-cdn-settings'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>CDN Restore</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#!/settings/es-settings" :class="{active:tab === 'view-all-search-settings'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Search Settings</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#!/settings/department-permissions" :class="{active:tab === 'department-permissions'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Department Permissions</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#!/settings/fraud-prevention" :class="{active:tab === 'view-all-fraud-types'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Fraud Prevention</p>
                            </a>
                        </li>
                    </ul>
                </li>
                <li  class="nav-item has-treeview" v-if="pages.filter(row => row.id === 9).length > 0" :class="{'menu-open' : uploaderTab}">
                    <a :class="getClass('uploader')" @click="openTab('uploader')" style="color: rgba(255, 255, 255, 0.25);">
                        <i class="fas fa-upload"></i>
                        <p>Uploader</p>
                    </a>
                    <ul class="nav-item nav-treeview">
                        <li class="nav-item">
                            <a href="#!/image-uploader" :class="{active:tab === 'image-uploader'}" class="nav-link">
                                <i class="fa fa-circle nav-icon"></i>
                                <p>Image Uploader</p>
                            </a>
                        </li>

                    </ul>
                </li>
                <li class="nav-item has-treeview">
                    <a href="#!/publish" :class="getClass('publish')" style="color: rgba(255, 255, 255, 0.25);">
                        <i class="fas fa-newspaper"></i>
                        <p>Publish</p>
                    </a>
                </li>
                <li class="nav-item has-treeview">
                    <a @click="logout()" :class="getClass('logout')" style="color: rgba(255, 255, 255, 0.25);">
                        <i class="fas fa-sign-out-alt"></i>
                        <p>Log Out</p>
                    </a>
                </li>

            </ul>
        </nav>
    </aside>
</template>

<script>
    import {event, ls} from '@/services';
    import {userStore, pagesStore} from '@/stores';
    export default {
        data() {
            return {
                access: [],
                currentView: 'home', // Default view
                tab:'home', //Default
                productTab: false,
                inventoryTab:false,
                cmsTab: false,
                mobileNav: false,
                categoriesTab: false,
                marketingTab: false,
                brandsTab: false,
                footerTab: false,
                pagesTab: false,
                pages: ls.get('pages'),
                settingsTab: false,
                templatesTab: false,
                imageUploader:false,
                customerTab:false,
                uploaderTab:false,
                glossaryTab:false,
                finderTab:false,
                user: []
            }
        },

        async mounted(){
            // await pagesStore.checkLoading()
            // await userStore.checkLoading();
            event.on(event.names.MOBILE_NAV_CHANGE, (navPosition)=>{
                this.mobileNav = navPosition
            });

            this.user = await userStore.getUserByID(ls.get('user'));

        },

        methods: {

            getClass(modifier) {
                return [
                    'nav-link',
                    'main-sidebar__link',
                    'main-sidebar__link--' + modifier,
                    {'active': this.currentView === modifier}
                ];
            },

            openTab(tab){
                if(tab === 'products'){
                    this.productTab = !this.productTab
                }else if(tab === 'inventory'){
                    this.inventoryTab = !this.inventoryTab;
                }else if(tab === 'categories'){
                   this.categoriesTab = !this.categoriesTab;
                }else if(tab === 'cms'){
                    this.cmsTab = !this.cmsTab;
                }else if (tab === 'marketing'){
                    this.marketingTab = !this.marketingTab
                }else if (tab === 'brands'){
                    this.brandsTab = !this.brandsTab
                }else if (tab === 'footer'){
                    this.footerTab = !this.footerTab
                }else if (tab === 'pages'){
                    this.pagesTab = !this.pagesTab
                }else if (tab === 'settings'){
                    this.settingsTab = !this.settingsTab
                }else if (tab === 'templates'){
                    this.templatesTab = !this.templatesTab
                }else if (tab === 'imageUploader'){
                    this.imageUploader = !this.imageUploader
                }else if (tab === 'customers'){
                    this.customerTab = !this.customerTab
                }else if(tab === 'uploader'){
                    this.uploaderTab = !this.uploaderTab
                }else if(tab === 'glossary'){
                    this.glossaryTab = !this.glossaryTab
                }else if(tab === 'finders'){
                    this.finderTab = !this.finderTab
                }

            },

            logout() {
                event.emit(event.names.LOG_OUT);
            }
        },
        async created() {
            if(ls.get('pages') == null) {
                this.logout();
            }
            await userStore.checkLoading();
            event.on(event.names.LOAD_MAIN_CONTENT, view => this.currentView = view);
            event.on(event.names.LOAD_TAB, view => this.tab = view);
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    i {
        margin-right: 15px;
        font-size:20px;
    }

    .main-sidebar {
        flex: 0 0 $sidebar-width;
        background-color: $color-sidebar-bgr;
        z-index:1000;
        position: fixed !important;
        top: 0;

        &__title {
            font-size: 2rem;
            color: $color-white;
            letter-spacing: 1px;
            padding: 1rem 0;
            text-align: center;
        }

        &__link {
            display: block;
            line-height: 3.5rem;
            font-size: 1.4rem;
            border-left: .5rem solid transparent;
            padding: 0 1.6rem 0 1.6rem;
            font-weight:normal;
            color:#ffffff;
            cursor: pointer;


            &--active a{
                color:#000000 !important;
            }

            &:hover {
                background-color: rgba($color-white, .2);
                color: $color-link-hovered;
                border-left-color: $color-highlight;
                font-weight:bold;
            }

            &--active, &--active:hover{
                background-color: #4098f7 !important;
                font-weight:normal !important;
            }

            &:active {
                opacity: .7;
            }

            &--active::before {
                color:#000000;
            }

            ul{
                margin-left:4rem;
                font-size:1.2rem;
            }
        }
    }
</style>