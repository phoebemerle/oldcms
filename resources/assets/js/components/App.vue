<template>
    <section class="app">
        <div class="app__main" v-if="authenticated">
            <main-wrapper/>
        </div>
        <div class="app__login" v-else>
            <login-form @loggedin="onUserLoggedIn"/>
        </div>
    </section>
</template>

<script>
    import {event, router, ls, CDN} from '@/services';
    import {forceReloadWindow} from '@/utils';
    import {sharedStore, userStore} from '@/stores';
    import MainWrapper from '@/components/layouts/MainWrapper';
    import LoginForm from '@/components/auth/LoginForm';

    export default {
        components: {MainWrapper, LoginForm},
        data() {
            return {
                authenticated: false
            }
        },
        methods: {
            onUserLoggedIn() {
                this.authenticated = true;
                this.init();
            },
            async init() {
                try {
                    await sharedStore.init();
                    router.init();
                    event.emit(event.names.APP_READY);
                } catch (error) {
                    console.log(error);
                }
            }
        },
        mounted() {
            if (ls.get('jwt-token')) {
                this.authenticated = true;
                this.init();
            }
        },
        created() {
            event.on(event.names.LOG_OUT, async () => {
                await userStore.logout();
                ls.remove('jwt-token');
                forceReloadWindow();
            });
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

    .app {
        display: flex;
        background-color: $color-main-bgr;


        &__login {
            @include vertical-center;
            min-height:1000px;
        }

    }
</style>