<template>
    <div style="padding:10px;">
        <h1>Upload Single File</h1>
        <form method="post" ref="form">
            <input @change="pickFiles($event)" accept="image/png, image/jpeg, application/pdf, image/gif" ref="image" type=file name="file">
            <input class="btn btn-primary" type="button" @click="upload" value=Upload>
        </form>
        <div v-if="newImageURLs.length > 0">
            <p>Uploaded Images</p>
            <div class="" v-for="newImageURL in newImageURLs">
                <hr>
                <p><strong>Image Name:</strong> {{newImageURL.Name}}</p>
                <br>
                <p><strong>Image URL:</strong> {{newImageURL.URL}}</p>
                <hr>
            </div>

        </div>

    </div>
</template>

<script>
    import {cdnStore} from '@/stores';

    export default {
        name: "single-uploader",
        data() {
            return {    
                file: null,
                newImage: [],
                newImageURLs:[],
            }
        },
        methods: {
            async upload()
            {
                let fb = new FormData;
                fb.append('file', this.newImage);
                let id  = await cdnStore.uploadToCDN(fb);

                //Need to change URL to use ENV file
                this.newImageURLs.push({
                    'Name':this.newImage.name,
                    'URL':'https://comximages.blob.core.windows.net/files/'+id.filename
                });

            },

            pickFiles(files){
                this.newImage = files.target.files[0];
            },
        }
    }
</script>

<style lang="scss">

</style>