<template>
    <form :class="['login-form', {'login-form--error': failed}]" @submit.prevent="login">
        <div class="login-form__logo-box">
            <img class="login-form__logo" src="images/logo.png" alt="logo">
        </div>
        <input class="login-form__input" v-model="email" type="email" placeholder="Email Address" autofocus required>
        <input class="login-form__input" v-model="password" type="password" placeholder="Password" required>
        <button name="login" id="login" class="login-form__submit" type="submit">Log In</button>
    </form>
</template>

<script>
    import {userStore} from '@/stores/user';
    export default {
        data() {
            return {
                email: '',
                password: '',
                failed: false
            }
        },
        methods: {
            async login() {
                try {
                    await userStore.login(this.email, this.password);
                    this.$emit('loggedin');
                } catch (error) {
                    this.failed = true;
                    setTimeout(() => this.failed = false, 2000);
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";
    @import "~#/animations";
    .login-form {
        width: 28rem;
        padding: 3rem 1.8rem;
        background-color: $color-primary;
        border-radius: .6rem;
        border: 1px solid darken($color-primary, 20%);
        box-shadow: 2px 2px 1rem rgba($color-black, .5);

        &--error {
            border: 2px solid $color-error;
            animation: shake .5s;
        }

        &__logo-box {
            text-align: center;
            margin-bottom: 2rem;
        }

        &__logo {
            width: 10rem;
            padding: 1rem;
            border-radius: 1.5rem;
            background-color: $color-white;
            border: 2px solid darken($color-primary, 20%);
        }

        &__input {
            display: block;
            width: 100%;
            margin-top: .5rem;
        }

        &__submit {
            display: block;
            width: 100%;
            margin-top: 1.2rem;

            @include button-when-pressed;
            &:active {
                color: darken($color-white, 10%);
            }
        }
    }
</style>