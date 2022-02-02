<template>
    <section class="main-sections">
        <h2 class="page-header__title">Price Importer</h2>
        <div class="main-sections__content" id="csvUploader">
        <div id="csvInstructions">
            <h3>CSV layout</h3>
            <p>Below you can upload a CSV to mass update product prices.<br>
            Within this import you can change the standard price, a sale price and trade price.<br>
            Please use the table below as a demo of how to set up your CSV, changing the format from below will causes the wrong data to be put in the wrong fields. 
                You do not need to put the £ sign into the table. </p>
        </div>
        <table>
            <tr>
                <th>Product Code</th>
                <th>Standard Price</th>
                <th>Sale Price</th>
                <th>Trade Price</th>
                <th>Delivery Type</th>
            </tr>
            <tr>
                <td>NETGS105E</td>
                <td>15.00</td>
                <td>16.00</td>
                <td>17.00</td>
                <td>1</td>
            </tr>
        </table>
        <div>
            <form method="post" ref="form">
                <input type="file" id="file" ref="file" @change="handleFileUpload()"/>

                <input class="btn btn-primary" type="button" @click="upload" value=Upload>
            </form>
        </div>

        <table>
            <tr>
                <th>Product Code </th>
                <th>Standard Price </th>
                <th>Sale Price </th>
                <th>Trade Price </th>
                <th>Delivery Type</th>
            </tr>
            <tr v-for="(result, index) in this.newprices" :key="index">
                  <td>{{result['Product Code']}}</td>
                  <td>£{{result['Standard Price']}}</td>
                  <td>£{{result['Sale Price']}}</td>
                  <td>£{{result['Trade Price']}}</td>
                  <td>{{result['Delivery Type']}}</td>
                
            </tr>
        </table>
        </div>
    </section>
</template>

<script>
    import {importerStore} from '@/stores';
    import axios from 'axios';


    export default {
        data() {
            return {
                file: null,
                newCSV: [],
                newprices: []
            }
        },

        watch: {
            
        },

        methods: {
            async upload()
            {
                let formData = new FormData;
                formData.append('file', this.file);

               this.newprices = await importerStore.priceImporter(formData);

            },

            handleFileUpload(){
                this.file = this.$refs.file.files[0];
            }
        }
    }
</script>

<style lang="scss">

    #csvUploader{
        font-size: 15px;

        table{
            margin: 25px 0;
        }

        #csvInstructions {
            h3{
                font-size:20px;
            }
        }

    }





</style>