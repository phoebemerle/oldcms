<template>
    <section class="main-wrapper">

        <main-sidebar/>
        <main-content/>
        <user-message/>
    </section>
</template>

<script>
    import MainSidebar from '@/components/sidebar/MainSidebar';
    import MainContent from '@/components/layouts/MainContent';
    import UserMessage from '@/components/shared/UserMessage';

    export default {
        components: {MainSidebar, MainContent, UserMessage}
    }
</script>

<style lang="scss">
    .main-wrapper {
        flex: 1;
        display: flex;
        min-width:70rem;
        overflow-x:scroll;
    }
</style>