<template>
<div class="search-container">
    <h2 style="padding: 20px 0px 20px 5px;">{{userLogTypeTitle}} List</h2>
        <div class="col-12 details-form">
            <div style="display:inline; padding: 0px;" class="col-6">
                <label>Search by Type: </label>
                <select v-model="selectType" @change="filterByType()">
                    <option value="0" disabled>Select Type</option>
                    <option v-for="(type, t) in types.logPages" :key="t" :value="type.id">{{type.attributes.page_type}}</option>
                </select>
            </div>
            <div style="display:inline;" class="col-6">
                <label>Search by User: </label>
                <select v-model="selectUser" @change="filterByUser()">
                    <option value="0" selected>All</option>
                    <option v-for="(user, u) in users.user" :key="u" :value="user.id">{{user.attributes.name}}</option>
                </select>
            </div>
        </div>
        <div class="search-container__section" style="height: 700px;">
            <table class="search-container__table" style="height: 90%;" id="productSearchTable">

                <tr style="padding: 10px 0px 10px 0px;">
                    <th class="col-3" >Item Name</th>
                    <th class="col-3" >User</th>
                    <th class="col-3">Changes</th>
                    <th class="col-2">Changed At</th>
                </tr>

                    <tr class="list-table__item" style="border-bottom: 1px solid; border-color: #D0D0D0; height: auto;" v-for="(userLog, key) in userLogInfo" :key="key">
                        <td class="col-3 search-container__table__data__action" v-if="userLog.attributes.log_page === 1 || userLog.attributes.log_page === 2">{{(userLog.attributes.item && (userLog.attributes.log_page === 1 || userLog.attributes.log_page === 2)) ? userLog.attributes.item.title : 'Item Not Found With ID : '+userLog.attributes.item_id}}</td>
                        <td class="col-3 search-container__table__data__action" v-else >{{userLog.attributes.item_id}}</td>
                        <td class="col-3 search-container__table__data__action">{{userLog.attributes.user.name}}</td>
                        <td class="col-3 search-container__table__data__action" style="vertical-align: top;">
                            <li style="list-style-type: none;" v-for="(change, c) in JSON.parse(userLog.attributes.changes)" :key="c">
                                - {{change}}
                            </li>
                        </td>
                        <td class="col-2">{{userLog.attributes.changed_at}}</td>
                    </tr>
                    <tr>
                        <td v-if="userLogInfo.length < 1" class="col-12" style="color: red; text-align: center;"><h3>No Data Logs Found</h3></td>
                    </tr>
            </table>
    </div>
</div>
</template>

<script>

import {logPagesStore, userStore, userLogStore} from '@/stores';

    export default {

        props: ['userLogs', 'subview'],

        data() {
            return {
                types: logPagesStore.state,
                users: userStore.state,
                selectType: 0,
                selectUser: 0,
                userLogInfo: [],
                userLogTypeTitle: null
            }
        },
        watch: {
            async userLogs() {
                if(this.subview === 'view-selected-user-logs') {
                    this.userLogInfo = await this.userLogs;
                    this.changedType();
                    this.filterByUser();
                }
            },

            selectType(){
                this.changedType();
            }
        },

        methods: {
            filterByType()
            {
               if(this.selectType != 0) {
                        window.location = '/#!/settings/user-logs/'+ this.selectType + '/list';                
               }
            },
            async changedType(){
                for(let a = 0; a < this.types.logPages.length; a++){
                    if(this.types.logPages[a].id === this.selectType){
                        this.userLogTypeTitle = this.types.logPages[a].attributes.page_type.charAt(0).toUpperCase() + this.types.logPages[a].attributes.page_type.slice(1);
                    }
                }

            },
            filterByUser() {
                let logInfo = [];
                   if(this.selectUser === 0) {
                       logInfo = this.userLogs
                   } else {
                        for(let u = 0; u < this.userLogs.length; u++) {
                        if(this.userLogs[u].relationships.user.data.id === this.selectUser) {
                            logInfo.push(this.userLogs[u]);
                            }
                        }
                   }
                this.userLogInfo = logInfo;
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>