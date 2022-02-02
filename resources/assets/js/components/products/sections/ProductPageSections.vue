<template>
    <div class="details-form">
        <div  style="margin-bottom:10px">
            <label for="savedSections">Please Select a Section</label>
            <select id="savedSections" v-model="section">
                <option value="pleaseSelect">Please Select</option>
                <option value="New Section">Create New Section</option>
                <option v-for="section in savedsections" :value="section.attributes.title">{{section.attributes.title}}</option>
            </select>
            <button class="btn btn-primary" @click="createSection()">Create Section</button>
        </div>
        <saved-sections class="details-form__body form-sections" v-for="(currentSection, key) in currentSections" :section="currentSection" :index="key" :key="key"></saved-sections>
    </div>
</template>

<script>
    import SavedSections from '@/components/products/sections/SavedSection';
    import {event} from '@/services';
    import Vue from 'vue';

    export default {
        props: ['savedsections', 'product'],

        components: {SavedSections},

        data() {
            return {
                section: 'pleaseSelect',
                currentSections: [],
            }
        },

        created(){
            event.on(event.names.REMOVE_SECTION, (key) =>{
                this.currentSections.splice(key, 1);
            });

            event.on(event.names.ADD_SECTION, (section, key) =>{
                Vue.set(this.currentSections, key, section.attributes);
                this.currentSections[key].id = section.id;
            });
        },

        watch: {
            product() {
                if (this.product) {
                    if (this.product.type === 'products') {
                        if (this.product.attributes.page_sections.length === 0) {
                            this.currentSections = [];
                            this.createSection();
                        } else {
                            this.currentSections = this.product.attributes.page_sections;
                        }
                    }
                }
            },
        },
        methods: {
            createSection() {
                let title = this.section;

                if(title === 'pleaseSelect'){
                    title = 'New Section';
                }

                this.currentSections.push({
                    'id': null,
                    'title': title,
                    'contents': '',
                    'order': this.currentSections.length + 1,
                    'active': false,
                    'product_id': this.product.id
                })
            }
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>