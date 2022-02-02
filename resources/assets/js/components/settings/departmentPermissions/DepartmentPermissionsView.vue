<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Department Permissions</span>
        </page-header>
        <div class="main-sections__content">
            <department-permissions-list v-show="subview === 'view-all-department-permissions'" :subview="subview" />
            <!-- <department-permissions-details v-show="subview === 'edit-department-permissions' || subview == 'create-department-permissions'" :subview="subview" /> -->
        </div>
    </section>
</template>

<script>
    import PageHeader from '@/components/shared/PageHeader';
    import DepartmentPermissionsList from '@/components/settings/departmentPermissions/DepartmentPermissionsList';
    import DepartmentPermissionsDetails from '@/components/settings/departmentPermissions/DepartmentPermissionsDetails';

    export default {
        name: "DepartmentPermissionsView",

        components: {
            PageHeader,
            DepartmentPermissionsList,
            DepartmentPermissionsDetails
            },

        props:['subview'],

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