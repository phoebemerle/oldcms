<template>
    <div class="main-sections__editForm">
        <div class="overviewTabs">
                <ul class="list-inline">
                <li v-bind:class="{ activeTab: tab === 1 }" @click="changeTab(1)">Dev Team</li>
                <li v-bind:class="{ activeTab: tab === 2 }" @click="changeTab(2)">Marketing</li>
                <li v-bind:class="{ activeTab: tab === 3 }" @click="changeTab(3)">Content</li>
                <li v-bind:class="{ activeTab: tab === 4 }" @click="changeTab(4)">Customer Service</li>
                <li v-bind:class="{ activeTab: tab === 5 }" @click="changeTab(5)">Sales</li>
                <li v-bind:class="{ activeTab: tab === 6 }" @click="changeTab(6)">Purchasing</li>
                <li v-bind:class="{ activeTab: tab === 7 }" @click="changeTab(7)">IT</li>
            </ul>
        </div>
        <department-permissions-details :tab="tab" :subview="subview"></department-permissions-details>
    </div>
</template>

<script>
import {departmentStore} from '@/stores';
import DepartmentPermissionsDetails from '@/components/settings/departmentPermissions/DepartmentPermissionsDetails';

export default {

    props: ['subview'],

    components: {
        DepartmentPermissionsDetails
    },

    data() {
        return {
            departments: departmentStore.state,
            tab: 1,
        }
    },
    methods: {
        changeTab(tab) {
            this.tab = tab;
        }
    }
}
</script>
