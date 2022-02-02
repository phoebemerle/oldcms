<template>
    <section class="main-sections">
        <page-header>
            <span slot="title">Publish to Live</span>
        </page-header>
        <div class="main-sections__content">
            <button class="btn btn-primary" @click="publish">Publish All</button>
            <div>
                <div style="display: flex; padding-top: 30px;">
                    <h2 style="padding-right: 20px;">Publish Catalogue </h2>
                    <button class="btn btn-primary" @click="publishCatalogue" :disabled="catalogue_percent > 0 && catalogue_percent < 100">Publish</button>
                </div>
                <k-progress :percent="catalogue_percent" />
                {{catalogue.status}}
            </div>
            <br>
            <div>
                <div style="display: flex;">
                    <h2 style="padding-right: 20px;">Publish Inventory </h2>
                    <button class="btn btn-primary" @click="publishInventory" :disabled="inventory_percent > 0 && inventory_percent < 100">Publish</button>
                </div>
                <k-progress :percent="inventory_percent" />
                {{inventory.status}}
            </div>
            <br>
            <div>
                <div style="display: flex;">
                    <h2 style="padding-right: 20px;">Publish Marketing </h2>
                    <button class="btn btn-primary" @click="publishMarketing" :disabled="marketing_percent > 0 && marketing_percent < 100">Publish</button>
                </div>
                <k-progress :percent="marketing_percent" />
                {{marketing.status}}
            </div>
        </div>
    </section>
</template>

<script>
    import PageHeader from '@/components/shared/PageHeader';
    import {publishStore} from '@/stores';

    export default {
        components: {
            PageHeader, 
            },

        props: [
            'subview'
        ],

        data() {
            return {
                catalogue: {},
                inventory: {},
                marketing: {}
            }
        },

        computed: {
            catalogue_percent() {
                if(this.catalogue.status === 'started') {
                    return 30
                } else if(this.catalogue.status ===  'catalogue copy in progress') {
                    return 60
                } else if(this.catalogue.status ===  'catalogue publish complete') {
                    return 100
                } else if (this.catalogue.status === 'initialising') {
                    return 10
                } else {
                    return 0
                }
            },
            inventory_percent() {
                if(this.inventory.status === 'started') {
                    return 30
                } else if(this.inventory.status ===  'inventory copy in progress') {
                    return 60
                } else if(this.inventory.status ===  'inventory publish complete') {
                    return 100
                } else if (this.inventory.status === 'initialising') {
                    return 10
                } else {
                    return 0
                }
            },
            marketing_percent() {
                if(this.marketing.status === 'started') {
                    return 30
                } else if(this.marketing.status === 'marketing copy in progress') {
                    return 60
                } else if(this.marketing.status === 'marketing publish complete') {
                    return 100
                } else if (this.marketing.status === 'initialising') {
                    return 10
                } else {
                    return 0
                }
            }
        },

        async created()
        {
            let history = await publishStore.history()

            this.catalogue = history.catalogue || {}
            this.inventory = history.inventory || {}
            this.marketing = history.marketing || {}

            var channel = Echo.channel('publish-update');
            channel.listen('.publish-update', (data) => {

                if(data.message.database === "catalogue") {
                    this.catalogue = data.message
                } else if(data.message.database === "inventory") {
                    this.inventory = data.message
                } else if(data.message.database === "marketing") {
                    this.marketing = data.message
                }

            });
        },

        methods: {
            async publish()
            {
                this.catalogue.status = "initialising"
                this.inventory.status = "initialising"
                this.marketing.status = "initialising"

                await publishStore.publishAll()
            },

            async publishCatalogue()
            {
                this.catalogue.status = "initialising"
                await publishStore.publishSeparate("catalogue")
            },

            async publishInventory()
            {
                this.inventory.status = "initialising"
                await publishStore.publishSeparate("inventory")
            },

            async publishMarketing()
            {
                this.marketing.status = "initialising"
                await publishStore.publishSeparate("marketing")
            }
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

</style>