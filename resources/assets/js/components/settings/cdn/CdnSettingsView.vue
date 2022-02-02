<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">CDN Restore</span>
        </page-header>

        <div class="main-sections__content">
            <div class="main-sections__editForm">
                <div v-show="modal" class="modalContainer">
                    <div  id="modalDeleteSection">
                        <div class="closeModal" @click="closeModal()"></div>
                        <div id="deleteSectionText">
                            <div><strong>Restore Data To Redis Cluster</strong></div>
                            <div>Are you sure you want to this?</div>
                            <span class="areYouSure"><strong>This cannot be undone.</strong></span>
                        </div>
                        <div>
                            <button class="btn btn-danger"  @click="confirmOption()">Confirm</button>
                            <button class="btn btn-primary" @click="closeModal()">Cancel</button>
                        </div>
                    </div>
                </div>

                <h1>Upload Data To Restore</h1>
                <form method="post" enctype="multipart/form-data">
                    <input @change="pickFiles($event)" ref="upload" type=file name=file>
                    <input class="btn btn-primary" type="button" @click="uploadData" value="Upload Data">
                </form>

                <br /><br />

                <h1>Restore Data</h1>
                <input class="btn btn-app btn-danger btn-lg" type="button" @click="openModal" value="Restore Data">
            </div>
        </div>
    </section>
</template>

<script>
	import PageHeader from '@/components/shared/PageHeader';
	import {event} from '@/services';
	import axios from "axios";

	export default {
		name: "CdnSettingsView",

		components: {
			PageHeader,
		},

		data() {
			return {
                modal: false,
				upload: []
			}
		},

        created() {
			// this.init()
		},

		methods: {
            pickFiles(files){
                this.upload = files.target.files[0]
            },

            openModal() {
				this.modal = true;
			},

			closeModal() {
				this.modal = false;
			},

            confirmOption() {
                this.restoreCDN();
                this.closeModal();
            },

            uploadData() {
                // Set Headers For Form
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };

                // Build Form Data With CSV File
                let uploadData = new FormData;
                uploadData.append('file', this.upload);

                // Send Data To Upload Func In API
                axios.post('https://cdn.comms-express.com/restore_upload', uploadData, config).then(res => {
                    if (res.data === "Completed") {
                        event.emit(event.names.USER_MESSAGE, 'Data File Upload', 'success');
                    } else {
                        event.emit(event.names.USER_MESSAGE, 'Sorry File Not Uploaded', 'error');
                    }
                });
            },

            restoreCDN() {
                axios.get('https://cdn.comms-express.com/restore').then(res => {
                    if (res.data === "Completed") {
                        event.emit(event.names.USER_MESSAGE, 'Restore Complete', 'success');
                    } else {
                        event.emit(event.names.USER_MESSAGE, 'Sorry Restore Failed', 'error');
                    }
                });
            }
		}

	}
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";
</style>