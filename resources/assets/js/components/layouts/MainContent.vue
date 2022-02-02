<template>
    <section class="content-wrapper">
        <div :class="{openBurger: changeMenu}" class="burgerContainer" @click="burgerMenu()">
            <div :class="{change: changeMenu}" class="bar1"></div>
            <div :class="{change: changeMenu}" class="bar2"></div>
            <div :class="{change: changeMenu}" class="bar3"></div>
        </div>
        <publish-view v-show="currentView === 'publish'" />
        <home-view v-show="currentView === 'home'" />
        <products v-show="currentView === 'products'" :subview="subView" :product="item" :pagenum="pageNum"/>
        <inventory v-show="currentView === 'inventory'" :subview="subView" :item="item" :pagenum="pageNum"/>
        <delivery-type v-show="currentView === 'deliverytypes'" :subview="subView" :deliverytype="item"></delivery-type>
        <categories v-show="currentView === 'categories'" :subview="subView" :item="item" :pagenum="pageNum"/>
        <campaigns v-show="currentView === 'campaigns'" :subview="subView" :campaign="item" :pagenum="pageNum"></campaigns>
        <brands v-show="currentView === 'brands'" :subview="subView" :brand="item" :pagenum="pageNum"></brands>
        <footer-info v-show="currentView === 'footer'" :subview="subView" :footerinfo="item"></footer-info>
        <templates v-show="currentView === 'email-templates'" :template="item" :subview="subView"></templates>
        <home-page v-show="currentView === 'homePage'" :content="item"></home-page>
        <free-gifts v-show="currentView === 'free-gifts'" :freeGift="item" :subview="subView"></free-gifts>
        <promotion-banners v-show="currentView === 'promotion-banners'" :banner="item" :subview="subView"></promotion-banners>
        <home-promos v-show="currentView === 'home-promotions'" :subview="subView"></home-promos>
        <user-logs v-show="currentView === 'user-logs'" :subview="subView" :userLogs="item"></user-logs>
        <predefined-attribute v-show="currentView === 'predefined-attributes'" :attribute="item" :subview="subView"></predefined-attribute>
        <user-permissions v-show="currentView === 'user-permissions'" :user="item" :subview="subView"></user-permissions>
        <department-permissions v-show="currentView === 'department-permissions'" :subview="subView"></department-permissions>
        <fraud-prevention v-show="currentView === 'fraudtypes'" :subview="subView"></fraud-prevention>
        <stock-availability v-show="currentView === 'stock-availability'" :stockAvailability="item[0]" :subview="subView"></stock-availability>
        <loading-overlay v-show="loading"/>
        <stock-item-modal v-show="stockModal" :modalType="modalType" ></stock-item-modal>
        <image-uploader v-show="currentView === 'imageUploader'"/>
        <price-importer v-show="currentView === 'priceImporter'"/>
        <search-settings v-show="currentView === 'search-settings-view'"/>
        <cdn-restore v-show="currentView === 'cdn-settings-view'"/>
        <customer-view v-show="currentView === 'customers' " :view="subView" :item="item"/>
        <donations v-show="currentView === 'donations'" :subview="subView" :donation="item"/>
        <glossary-view v-show="currentView === 'glossary-terms'" :subview="subView" :terms="item"></glossary-view>
        <express-finder-view v-show="currentView === 'express-finder'" :subview="subView" :finders="item"></express-finder-view>


    </section>
</template>

<script>
    import {event} from '@/services';
    import PublishView from '@/components/publish/PublishView'
    import HomeView from '@/components/home/HomeView';
    import Products from '@/components/products/ProductsView';
    import FreeGifts from '@/components/marketing/free-gifts/FreeGiftsView';
    import Donations from '@/components/marketing/donations/DonationsView';
    import PromotionBanners from '@/components/marketing/promotion-banners/PromotionBannersView';
    import Inventory from '@/components/inventory/InventoryView';
    import Categories from '@/components/categories/CategoriesView';
    // import Marketing from '@/components/marketing/MarketingView';
    import Campaigns from '@/components/marketing/CampaignsView';
    import Brands from '@/components/brands/BrandsView';
    import FooterInfo from '@/components/footer/FooterView';
    import LoadingOverlay from '@/components/shared/loadingOverlay';
    import HomePage from '@/components/pages/homePage/mainPage';
    import UserLogs from '@/components/settings/userLogs/UserLogsView';
    import PredefinedAttribute from '@/components/PredefinedAttribute/PredefinedAttributeView';    
    import UserPermissions from '@/components/settings/userPermissions/UserPermissionsView';
    import DepartmentPermissions from '@/components/settings/departmentPermissions/DepartmentPermissionsView';
    import FraudPrevention from '@/components/settings/fraudPrevention/FraudPreventionView';
    import HomePromos from '@/components/pages/homePromotions/homePromosMain';
    import DeliveryType from '@/components/inventory/deliverytypes/DeliveryTypeView';
    import StockAvailability from '@/components/inventory/stockAvailability/StockAvailabilityView';
    import Templates from '@/components/Templates/TemplatesView';
    import StockItemModal from '@/components/marketing/campaigns/promotions/StockItemModal';
    import ImageUploader from '@/components/shared/ImageUploader';
    import SearchSettings from '@/components/settings/searchSettings/SearchSettingsView';
    import CustomerView from '@/components/customers/CustomerView';
    import CdnRestore from '@/components/settings/cdn/CdnSettingsView';
    import PriceImporter from '@/components/price/PriceImporter';
    import GlossaryView from '@/components/glossary/GlossaryView';
    import ExpressFinderView from "../expressFinder/expressFinderView";

    export default {

        components: {
            ExpressFinderView, Donations, PublishView, FraudPrevention, StockItemModal, HomeView, Products, Inventory, Categories , Campaigns, Brands, FooterInfo, LoadingOverlay,
            HomePage, FreeGifts, UserLogs, UserPermissions, DepartmentPermissions, PredefinedAttribute, HomePromos, DeliveryType, StockAvailability,
            Templates, ImageUploader, SearchSettings, PromotionBanners, CdnRestore, CustomerView, PriceImporter, GlossaryView},

        data() {
            return {
                currentView: 'home', // Default view
                subView:'',
                item:'',
                changeMenu:false,
                loading: false,
                pageNum:'',
                stockModal: false,
                modalType:'primary'
            }
        },

        created() {
            event.on(event.names.LOAD_MAIN_CONTENT, (view, subView, ...args) => {

            event.emit(event.names.UPDATE_NAVIGATION_VIEW, subView);

                this.currentView = view;
                this.subView = subView;

                if(view === 'categories' || view === 'products' || view === 'inventory' || view === 'brands' || view === 'campaigns' || view === 'express-finder'){
                    if(args.length > 0) {
                        this.item = args[0];
                        this.pageNum = args[1];
                    }
                }else {
                    this.item = args;
                }
            });

            event.on(event.names.LOADING, (state) => {
                this.loading = state;
            });

            event.on(event.names.OPEN_STOCK_MODAL, (modal, type) => {
                this.stockModal = modal;
                this.modalType = type
            })
        },

        methods:{
            burgerMenu(){
               this.changeMenu = !this.changeMenu;
                event.emit(event.names.MOBILE_NAV_CHANGE, this.changeMenu);
            }
        }
    }
</script>

<style lang="scss">
    .main-content {
        display: flex;
        flex: 1;
    }


</style>