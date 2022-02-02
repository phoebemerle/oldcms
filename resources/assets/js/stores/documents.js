import {http} from '@/services';
import {event} from '@/services';
import {cdnStore} from '@/stores';
import {endPoints} from '@/services';
import {getEnv} from "bootstrap-vue/esm/utils/env";

export const documentStore = {

    state: {
        documents: [],
    },


    async loadDocuments(documentInfo){
        let document = null;

        if(this.state.documents.length > 0){
            document = this.checkState(documentInfo.id);
        }

        if(document === null){
            document = await this.getDocuments(documentInfo.id);

            if(document.attributes.source === 'CDN') {
                let cdnInfo = await cdnStore.getFromCDN(document.attributes.source_id);
                document.attributes.url = cdnInfo.data.attributes.url;
            }

            this.state.documents.push(document);
        }
        return document;
    },

    checkState(documentID){
        let document = null;

        for(let g =0; g < this.state.documents.length; g++){
            if(this.state.documents[g].id.toString() === documentID.toString()){
                document =  this.state.documents[g];
            }
        }
        return document;
    },

    getDocuments(id){
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'documents/' + id, response => {
                resolve(response.data.data);
            }, error => reject(error));
        });
    },

    create(data, url){
        return new Promise((resolve, reject)=>{
            http.post(endPoints.catalogue + 'documents', data, ({data})=>{
                data.data.attributes.link = 'https://comximages.blob.core.windows.net/files/'+data.data.attributes.source_id;
                this.state.documents.push(data.data);
                resolve(data.data);
            },
            error => reject (error));
        })
    },

    update(id, data){
      return new Promise ((resolve, reject)=>{
          http.patch(endPoints.catalogue + 'documents/'+id, data, ({data})=>{
              for(let a=0; a < this.state.documents.length; a++){
                  if(this.state.documents[a].id.toString() === id.toString()){
                      this.state.documents[a].attributes.alt_tag = data.data.attributes.alt_tag;
                      this.state.documents[a].attributes.title = data.data.attributes.title;
                  }
              }
              resolve(data.data);
          },
          error => reject(error));
      })
    },

    delete(id){
        return new Promise((resolve, reject)=>{
            http.delete(endPoints.catalogue + 'documents/'+ id, id, ({data})=>{
                for(let y =0; y < this.state.documents.length; y++){
                    if(this.state.documents[y].id.toString() === id.toString()){
                        this.state.documents.splice(y,1);
                    }
                }
                resolve(data);
            }, error => reject(error));
        });
    },

    saveDocumentToProduct(data){
        return new Promise((resolve, reject) => {
            http.post(endPoints.catalogue + 'product-documents', data, ({data}) => {
                resolve(data.data);
            }, error => reject(error));
        })
    },

}