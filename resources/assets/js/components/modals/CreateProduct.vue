<template>
    <div class="create-product" v-if="showing">
        <form class="create-product__form" @submit.prevent="submit">
            <div class="create-product__close" @click="close"></div>
            <div class="create-product__header">
                <div class="create-product__title">
                    Create Product
                </div>
            </div>
            <div class="create-product__content">
                <div class="create-product__form-row">
                    <div class="create-product__form-label">Title</div>
                    <input class="create-product__form-input" title="Title" type="text" name="title" v-model="title"
                           placeholder="Enter a title here" required
                           autofocus>
                </div>
                <div class="create-product__form-row create-product__form-row--tinymce">
                    <div class="create-product__form-label">Short Description</div>

                    <tinymce :id="'shortDesc'" class="create-product__form-input" title="Title" name="title" v-model="shortDesc"
                              placeholder="Enter an overview here" required
                    ></tinymce>
                </div>
                <div class="create-product__form-row create-product__form-row--tinymce">
                    <div class="create-product__form-label">Long Description</div>

                    <tinymce :id="'longDesc'" class="create-product__form-input" title="Title" name="title" v-model="longDesc"
                              placeholder="Enter an overview here" required
                    ></tinymce>
                </div>
            </div>
            <button class="create-product__submit">Save</button>
        </form>
    </div>
</template>

<script>
    import {productStore} from '@/stores';

    export default {

        data() {
            return {
                showing: false,
                title: '',
                shortDesc: '',
                longDesc: ''
            }
        },
        methods: {
            open() {
                this.showing = true;
            },
            close() {
                this.showing = false;
            },
            clear() {
                this.title = '';
                this.shortDesc = '';
                this.longDesc = '';
            },
            async submit() {
                try {
                    await productStore.create({
                        title: this.title,
                        short_description: this.shortDesc,
                        overview: this.longDesc
                    });
                    this.clear();
                    this.close();
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '~#/mixins';

    .create-product {
        @include is-overlay;

        &__form {
            position: relative;
        }
        &__close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            cursor: pointer;
            &::before {
                font-family: FontAwesome;
                content: "\f00d";
                font-size: 2.5rem;
                color: $color-black;
            }
            &:active {
                opacity: .8;
            }
        }

        &__header {
            height: 6rem;
            line-height: 6rem;
            border-bottom: 1px solid $color-primary;
            background-color: rgba($color-primary, .5);
        }

        &__title {
            padding-left: 2rem;
            text-transform: uppercase;
            font-size: 2.5rem;
        }

        &__content {
            padding: 1rem;
        }

        &__form-row {
            height: 4rem;
            line-height: 4rem;

            &--tinymce {
                height: 15rem;
                tinymce {
                    height: 11rem;
                    display: block;
                    width: 100%;
                    max-width: 100%;
                    min-width: 30%;
                    max-height: 200%;
                    min-height: 30%;
                }
            }
        }
        &__form-label {
            display: inline-block;
            &:after {
                content: ':'
            }
        }
        &__form-input {
            border: 1px solid $color-black;
        }

        &__submit {
            font-size: 3rem;
            position: absolute;
            bottom: 2rem;
            padding: 1rem 2rem;
            left: 50%;
            transform: translateX(-50%);
            @include button-when-pressed;
        }
    }
</style>