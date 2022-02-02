<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Image Uploader</span>
        </page-header>

        <div class="main-sections__content">
            <single-uploader/>
            <hr>
            <multi-uploader/>
        </div>
    </section>
</template>

<script>
    import SingleUploader from '@/components/shared/CDNUpload/single-uploader';
    import MultiUploader from '@/components/shared/CDNUpload/MultiUploader';
    import PageHeader from '@/components/shared/PageHeader';

    export default {
        name: "ImageUploader",

        components: {SingleUploader, MultiUploader, PageHeader},
    }
</script>

<style lang="scss">

</style>