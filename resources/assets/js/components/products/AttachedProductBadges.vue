<template>
    <div>
        <div class="attached_container" id="productSupplierAttachedSection">
            <h3>Attached Badges</h3>
            <table class="table table-hover attachedTable inventorySuppliers">
                <tr>
                    <th class="inventorySuppliers-Name">Description</th>
                    <th class="inventorySuppliers-Name">Order</th>
                    <th class="inventorySuppliers-Name">Update</th>
                    <th class="inventorySuppliers-Remove">Remove</th>
                </tr>
                <tr v-show="selectedBadges.length < 1" class="noAttachmentsFound">
                    <td colspan="6">
                        <span>There are currently no suppliers attached</span>
                    </td>
                </tr>
                <tr v-for="(badge, key) in selectedBadges" :key="key">
                    <td class="inventorySuppliers-Name">
                        <div>{{ selectedBadges[key].attributes.description }}</div>
                    </td>
                    <td class="inventorySuppliers-Name">
                        <input type="number" v-model="selectedBadges[key].attributes.order" name="inventorySuppliersPreferred" data-vv-as="Prefered" v-validate="">
                    </td>
                    <td class="inventorySuppliers-Name attachedTableUpdate" :disabled="$validator.errors.any()" @click="updateBadge(key)"></td>
                    <td class="inventorySuppliers-Remove attachedTableRemove" @click="removeBadge(key)"><i class="fas fa-trash"></i></td>
                </tr>
            </table>
            <span class="error-message" v-for="error in errors.all()" :key="error">{{ error }}<br></span>
        </div>
        <div>
            <product-badges-search :selectedBadges="selectedBadges" :productBadges="productBadges"></product-badges-search>
        </div>
    </div>
</template>

<script>
import {productBadgesStore} from '@/stores';
import {event, http} from '@/services';
import ProductBadgesSearch from '@/components/products/badges/ProductBadgesSearch';

export default {

    props:['selectedBadges', 'product', 'view'],

    components:{ProductBadgesSearch},

    data() {
        return {
            productBadges:productBadgesStore.state,
            type: 'badge'
        }
    },

    methods: {
        updateBadge(key)
        {   
            let data = http.createData(this.selectedBadges[key]);
            productBadgesStore.update(data, this.selectedBadges[key].id)
        },
        removeBadge(key)
        {
            event.emit(event.names.UPDATE_SELECTED, this.selectedBadges[key], this.type, 'remove');

        }
    }
}
</script>