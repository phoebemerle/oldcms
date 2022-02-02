<template>
    <div id="userMessageContainer" v-bind:class="{'successMessage': successful, 'errorMessage':error, 'activeUserMessage':userMessage.length > 0}">
        <div id="userMessageContainer__Message" >
            {{userMessage}}
        </div>
    </div>
</template>

<script>
    import {event} from '@/services';

    export default {
        name: "UserMessage",

        data() {
            return {
                userMessage:"",
                successful:false,
                error:false
            }
        },

        created() {
            event.on(event.names.USER_MESSAGE, (message, type) => {
                if (type === 'success') {
                    this.successful = true;
                    this.error = false;
                } else {
                    this.error = true;
                    this.success = false;
                }
                this.userMessage = message;

                setTimeout(this.clearMessage, 4000);
            });
        },

        methods:{
            clearMessage(){
                this.successful = false;
                this.error = false;
                this.userMessage = '';
            }
        }

    }
</script>

<style lang="scss">
    @import "~#/variables";


    #userMessageContainer{
        width: 100%;
        height: 60px;
        padding: 16px 20px;
        font-size: 17px;
        text-align: center;
        margin: 0 auto;
        z-index: 9999;
        position: fixed;
        top: -70px;
        transition: all 0.5s linear;

        &__Message{
                width: 100%;
                margin: 0 auto;
                max-width: 700px;
        }
    }


    .activeUserMessage  {
        color: #FFFFFF;
        top: 0 !important;
    }

    .errorMessage{
        background-color: #ff484b;
    }

    .successMessage {
        background-color: #8cce55;
    }
</style>