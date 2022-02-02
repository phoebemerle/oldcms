<template>
    <div class="details-form">
        <div class="details-form__body" >
            <div>
                <div>
                    <label for="DefinitionMetaTitle">Meta Title</label>
                    <input id="DefinitionMetaTitle" v-model="defInfo.attributes.meta_title" type="text">
                </div>
                <div>
                    <label for="DefinitionMetaDesc">Meta Description</label>
                    <input id="DefinitionMetaDesc" v-model="defInfo.attributes.meta_description" type="text">
                </div>
                <div>
                    <label for="DefinitionText">Text</label>
                    <textarea id="DefinitionText" v-model="defInfo.attributes.text"/>
                </div>
                <div>
                    <label for="DefinitionURL">URL</label>
                    <input id="DefinitionURL" type="text" v-model="defInfo.attributes.url">
                </div>
            </div>
        </div>
        <hr>
        <div class="details-form__body" >
            <h3>Attached Terms</h3>
            <div>
                <table style="width:60%">
                    <tr>
                        <td style="width:50%;padding:10px 0">Term</td>
                        <td style="width:25%;padding:10px 0">Update</td>
                        <td style="width:25%;padding:10px 0">Remove</td>
                    </tr>
                    <tr v-for=" (term, index) in  defInfo.attributes.glossary_terms">
                        <td style="padding:10px 0"><input type="text" v-model="defInfo.attributes.glossary_terms[index].terms"></td>
                        <td style="padding:10px 0"><button class="btn btn-primary" @click="updateTerm(index)">Update</button></td>
                        <td style="padding:10px 0"><button class="btn btn-danger" @click="removeTerm(index)">Remove</button></td>
                    </tr>
                    <tr v-for=" (newTerm, index) in  newTerms">
                        <td style="padding:10px 0"><input type="text" v-model="newTerm.terms"></td>
                        <td style="padding:10px 0"><button class="btn btn-primary" @click="saveNewTerm(index)">Save</button></td>
                    </tr>
                    <tr>
                        <td>
                            <button class="btn btn-success" @click="addGlossaryTerm()">Add New Glossary Term</button>
                        </td>
                    </tr>

                </table>
            </div>
        </div>

        <div class="details-form__cta">
            <button class="btn btn-primary" @click="update()">Update</button>
        </div>

    </div>
</template>

<script>
    import {event} from '@/services';
    import {http} from '@/services';
	  import axios from "axios";
    import GlossaryDefStub from '@/stubs/GlossaryDefinition';
    import {glossaryStore} from '@/stores';

    export default {

        props:['definition'],

        data(){
            return{
                defInfo:GlossaryDefStub,
                newTerms:[]
            }
        },

        watch:{
            definition(){
                this.defInfo = this.definition;
            }
        },


        methods:{
            async update(){
                let data = http.createData(this.defInfo);
                await glossaryStore.updateDefinition(data, this.defInfo.id);
            },

            async removeTerm(index){
                try{
                    await glossaryStore.deleteTerm(this.defInfo.attributes.glossary_terms[index].id);

                    this.defInfo.attributes.glossary_terms.splice(index,1);
                }catch (error) {
                    console.log(error);
                }
            },

            async updateTerm(index){
                let data = {
                    'data': {
                        "id": this.defInfo.attributes.glossary_terms[index].id,
                        'type': 'glossary-terms',
                        'attributes': {
                            'glossary_definition_id':this.defInfo.id,
                            "terms": this.defInfo.attributes.glossary_terms[index].terms
                        }
                    }
                };

                await glossaryStore.updateTerm(data, this.defInfo.attributes.glossary_terms[index].id);

            },

            addGlossaryTerm(){
              this.newTerms.push({
                'glossary_definition_id':this.defInfo.id,
                'id':null,
                'terms':''
              });
            },

            async saveNewTerm(index){
                let data = {
                    'data': {
                        'type': 'glossary-terms',
                        'attributes': {
                            'glossary_definition_id':this.defInfo.id,
                            'terms': this.newTerms[index].terms
                        }
                    }
                };

                let newTerm = await glossaryStore.saveNewTerm(data);
                this.defInfo.attributes.glossary_terms.push(newTerm);
                this.newTerms.splice(index, 1);
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>