<template>
    <div class="modalClass details-form__body">
        Select Stock Item:
        <input style="width: 79.5%;" @keyup="search()" type="text" placehoder="Please select a stockitem" v-model="stockitemSearch">
        <div @click="closeModal()" class="closeModal"></div>
        <div>
            <span v-for="(stock, index) in stockSearch" :key="index" class="stockList" @click="addPrimary(stock)">
                <span><strong>Name:</strong> {{stock.attributes.description}} <strong style="margin-left: 20px;">Code:</strong> {{stock.attributes.code}}</span>
            </span>
        </div>
    </div>
</template>
<script>
import {inventoryStore} from '@/stores';
import {event} from '@/services';
import _ from 'lodash';

export default {

    props: ['modalType'],

    data() {
        return {
            stockitemSearch:'',
            stockSearch:[]
        }
    },

    created() {
        _.debounce(this.search, 500);
    },

    watch: {
        modalType()
        {
            this.stockitemSearch = null;
            this.stockSearch = []
        }
    },

    methods: {
        async search() {
            this.stockSearch = await inventoryStore.filter(this.stockitemSearch)
        },
        addPrimary(stock)
        {
            event.emit(event.names.SELECT_MODAL_STOCK, stock, this.modalType);
            event.emit(event.names.OPEN_STOCK_MODAL, false, this.modalType);
        },
        closeModal() {
            event.emit(event.names.OPEN_STOCK_MODAL, false, this.modalType);
        }
    }
}
</script>
<style>
.modalClass {
    position: absolute;
    background-color: white;
    border-style: solid;
    z-index: 0;
    border-radius: 5px;
    border-color: #C2C0C0;
    top: 67px;
    left: 20%;
    right: 20%;
    padding: 25px;
    height: 500px;
}
.stockList {
    cursor: pointer;
    margin: 2px 90px;
    border-style: solid;
    border-width: 1px;
    padding: 5px;
    border-radius: 5px;
    border-color: #C2C0C0;
    display: grid;
}
.stockList:hover {
    background-color: #E6E6E6;
    color: white;
}
.closeModal {
    float: right;
    cursor: pointer;
    margin: 0px;
    font-size: 15px;
}
</style>