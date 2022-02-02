<template>
    <section class="home-view">
        <page-header>
            <span slot="title">Home</span>
        </page-header>
    </section>
</template>

<script>
    import PageHeader from '@/components/shared/PageHeader';
    export default {
        components: {PageHeader},
        data(){
            return {
                content: 'content'
            }
        }
    }
</script>

<style lang="scss">
    .home-view {
        flex: 1;
    }
</style>