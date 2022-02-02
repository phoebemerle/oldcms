<template>
    <section class="page-header">
        <h1 class="page-header__title">
            <slot name="title"></slot>
        </h1>
    </section>
</template>
<script>
    import {event} from '@/services';

    export default {

    };
</script>

<style lang="scss">
    @import "~#/variables";
    .page-header {
        padding-left: 1rem;

        &__title {
            height: 5rem;
            line-height: 5rem;
            font-size: 3rem;
            font-weight: 100;
            border-bottom: 1px solid $color-underline;
        }
    }
</style>