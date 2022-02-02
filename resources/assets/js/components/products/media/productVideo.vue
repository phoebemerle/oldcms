<template>

    <div id="mediaImagesContainer">
        <div id="mediaImagesSection">
            <div v-for="video in attachedVideos">
                <div class="mediaInputSection">
                    <label for="videoEmbeddedCode">Embedded Code</label>
                    <input id="videoEmbeddedCode" type="text" v-model="video.embedded_code"/>
                </div>

                <div class="mediaInputSection">
                    <label for="videoOrder">Order</label>
                    <input id="videoOrder" type="number" v-model="video.order"/>
                </div>

                <div class="mediaInputSection">
                    <label for="videoActive">Active</label>
                    <input id="videoActive" type="checkbox" v-model="video.active"/>
                </div>
                <div class="mediaInputSection">
                    <span class="search-container__table__add" @click="addNewVideo()"> Add New Video</span>
                </div>
                <div class="mediaInputSection">
                    <span class="search-container__table__remove" @click="removeVideo(video)"> Remove Video</span>
                </div>
            </div>
            <div class="mediaInputSection">
                <button @click="saveInfo()">Save Video Information</button>
            </div>
        </div>
    </div>
    
</template>

<script>
    import {event} from '@/services';
    import {productStore} from '@/stores';
    import {videoStore} from '@/stores';

    export default {
        name: "productVideo",

        props:['product', 'videos'],

        data(){
            return{
                attachedVideos:this.videos
            }
        },

        watch:{
          videos(){
              if(this.videos.length > 0) {
                  this.attachedVideos = this.videos;
              }
              else{
                  this.attachedVideos = [
                      {
                          'embedded_code':'',
                          'order':1,
                          'active': '',
                          'id': '',
                      }
                  ]
              }
          }
        },

        methods:{
            saveInfo(){

                let data = {
                    'data':{
                        'type':'product-videos',
                        'attributes':{
                            'product_id': this.product.id,
                            'videos': this.attachedVideos
                        }
                    }
                };

                videoStore.storeVideoInfo(data);

            },

            addNewVideo(){

                this.attachedVideos.push({
                    order:this.attachedVideos.length+1,
                    active: 0,
                    id: null,
                })
            },

            removeVideo(video){
                videoStore.deleteVideo(video);
                  for(let a = 0; a < this.attachedVideos.length; a++){
                        if(this.attachedVideos[a].id.toString() === video.id.toString()){
                            this.attachedVideos.splice(a, 1);
                        }
                    }
            }
        }
    }
</script>

<<style lang="scss">
    @import "~#/variables";

    .mediaInputSection {

        input[type=number], input[type=checkbox]{
            width:100px;
        }
    }

</style>