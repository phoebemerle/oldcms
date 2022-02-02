<template>
 <div class="main-sections__editForm">
                <a href="#!/settings/user-permissions/create">
                    <button class="btn btn-app btn-primary btn-lg">Create a new User</button>
                </a>
                <div class="overviewTabs">
                     <ul class="list-inline">
                        <li v-bind:class="{ activeTab: tab === 'active' }" @click="changeTab('active')">Active</li>
                        <li v-bind:class="{ activeTab: tab === 'inactive' }" @click="changeTab('inactive')" class="">Inactive</li>
                    </ul>
                </div>
        <div class="main-sections__editForm__container" style="height: 700px;">
            <table class="search-container__table" style="height: 90%;" id="productSearchTable">

                <tr style="padding: 10px 0px 10px 0px;">
                    <th class="col-3" >Name</th>
                    <th class="col-3" style="text-align: center;">Department</th>
                    <th class="col-3" style="text-align: center;">Admin Rights</th>
                    <th class="col-2" style="text-align: center;">User Status</th>
                    <th class="col-1" ></th>
                </tr>

                    <tr class="list-table__item" style="border-bottom: 1px solid; border-color: #D0D0D0; height: auto;" v-for="(user, key) in users" :key="key">
                        <td class="col-3 search-container__table__data__action">{{user.attributes.name}}</td>
                        <td class="col-3 search-container__table__data__action" style="text-align: center;">
                            <div v-if="user.attributes.user_permissions.department">{{ user.attributes.user_permissions.department.department_name }}</div>
                        </td>
                        <td class="col-3 search-container__table__data__action" style="text-align: center;">{{ adminRights(user.attributes.user_permissions.admin_rights) }}</td>
                        <td class="col-2 search-container__table__data__action" style="text-align: center;">
                            <button v-if="user.attributes.active == 1" class="btn btn-success">Active</button>
                            <button v-if="user.attributes.active == 0" class="btn btn-danger">Inactive</button>
                        </td>
                        <td class="listTableEditAction">
                            <a class="col-1" :href="'/#!/settings/user-permissions/'+user.id+'/edit'">
                                <span class="table-list-col-edit"></span>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td v-if="users.length < 1" class="col-12" style="color: red; text-align: center;"><h3>No Data Logs Found</h3></td>
                    </tr>
            </table>
    </div>
</div>
</template>

<script>

import {userStore} from '@/stores'; 
export default {

    props: ['subview'],

    data() {
        return {
            users: [],
            tab: 'active'
        }
    },

    watch: {
        async tab() {
            if(this.tab == 'active') {
                this.users = await userStore.getActiveUsers()
            }else if(this.tab == 'inactive') {
                this.users = await userStore.getInactiveUsers()
            }
        },
        async subview() {
            if(this.tab == 'active') {
                this.users = await userStore.getActiveUsers()
            }else if(this.tab == 'inactive') {
                this.users = await userStore.getInactiveUsers()
            }
        },
    },
    async created() {
        // await userStore.checkLoading()
        this.users = await userStore.getActiveUsers()

    },

    methods: {
        adminRights(rights) {
            if(rights == 1) {
                return 'Admin'
            } else {
                return 'Standard User'
            }
        },
        changeTab(tab) {
            this.tab = tab
        }
    }
}
</script>
