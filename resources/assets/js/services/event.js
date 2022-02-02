import Vue from 'vue';
export const event = {
    bus: null,
    names: {
        APP_READY: 'app-ready',
        LOAD_MAIN_CONTENT: 'load-main-content',
        LOAD_SUB_CONTENT: 'load-sub-content',
        LOAD_TAB:'load-tab',
        LOG_OUT: 'log-out',
        USER_MESSAGE: 'user-message',
        UPDATE_SELECTED: 'update_selected_products',
        CLOSE_MODAL: 'close_modal',
        UPDATE_STOCKITEMS: 'update_stock_items',
        UPDATE_MEDIA_INFO: 'updateMediaInfo',
        UPDATE_ATTACHED_SELECTION: 'update_attached_selection',
        MOBILE_NAV_CHANGE: 'mobileNavChange',
        SAVE_NEW_MEDIA: 'save_new_media',
        SAVE_NEW_ICON: 'save_new_icon',
        UPDATE_PROMOTIONS: 'update_promotions',
        UPDATE_SHOPPING_PROFILES:'update_shopping_profiles',
        REMOVE_TARGET:'remove_targets',
        UPDATE_BRAND:'update_brand',
        SAVE_BRAND_MEDIA: 'save_brand_media',
        UPDATE_UPLOAD_LIST:'update_upload_list',
        LOADING:'loading',
        UPDATE_CATEGORY_INFORMATION: 'update_category_information',
        ADD_FEATURED:'add_homepage_featured',
        UPDATE_FEATURED_CATEGORIES: 'update_featured_categories',
        UPDATE_HOMEPROMO: 'update_home_promo',
        UPDATE_RELATED_PRODUCT: 'update_related_product',
        UPDATE_COSTEFFECTIVE_PRODUCT: 'update_costeffective_product',
        CATEGORY_PAGINATION:'category_pagination',
        PRODUCT_PAGINATION:'product_pagination',
        INVENTORY_PAGINATION:'inventory_pagination',
        INVENTORY_GROUP_PAGINATION:'inventory_group_pagination',
        UPDATE_NAVIGATION_CATEGORIES: 'update_navigation_categories',
        UPDATE_NAVIGATION_VIEW: 'update_navigation_view',
        BRAND_PAGINATION: 'brand_pagination',
        CAMPAIGN_PAGINATION: 'campaign_pagination',
        REMOVE_BRAND_MEDIA: 'remove_brand_media',
        UPDATE_ATTACHED_RANGES: 'update_attached_ranges',
        UPDATE_ATTACHED_PRODUCTS: 'update_attached_products',
        OPEN_STOCK_MODAL: 'open_stock_modal',
        SELECT_MODAL_STOCK: 'select_modal_stock',
        UPDATE_ATTACHED_GROUPS: 'update_attached_groups',
        REMOVE_SECTION: 'remove_section',
        ADD_SECTION: 'add_section',
        MOVE_TAB:'moveTab',
        UPDATE_PRODUCT_LICENCE:'attachProductLicence',
        UPDATE_FINDER_CATEGORY:'updateFinderCategory',
        UPDATE_FINDER_PRODUCTS:'updateFinderProducts',
        CLOSE_PART_CODE_MODAL:'closePartCodeModal'
    },
    init() {
        if(!this.bus) {
            this.bus = new Vue();
        }
    },
    on(name, cb) {
        this.bus.$on(name, cb);
    },
    emit(name, ...args) {
        this.bus.$emit(name, ...args);
    },

    off(name){

        this.bus.$off(name);
    }
};