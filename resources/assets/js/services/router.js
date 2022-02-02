import {loadMainContent, loadSubContent} from '@/utils';
import {inventoryStore, productGroupsStore, productStore, stockSuppliersStore, imageStore} from "@/stores";
import {categoryStore, attributeStore, cdnStore, campaignStore, promotionsStore, brandsStore} from '@/stores';
import {homePageStore, freeGiftStore, homePromosStore, footerContactInfoStore, logPagesStore, departmentStore, predefinedAttributeStore, attributeTypeStore, promotionBannerStore} from '@/stores';
import {pagesStore, templateStore, customerStore} from '@/stores';
import {event, ls} from '@/services';
import {sharedStore} from "../stores/shared";
import {
    supplierStore, userStore, deliveryTypeStore, productBadgesStore, stockAvailabilityStore, productSashesStore,
    mainBannerStore, fraudTypeStore, fraudInfoStore, donationStore, glossaryStore, publishStore, finderStore
} from "../stores";

export const router = {
    routes: {

        async '/publish'() {
            loadMainContent('publish', 'view-all-publish');
        },

        '/stock-availability'() {
            // if(ls.get('pages').filter(row => row.id === 5).length > 0) {
            stockAvailabilityStore.checkLoading();
            loadMainContent('stock-availability', 'stock-availability-list');
            // }
        },

        async '/templates/list'() {
            // if(ls.get('pages').filter(row => row.id === 10).length > 0) {
            await templateStore.checkLoading();
            loadMainContent('email-templates', 'view-all-templates');
            // }
        },

        async '/templates/edit/([a-z_0-9]+)'(params) {
            // if(ls.get('pages').filter(row => row.id === 10).length > 0) {
            let template = await templateStore.getTemplateByID(parseInt(params[0]));
            template && loadMainContent('email-templates', 'template-edit', template);
            // }
        },

        '/templates/create'() {
            // if(ls.get('pages').filter(row => row.id === 10).length > 0) {
            loadMainContent('email-templates', 'template-create');
            // }
        },

        '/stock-availability/create'() {
            // if(ls.get('pages').filter(row => row.id === 5).length > 0) {
            loadMainContent('stock-availability', 'stock-availability-create');
            // }
        },

        async '/stock-availability/edit/([a-z_0-9_-]+)'(params) {
            // if(ls.get('pages').filter(row => row.id === 5).length > 0) {
                await stockAvailabilityStore.checkLoading();
                const stockAvailability = stockAvailabilityStore.getStockAvailabilityByID(params[0]);
                stockAvailability && loadMainContent('stock-availability', 'stock-availability-edit', stockAvailability);
            // }
        },

        '/home'() {
            loadMainContent('home', '');
        },
        async '/product-dashboard'() {
                // if (ls.get('pages').filter(row => row.id === 1).length > 0) {
                    // let products = await productStore.loadCheck(parseInt(params[0]));
                    loadMainContent('products', 'product-dashboard');
                // }
        },
        async '/pages/home-promotions'() {
            // if (ls.get('pages').filter(row => row.id === 4).length > 0) {
                await homePromosStore.loadCheck();
                loadMainContent('home-promotions', 'view-all-home-promotions');
            // }
        },

        // async '/products/list/([a-z_0-9_-]+)'(params){
        //     if(ls.get('pages').filter(row => row.id === 1).length > 0) {
        //         let products = await productStore.loadCheck(parseInt(params[0]));
        //         loadMainContent('products', 'view-all-products', products, parseInt(params[0]));
        //         sharedStore.hideLoadingPage();
        //     }
        // },

        async '/products/list'(){
            // if(ls.get('pages').filter(row => row.id === 1).length > 0) {
                // let products = await productStore.loadCheck(parseInt(params[0]));
                loadMainContent('products', 'view-all-products');
                sharedStore.hideLoadingPage();
            // }
        },
        async '/products/create'(){
            // if(ls.get('pages').filter(row => row.id === 1).length > 0) {
                loadMainContent('products', 'create-product');
            // }
        },
        async '/products/edit/([a-z_0-9_-]+)'(params) {
            // if(ls.get('pages').filter(row => row.id === 1).length > 0) {
                await productBadgesStore.checkLoading();
                await productSashesStore.checkLoading();
                const foundProduct = await productStore.productByID(parseInt(params[0]));
                foundProduct && loadMainContent ('products', 'edit-product', foundProduct);
            // }
        },

        async '/categories/list'(){
            // if(ls.get('pages').filter(row => row.id === 2).length > 0) {
            loadMainContent('categories', 'view-all-categories');
            sharedStore.hideLoadingPage();
            // }
        },
        async '/categories/edit/([a-z_0-9_-]+)'(params) {
            // if(ls.get('pages').filter(row => row.id === 2).length > 0) {
            const foundCategory = await categoryStore.categoryByID(parseInt(params[0]));
            foundCategory && loadMainContent ('categories', 'edit-category', foundCategory);
            // }
        },
        '/categories/create'(){
            // if(ls.get('pages').filter(row => row.id === 2).length > 0) {
                categoryStore.loadCheck(1);
                loadMainContent('categories', 'create-category');
            // }
        },
        async '/inventory/([a-z_0-9_-])'(params) {
                let inventoryItems = await inventoryStore.loadCheck(parseInt(params[0]));
                loadMainContent('inventory', 'inventory-dashboard', inventoryItems, parseInt(params));
        },
        '/inventory/stock-creation'() {
            deliveryTypeStore.checkLoading();
                // inventoryStore.checkLoad();
                loadMainContent('inventory', 'create-inventory');
        },
        async '/inventory/view-stock'() {
                loadMainContent('inventory', 'view-all-inventory');
        },

        async '/customers/accounts/list'() {
            loadMainContent('customers', 'account-list');
        },

        async '/customer/accounts/edit/([a-z_0-9_-]+)'(params) {
            let customer = await customerStore.searchState(parseInt(params[0]), 'id');
            loadMainContent('customers', 'edit-account', customer[0]);
        },

        async '/inventory/predefined-attributes'() {
                await attributeTypeStore.checkLoading();
                loadMainContent('predefined-attributes', 'view-all-predefined-attributes');
        },

        async '/inventory/predefined-attributes/create'() {
            await attributeStore.checkAttributes();
            await attributeTypeStore.checkLoading();
            // if(ls.get('pages').filter(row => row.id === 5).length > 0) {
                loadMainContent('predefined-attributes', 'create-predefined-attributes');
            // }
        },

        async '/productbadges'(){
            await productBadgesStore.checkLoading();
            loadMainContent('products', 'view-all-product-badges');
        },

        '/productbadges/create'() {
            loadMainContent('products', 'create-product-badge');
        },

        async '/productbadges/edit/([a-z_0-9_-]+)'(prams) {
            productBadgesStore.checkLoading();
            const productbadge = await productBadgesStore.badgeByID(parseInt(prams[0]));
            loadMainContent('products', 'product-badge-details', productbadge);
        },

        async '/productsashes'() {
            await productSashesStore.checkLoading();
            loadMainContent('products', 'view-all-product-sashes');
        },

        '/productsashes/create'() {
            loadMainContent('products', 'create-product-sash');
        },

        async '/productsashes/edit/([a-z_0-9_-]+)'(prams) {
            await productSashesStore.checkLoading();
            await productStore.loadCheck(1);
            const productsash = productSashesStore.sashByID(parseInt(prams[0]));
            loadMainContent('products', 'product-sash-details', productsash);
        },

        async '/inventory/predefined-attributes/edit/([a-z_0-9_-]+)'(params) {
            await predefinedAttributeStore.checkLoading();
            await attributeStore.checkAttributes();
            await attributeTypeStore.checkLoading();
            if(ls.get('pages').filter(row => row.id === 5).length > 0) {
                const attribute = await attributeTypeStore.getAttributeType(params[0])
                attribute && loadMainContent('predefined-attributes', 'edit-predefined-attributes', attribute);
            }
        },

        async '/inventory/edit/([a-z_0-9_-]+)'(params) {
            // if(ls.get('pages').filter(row => row.id === 5).length > 0) {
            await attributeTypeStore.checkLoading();
            await predefinedAttributeStore.checkLoading();
            await stockAvailabilityStore.checkLoading();
            await deliveryTypeStore.checkLoading();
            await productGroupsStore.checkLoad();
            supplierStore.checkLoading();
            const stockItem = await inventoryStore.stockItemByID(parseInt(params[0]));
            stockItem && loadMainContent ('inventory', 'edit-stock', stockItem);
            // }
        },
        async '/groups/view-all'() {
            loadMainContent('inventory', 'view-all-groups');
        },

        async '/delivery-types'(){
            // if(ls.get('pages').filter(row => row.id === 5).length > 0) {
                deliveryTypeStore.checkLoading();
                loadMainContent('deliverytypes', 'delivery-types');
            // }
        },

        '/delivery-types/edit/([a-z_0-9_-]+)'(prams){
            deliveryTypeStore.checkLoading();
            const deliverytype = deliveryTypeStore.deliveryTypeByID(parseInt(prams[0]));
            loadMainContent('deliverytypes', 'edit-delivery-type', deliverytype);
        },

        '/delivery-types/create'(){
            deliveryTypeStore.checkLoading();
            loadMainContent('deliverytypes', 'create-delivery-type');
        },

        '/settings/user-logs'() {
            // if(ls.get('pages').filter(row => row.id === 9).length > 0) {
            logPagesStore.checkLoading();
            loadMainContent('user-logs', 'view-all-user-logs');
            // }
        },

        '/settings/cdn-restore'() {
            // if(ls.get('pages').filter(row => row.id === 9).length > 0) {
                logPagesStore.checkLoading();
                loadMainContent('cdn-settings-view', 'view-all-cdn-settings');
            // }
        },

        '/settings/es-settings'() {
            // if(ls.get('pages').filter(row => row.id === 9).length > 0) {
                logPagesStore.checkLoading();
                loadMainContent('search-settings-view', 'view-all-search-settings');
            // }
        },

        async '/settings/user-permissions/([a-z_0-9_-]+)/edit'(params) {
            // if(ls.get('pages').filter(row => row.id === 9).length > 0) {
                await userStore.checkLoading();
                const user = await userStore.getUserByID(params[0])
                user && loadMainContent('user-permissions', 'edit-user-permissions', user);
            // }
        },

        '/settings/user-permissions'() {
            // if(ls.get('pages').filter(row => row.id === 9).length > 0) {
                userStore.checkLoading();
                loadMainContent('user-permissions', 'view-all-user-permissions');
            // }
        },


        async '/settings/department-permissions'() {
            // if(ls.get('pages').filter(row => row.id === 9).length > 0) {
                await departmentStore.checkLoading();
                await pagesStore.checkLoading();
                loadMainContent('department-permissions', 'view-all-department-permissions');
            // }
        },

        async '/settings/fraud-prevention'() {
            // if (ls.get('pages').filter(row => row.id === 9).length > 0) {
                await fraudTypeStore.checkLoading();
                await fraudInfoStore.checkLoading();
                loadMainContent('fraudtypes', 'view-all-fraud-types');
            // }
        },

        '/settings/user-permissions/create'() {
            // if(ls.get('pages').filter(row => row.id === 9).length > 0) {
                userStore.checkLoading();
                loadMainContent('user-permissions', 'create-user-permissions');
            // }
        },

        async '/settings/user-logs/([a-z_0-9_-]+)/list'(params) {
            // if(ls.get('pages').filter(row => row.id === 9).length > 0) {
                await logPagesStore.checkLoading();
                const userLogList = await logPagesStore.logsByType(parseInt(params[0]));
                userLogList && loadMainContent('user-logs', 'view-selected-user-logs', userLogList);
            // }
        },

        async '/groups/edit/([a-z_0-9_-]+)'(params) {
            // if(ls.get('pages').filter(row => row.id === 6).length + ls.get('pages').filter(row => row.id === 7).length > 0) {
                const group = await productGroupsStore.byGroupID(parseInt(params[0]));
                group && loadMainContent ('inventory', 'edit-group', group);
            // }
        },
        '/groups/create'() {
            // if(ls.get('pages').filter(row => row.id === 6).length + ls.get('pages').filter(row => row.id === 7).length > 0) {
                productGroupsStore.checkLoad();
                inventoryStore.loadCheck(1);
                loadMainContent('inventory', 'create-group');
            // }
        },
        '/attributes'() {
            loadMainContent('attributes', 'attributes-stock-list');
        },
        '/attributes/([a-z_0-9_-]+)'(params) {
            const stockItem = inventoryStore.stockItemByID(parseInt(params[0]));
            stockItem && loadMainContent ('attributes', 'edit-attribute', stockItem);
        },
        async '/marketing/campaigns/([a-z_0-9_-])'(params){
            // if(ls.get('pages').filter(row => row.id === 8).length > 0) {
                let campaigns = await campaignStore.loadCheck(parseInt(params[0]));
                loadMainContent('campaigns', 'view-all-campaigns', campaigns, parseInt(params[0]));
            // }
        },
        async '/marketing/campaign/edit/([a-z_0-9_-]+)'(params) {
            // if(ls.get('pages').filter(row => row.id === 8).length > 0) {
                const campaign = await campaignStore.campaignByID(parseInt(params[0]));
                campaign && loadMainContent ('campaigns', 'edit-campaign', campaign);
            // }
        },
        '/marketing/campaigns/create'(){
            // if(ls.get('pages').filter(row => row.id === 8).length > 0) {
                loadMainContent('campaigns', 'create-campaign');
            // }
        },

        async '/marketing/donations'(){
            // if(ls.get('pages').filter(row => row.id === 8).length > 0) {
                await donationStore.checkLoading()
                loadMainContent('donations', 'view-all-donations');
            // }
        },

        async '/marketing/donations/create'(){
            // if(ls.get('pages').filter(row => row.id === 8).length > 0) {
                loadMainContent('donations', 'create-donation');
            // }
        },


        async '/marketing/donations/edit/([a-z_0-9_-]+)'(params) {
            // if(ls.get('pages').filter(row => row.id === 8).length > 0) {
                await donationStore.checkLoading()
                const donation = await donationStore.donationByID(parseInt(params[0]));
                loadMainContent('donations', 'edit-donation', donation);
            // }
        },

        async '/marketing/promotion-targets/([a-z_0-9_-]+)'(params) {
            // if(ls.get('pages').filter(row => row.id === 8).length > 0) {
                // await productStore.loadCheck(1);
                await brandsStore.loadCheck(1);
                // await categoryStore.loadCheck(1);
                await productGroupsStore.loadCheck(1);
                await inventoryStore.loadCheck(1);
                const promotion = await promotionsStore.promotionByID(parseInt(params[0]));
                loadMainContent('campaigns', 'promotion-targets', promotion);
            // }
        },

        // async '/brands/([a-z_0-9_-])'(params){
        //     if(ls.get('pages').filter(row => row.id === 3).length > 0) {
        //         let brands = await brandsStore.loadCheck(parseInt(params[0]));
        //         loadMainContent('brands', 'view-all-brands', brands, parseInt(params[0]));
        //     }
        // },

        async '/brands'(){
            // if(ls.get('pages').filter(row => row.id === 3).length > 0) {
                loadMainContent('brands', 'view-all-brands',);
            // }
        },

        '/brands/create'(){
            // if(ls.get('pages').filter(row => row.id === 3).length > 0) {
                loadMainContent('brands', 'brands-create');
            // }
        },

        '/marketing/free-gifts'(){
            // if(ls.get('pages').filter(row => row.id === 7).length > 0) {
                freeGiftStore.checkLoading();
                loadMainContent('free-gifts', 'view-all-freegifts');
            // }
        },
        '/marketing/free-gifts/create'(){
            // if(ls.get('pages').filter(row => row.id === 7).length > 0) {
                freeGiftStore.checkLoading();
                loadMainContent('free-gifts', 'create-freegifts');
            // }
        },
        async '/marketing/free-gifts/edit/([a-z_0-9_-]+)'(params) {
            // if(ls.get('pages').filter(row => row.id === 7).length > 0) {
                freeGiftStore.checkLoading();
                const freeGift = await freeGiftStore.freeGiftByID(parseInt(params[0]));
                freeGift && loadMainContent('free-gifts', 'edit-freegifts', freeGift);
            // }
        },

        async '/marketing/promotion-banners'() {
            // if (ls.get('pages').filter(row => row.id === 7).length > 0) {
                await promotionBannerStore.checkLoading();
                loadMainContent('promotion-banners', 'view-all-promotion-banners');
            // }
        },

        async '/marketing/promotion-banners/edit/([a-z_0-9_-]+)'(params) {
            // if (ls.get('pages').filter(row => row.id === 7).length > 0) {
                promotionBannerStore.checkLoading();
                const banner = await promotionBannerStore.bannerByID(parseInt(params[0]));
                banner && loadMainContent('promotion-banners', 'edit-promotion-banner', banner);
            // }
        },

        '/marketing/promotion-banners/create'() {
            // if (ls.get('pages').filter(row => row.id === 7).length > 0) {
                promotionBannerStore.checkLoading();
                loadMainContent('promotion-banners', 'create-promotion-banner');
            // }
        },

       async '/brands/edit/([a-z_0-9_-]+)'(params){
            // if(ls.get('pages').filter(row => row.id === 3).length > 0) {
                const brand = await brandsStore.brandByID(parseInt(params[0]));
                loadMainContent('brands', 'brand-details', brand);
            // }
        },


        async '/footer'(){
            // if(ls.get('pages').filter(row => row.id === 4).length > 0) {
                const footerInfo = await footerContactInfoStore.checkLoading();
                footerInfo && loadMainContent('footer', 'edit-footer', footerInfo);
            // }
        },

        async '/glossary/terms'(){
            // if(ls.get('pages').filter(row => row.id === 4).length > 0) {
                loadMainContent('glossary-terms', 'list-terms');
            // }
        },

        async '/glossary/edit/([a-z_0-9_-]+)'(params) {
            const glossaryDefinitions = await glossaryStore.getDefinition(params);
            loadMainContent('glossary-terms', 'edit-glossary-definitions', glossaryDefinitions);
        },

        async '/pages/home-page'(){
            // if(ls.get('pages').filter(row => row.id === 4).length > 0) {
                // await brandsStore.loadCheck(1);
                // await categoryStore.loadCheck(1);
                await homePromosStore.loadCheck();
                await mainBannerStore.checkLoading();
                const content = await homePageStore.checkHomeContent();
                loadMainContent('homePage', 'homePage', content);
            // }
        },

        '/price-importer'(){
            loadMainContent('priceImporter', 'price-importer');
        },

        '/image-uploader'(){
            loadMainContent('imageUploader', 'image-uploader-main');
        },

        async '/express-finder'(){
            sharedStore.showLandingPage();
            const expressFinders = await finderStore.checkForFinders();
            loadMainContent('express-finder', 'finder-list', expressFinders);
            sharedStore.hideLoadingPage();
        },

        '/express-finder/create'(){
            loadMainContent('express-finder', 'finder-create');
            sharedStore.hideLoadingPage();
        },

        async '/express-finder/edit/([a-z_0-9_-]+)'(params) {
            const expressFinders = await finderStore.getFinder(params);
            loadMainContent('express-finder', 'edit-express-finder', expressFinders);
        }
    },

    init() {
        this.loadState();
        window.addEventListener('popstate', () => this.loadState());
    },

    loadState() {
        Object.keys(this.routes).forEach(route => {
            const matches = location.hash.match(new RegExp(`^#!${route}$`));
            if (matches) {
                const params = matches.slice(1);
                this.routes[route](params);
            }
        })
    }
};