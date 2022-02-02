<template>
    <div class="card-body">
        <virtual-scroller v-show="items.search.length > 0"
                          class="list-table__body"
                          container-tag="table"
                          content-tag="tbody"
                          :items="items.search"
                          item-height="35"
                          containerClass="table-hover table">
            <thead slot="before-content">
            <tr>
                <th v-for="(header, index) in headers" :style="{width:columnWidth + '%'}" :key="index">{{header}}</th>
            </tr>
            </thead>
            <template slot-scope="props">
                    <tr  class="list-table__item" :key="props.itemKey">
                            <td v-for="(field, key) in data" :style="{width:columnWidth + '%'}" :key="key">
                                <a v-if="edit" :href="editLink+props.item.id">
                                    <div v-if="field === 'short_desc' || field === 'long_desc' || field === 'page_desc'" v-html="props.items.attributes[field]"></div>
                                    <span v-else-if="field === 'active'" class="btn" :class="props.item.attributes[field] === 1 ? 'btn-success' : 'btn-danger'">{{ props.item.attributes[field] === 1 ? 'Active' : 'Inactive' }}</span>
                                    <div v-else >{{props.item.attributes[field]}}</div>
                                </a>
                            </td>

                            <td class="listTableEditAction">
                                <span>
                                    <a v-if="edit" :href="editLink+props.item.id">
                                        <i class="far fa-edit"></i>
                                    </a>
                                </span>
                            </td>
                    </tr>

            </template>
        </virtual-scroller>

        <table v-show="items.search.length < 1" class="table-hover table">
            <tr>
                <th v-for="(header, index) in headers" :style="{width:columnWidth + '%'}" :key="index">{{header}}</th>
            </tr>
            <tr class="noSearchResults">
                <td :colspan="headers.length">
                    Sorry, no search results were found, please try again
                </td>
            </tr>
        </table>

    </div>
</template>

<script>
    import {inventoryStore} from '@/stores';
    import {productStore} from '@/stores';
    import {productGroupsStore} from '@/stores';
    import {categoryStore} from '@/stores';
    import {campaignStore} from '@/stores';
    import {brandsStore} from '@/stores';
    import {productBadgesStore} from '@/stores';
    import {productSashesStore} from '@/stores';
    import {freeGiftStore} from '@/stores';
    import {deliveryTypeStore} from '@/stores';
    import {stockAvailabilityStore} from '@/stores';
    import {attributeTypeStore} from '@/stores';
    import {templateStore} from '@/stores';
    import {promotionBannerStore} from '@/stores';
    import {event} from '@/services';
    import {sharedStore} from '@/stores';


    export default {
        props:['tableType', 'headers', 'data', 'edit', 'link','items'],

        data(){
            return{
                editLink: this.link,
                columnWidth:0,
            }
        },

        created(){
            this.columnWidth = 100 / this.headers.length;

        },

    }

</script>

<style lang="scss">
    @import "~#/variables";

    #searchContainer{
        padding:10px;
    }

    a{
        color:#212529;
    }

    .far .fa-edit{
        font-size:20px;
    }
</style>