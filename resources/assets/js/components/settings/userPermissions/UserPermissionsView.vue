<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">User Permissions</span>
        </page-header>
        <div class="main-sections__content">
            <user-permissions-list v-show="subview === 'view-all-user-permissions'" :subview="subview" />
            <user-permissions-details v-show="subview === 'edit-user-permissions' || subview == 'create-user-permissions'" :user="user[0]" :subview="subview" />
        </div>
    </section>
</template>

<script>
    import PageHeader from '@/components/shared/PageHeader';
    import UserPermissionsList from '@/components/settings/userPermissions/UserPermissionsList';
    import UserPermissionsDetails from '@/components/settings/userPermissions/UserPermissionsDetails';

    export default {
        name: "UserPermissionsView",

        components: {
            PageHeader,
            UserPermissionsList,
            UserPermissionsDetails
            },

        props:['subview', 'user'],

        data(){
            return{

            }
        },

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>