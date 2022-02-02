<template>
    <div class="details-form">
        <div class="details-form__body">
            <div>
                <label>Group Name</label>
                <input title="Group Name" name="name" type="text" v-model="groupName">
            </div>
            <div>
                <label>Group Code</label>
                <input title="Group Code" name="code" type="text" v-model="groupCode">
            </div>
            <div>
                <button class="btn btn-primary" @click="submitGroup()">{{buttonText}}</button>
            </div>
        </div>
    </div>
    
</template>

<script>
    import {productGroupsStore} from '@/stores';
    import {event} from '@/services';

    export default {
        props:['type', 'group'],


        data(){
            return{
                buttonText:'Create Group',
                groupName:'',
                groupCode:'',
                groupID: ''
            }
        },

        watch:{
            type(){
                if(this.type === 'edit-group'){
                    this.buttonText = 'Update Group'
                }else{
                    this.buttonText = 'Create Group'
                    this.reset();
                }
            },
            group(){
                if(this.type === 'edit-group') {
                    this.groupName = this.group.attributes.name;
                    this.groupCode = this.group.attributes.code;
                    this.groupID = this.group.id;
                }else{
                    this.reset();
                }
            }
        },

        methods:{
            reset(){
                this.groupName = '';
                this.groupCode = '';
                this.groupID = '';
            },

            async submitGroup(){

                var data = {
                    'data':{
                        'id': this.groupID,
                        'type': 'productgroup', 
                        'attributes':{
                            "name":this.groupName,
                            "code":this.groupCode
                        },
                    }
                };

                if(this.type === 'edit-group') {
                    try {
                        await productGroupsStore.edit(data, this.groupID);
                    } catch (error) {
                         event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error');
                    }
                }else if (this.type === 'create-group'){
                    try {

                        await productGroupsStore.create(data);
                    } catch (error) {

                        event.emit(event.names.USER_MESSAGE, 'Your action was not successful, an error has occurred', 'error');
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";
    @import "~#/mixins";

    .group-form{
        flex: 1;
        position: relative;
        font-size:1.4rem;

        &--body{
            div{
                margin: 1rem 0;
            }

            input{
                border-radius:0.5rem;
                border: 1px solid $border-color;
                width:40rem;
            }

            label{
                margin-right:.5rem;
                width:15rem;
            }

            .btn-primary{
                font-size:1.2rem;
            }
        }
    }

</style>