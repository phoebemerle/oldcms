<template>    
    <div class="main-sections__editForm__container" style="height: auto;">
        <br>
        <hr>
             <label for="inventory" style="padding-right: 20px;"><h2>CMS</h2></label>
             <input type="checkbox" v-model="cms" @click="cmsSelect()">
        <hr>
            <div style="font-size: 15px; padding: 20px 20px 30px 0px;">
                <label for="pageData[0]" style="padding: 0px 125px 0px 0px;">Product</label>
                <input type="checkbox" v-model="pageData[0]">
                <label for="pageData[1]" style="padding: 0px 130px 0px 60px;">Category</label>
                <input type="checkbox" v-model="pageData[1]">
                <label for="pageData[0]" style="padding: 0px 125px 0px 60px;">Brands</label>
                <input type="checkbox" v-model="pageData[2]">
                <label for="pageData[1]" style="padding: 0px 130px 0px 60px;">Pages</label>
                <input type="checkbox" v-model="pageData[3]">
                <label for="pageData[1]" style="padding: 0px 130px 0px 60px;">Email Templates</label>
                <input type="checkbox" v-model="pageData[9]">
            </div>
        <br><br>
        <hr>
            <label for="inventory" style="padding-right: 20px;"><h2>Inventory</h2></label>
            <input type="checkbox" v-model="inventory" @click="inventorySelect()">
        <hr>
        <div style="font-size: 15px; padding: 20px 20px 20px 0px;">
            <label for="pageData[2]" style="padding: 0px 70px 0px 0px;">Inventory Items</label>
            <input type="checkbox" v-model="pageData[4]">
            <label for="pageData[3]" style="padding: 0px 70px 0px 60px;">Inventory Groups</label>
            <input type="checkbox" v-model="pageData[5]">
        </div>
        <br><br>
        <hr>
            <label for="marketing" style="padding-right: 20px;"><h2>Marketing</h2></label>
            <input type="checkbox" v-model="marketing" @click="marketingSelect()">
        <hr>
            <div style="font-size: 15px; padding: 20px 20px 20px 0px;">
                <label for="pageData[4]" style="padding: 0px 100px 0px 0px;">Campaigns</label>
                <input type="checkbox" v-model="pageData[6]">
                <label for="pageData[5]" style="padding: 0px 130px 0px 60px;">Free Gifts</label>
                <input type="checkbox" v-model="pageData[7]">
            </div>
        <br><br>
        <hr>
            <label for="settings" style="padding-right: 20px;"><h2>Settings</h2></label>
            <input type="checkbox" v-model="pageData[8]">
        <hr>
        <br><br>
            <button @click="saveDepartmentPermissions()" class="btn btn-primary" style="font-size: 15px; margin-bottom: 10px;">Save</button>
            <input type="hidden" name="" :value="department">
    </div>
</template>

<script>
    import {departmentStore, pagesStore} from '@/stores';
    import {event} from '@/services';

    export default {

        props:['tab', 'subview'],

        data(){
            return{
                department: departmentStore.state,
                pages: pagesStore.state,
                pageData: [],
                inventory: false,
                // departmentPermissions: []
                cms: false,
                marketing: false
            }
        },

        async created() {
              await departmentStore.checkLoading()
              this.department = await departmentStore.departmentByID(this.tab);
                if (this.department.attributes.pages.length < 1) {
                    this.pageData = [];
                } else {
                    for(let i = 0; i < this.department.attributes.pages.length; i++) {
                        this.pageData[parseInt(this.department.attributes.pages[i].id)-1] = true;
                    }
                }
        },

        watch:{
            tab() {
                this.department = departmentStore.departmentByID(this.tab);
                this.pageData = [];
                if (this.department.attributes.pages.length > 0) {
                    for(let i = 0; i < this.department.attributes.pages.length; i++) {
                        this.pageData[parseInt(this.department.attributes.pages[i].id)-1] = true;
                    }
                }
                if(this.pageData[0] && this.pageData[1] && this.pageData[2] && this.pageData[3]) {
                    this.cms = true;
                } else {
                    this.cms = false;
                }
                if(this.pageData[4] && this.pageData[5]) {
                    this.inventory = true;
                } else {
                    this.inventory = false;
                }
                if(this.pageData[6] && this.pageData[7]) {
                    this.marketing = true
                } else {
                    this.marketing = false;
                }
            },
            async subview() {
                this.pages = pagesStore.state;
                this.department = departmentStore.departmentByID(this.tab);
                this.pageData = [];
                if(this.department) {
                    if (this.department.attributes.pages.length > 0) {
                        for (let i = 0; i < this.department.attributes.pages.length; i++) {
                            this.pageData[parseInt(this.department.attributes.pages[i].id) - 1] = true;
                        }
                    }
                    if (this.pageData[0] && this.pageData[1] && this.pageData[2] && this.pageData[3]) {
                        this.cms = true;
                    } else {
                        this.cms = false;
                    }
                    if (this.pageData[4] && this.pageData[5]) {
                        this.inventory = true
                    } else {
                        this.inventory = false
                    }
                    if (this.pageData[6] && this.pageData[7]) {
                        this.marketing = true
                    } else {
                        this.marketing = false
                    }
                }
            }

        },

        methods:{

            saveDepartmentPermissions() {

                var departmentPermissions = [];

                for(let m = 0; m < this.pageData.length; m++) {
                      if(this.pageData[m] == true) {
                        departmentPermissions.push(parseInt(m)+1);
                      }
                }
                var data = {
                    data: {
                        id: this.department.id,
                        pages: departmentPermissions
                    }
                }

                departmentStore.attachPages(data);
            },
            cmsSelect() {
                if(this.cms == false) {
                    this.pageData[0] = true;
                    this.pageData[1] = true;
                    this.pageData[2] = true;
                    this.pageData[3] = true;
                }else if(this.cms == true) {
                    this.pageData[0] = false;
                    this.pageData[1] = false;
                    this.pageData[2] = false;
                    this.pageData[3] = false;
                }
            },
            inventorySelect() {
                if(this.inventory == false) {
                    this.pageData[4] = true;
                    this.pageData[5] = true;
                }else if(this.inventory == true) {
                    this.pageData[4] = false;
                    this.pageData[5] = false;
                }
            },
            marketingSelect() {
                if(this.marketing == false) {
                    this.pageData[6] = true,
                    this.pageData[7] = true
                }else if(this.marketing == true) {
                    this.pageData[6] = false,
                    this.pageData[7] = false
                }
            }
      }
    }
</script>