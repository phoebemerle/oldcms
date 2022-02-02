<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Search Settings</span>
        </page-header>

        <div class="main-sections__content">
            <div class="main-sections__editForm">

                <div v-show="modal" class="modalContainer">
                    <div  id="modalDeleteSection">
                        <div class="closeModal" @click="closeModal()"></div>
                        <div id="deleteSectionText">
                            <div>Are you sure you want to re-index the database?</div>
                            <span class="areYouSure"><strong>This cannot be undone.</strong></span>
                        </div>
                        <div>
                            <button class="btn btn-danger"  @click="confirmOption()">Confirm</button>
                            <button class="btn btn-primary" @click="closeModal()">Cancel</button>
                        </div>
                    </div>
                </div>

                <!-- <div class="main-sections__editForm__container" style="height: 700px;">
                    <div id="es-prod" v-if="!show">
                        <h1>Database</h1><br /><br /><br />

                        <div>
                            <h2>Reindex Database</h2><br />
                            <span><button class="btn btn-app btn-warning btn-lg" @click="openReAddProduction">RE-INDEX DATABASE</button></span>
                        </div><br /><br /> -->

                        <!-- <div>
                            <h2>Update Single Product</h2><br />
                            <input type="text" id="update_add_product_pro" class="updateInputs" name="update_add_product" v-model="update_product_id">
                            <button class="btn btn-primary" @click="openUpdateProductProduction">Update / Add</button>
                        </div><br /><br />

                        <div>
                            <h2>Remove Single Product</h2><br />
                            <form>
                                <input type="text" id="remove_add_product_pro" class="updateInputs" name="remove_add_product" v-model="remove_product_id">
                                <input class="btn btn-primary" type="button" @click="openRemoveProductProduction" value="Remove">
                            </form>
                        </div><br /><br />

                        <div>
                            <h2>Update Single Category</h2><br />
                            <form>
                                <input type="text" id="update_add_cat_pro" class="updateInputs" name="update_add_cat" v-model="update_category_id">
                                <input class="btn btn-primary" type="button" @click="openUpdateCategoryProduction" value="Update / Add">
                            </form>
                        </div><br /><br />

                        <div>
                            <h2>Remove Single Category</h2><br />
                            <form>
                                <input type="text" id="remove_add_cat_pro" class="updateInputs" name="remove_add_cat" v-model="remove_category_id">
                                <input class="btn btn-primary" type="button" @click="openRemoveCategoryProduction" value="Remove">
                            </form>
                        </div> -->

                    <!-- </div> -->

                    <div id="es-stage" v-if="show">
                        <h1>Database</h1><br /><br /><br />

                       <div>
                            <h2>Reindex Database</h2><br />
                            <span><button class="btn btn-app btn-warning btn-lg" @click="openRebuildStaging">RE-INDEX DATABASE</button></span>
                        </div><br /><br />

                        <!-- <div>
                            <h2>Update Single Product</h2><br />
                            <input type="text" id="update_add_product" class="updateInputs" name="update_add_product" v-model="update_product_id">
                            <button class="btn btn-primary" @click="openUpdateProductStaging">Update / Add</button>
                        </div><br /><br />

                        <div>
                            <h2>Remove Single Product</h2><br />
                            <form>
                                <input type="text" id="remove_add_product" class="updateInputs" name="remove_add_product" v-model="remove_product_id">
                                <input class="btn btn-primary" type="button" @click="openRemoveProductStaging" value="Remove">
                            </form>
                        </div><br /><br />

                        <div>
                            <h2>Update Single Category</h2><br />
                            <form>
                                <input type="text" id="update_add_cat" class="updateInputs" name="update_add_cat" v-model="update_category_id">
                                <input class="btn btn-primary" type="button" @click="openUpdateCategoryStaging" value="Update / Add">
                            </form>
                        </div><br /><br />

                        <div>
                            <h2>Remove Single Category</h2><br />
                            <form>
                                <input type="text" id="remove_add_cat" class="updateInputs" name="remove_add_cat" v-model="remove_category_id">
                                <input class="btn btn-primary" type="button" @click="openRemoveCategoryStaging" value="Remove">
                            </form>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
	import PageHeader from '@/components/shared/PageHeader';
	import {event} from '@/services';
	import axios from "axios";

	export default {
		name: "SearchSettingsView",

		components: {
			PageHeader,
		},

		data() {
			return {
				show: true,
				modal: false,
				optionTitle: "",
				optionType: "",
			}
		},


		methods: {

			openModal() {
				this.modal = true;
			},

			closeModal() {
				this.modal = false;
			},

			confirmOption(type) {
				// Check Option Type Supplied
                if (type === "rebuild") {
                	this.runRebuildIndex();
                } 

				// Close Modal
				this.closeModal();
			},


			runRebuildIndex() {

				 axios.post('http://inventory.dev.local/api//v1/import/reindexSearch)')

            .then(response => {
                sharedStore.hideLoadingPage();
				event.emit(event.names.USER_MESSAGE, 'Index Re-Built!', 'success');
            })

            },


			openRebuildStaging() {
				this.optionTitle = "re-build";
				this.optionType = "rebuild";
				this.openModal();
			},

		}

	}
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

    /*#es-prod {*/
    /*    display: none;*/
    /*}*/

    /*#es-stage {*/
    /*    display: none;*/
    /*}*/

    .updateInputs {
        border: black 1px solid;
        margin-right: 32px;
    }

    #modalDeleteSection{
        width: 30%;
        height: 20rem;
        background-color: #FFF;
        padding: 1rem;
        border: 0.1rem solid #c9c9c9;
        border-radius: 0.5rem;
        position: absolute;
        top: 15rem;
        text-align:center;

        button{
            font-size:1.4rem;
            margin:0 1.5rem;
        }
    }

    #deleteSectionText{
        font-size:1.6rem;
        margin:2rem 0;
    }
</style>