<template>
    <div class="details-form">
        <div class="details-form__body form-sections" >
            <div>
                <h2>Template Details</h2>
            </div>
            <div id="productTitleContainer">
                <label for="productTitle">Title: </label>
                <input id="productTitle" v-model="templateData.attributes.title" type="text" title="Product Title" name="templateTitle" placeholder="Please Enter a Title" data-vv-as="Title" v-validate="'required'">
            </div>
            <span class="error-message" v-for="error in errors.collect('templateTitle')" :key="error+'a'">{{error}}</span>
             <div class="productOverviewContainter">
                <label for="productShortDesc">Subject: </label>
                <input id="productTitle" v-model="templateData.attributes.subject" type="text" title="Product Title" name="templateSubject" placeholder="Please Enter a Subject" data-vv-as="Title" v-validate="'required'">
             </div>
            <span class="error-message" v-for="error in errors.collect('templateSubject')" :key="error+'b'">{{error}}</span>
             <div>
                <tinymce :id="'TemplateBody'" v-model="templateData.attributes.body" title="Template Body" ref="body" name="templateBody" data-vv-as="Short Description" v-validate="'required'" placeholder="">
                </tinymce>
            </div>
            <span class="error-message" v-for="error in errors.collect('templateBody')" :key="error+'b'">{{error}}</span>
        <div>
            <label for="active">Active: </label>        
            <input type="checkbox" name="active" id="" v-model="templateData.attributes.active">
        </div>
        </div>

        <div class="details-form__cta">
            <button class="btn btn-primary" :disabled="$validator.errors.any()" @click="saveTemplate()">Save</button>
        </div>
    </div>
</template>

<script>

    import {templateStore} from '@/stores';
    import {http} from '@/services';

    export default {

        props:['view', 'template'],

        data(){
            return{
                templateData: {
                    attributes:{
                        body:'',
                        title: '',
                        subject: '',
                        active: 0
                    }
                }
            }
        },

        mounted()
        {

                if(this.view === 'template-edit') {
                    this.templateData = this.template;
                } else if (this.view === 'template-create') {
                    this.templateData = {
                        attributes: {
                            title: '',
                            subject: '',
                            body: '',
                            acitve: 0
                        }
                    }
                }
            this.$validator.reset();
        },

        watch:{
            view()
            {
                if(this.view === 'template-edit') {
                    this.templateData = this.template;
                } else if (this.view === 'template-create') {
                    this.templateData = {
                        attributes: {
                            title: '',
                            subject: '',
                            body: '',
                            acitve: 0
                        }
                    }
                }
                this.$validator.reset();

            }
        },

        methods:{

            saveTemplate(){
                if(this.view === 'template-edit') {
                    let data = http.createData(this.templateData);
                    templateStore.update(data, this.template.id);
                } else if(this.view === 'template-create') {
                    let data = http.createData(this.templateData);
                    templateStore.create(data);
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>