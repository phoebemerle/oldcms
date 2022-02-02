<template>
    <div style="padding:10px;">
        <h1>Upload Zip File</h1>
        <form method="post" enctype="multipart/form-data" action="https://cdn.comms-express.com/zip_upload">
            <input type=file name=file>
            <input class="btn btn-primary" type=submit value=Upload>
        </form>
    </div>
</template>

<script>
    export default {
        name: "MultiUploader"
    }
</script>

<style lang="scss">

</style>