import {http} from '@/services';
import {event} from '@/services';
import {sharedStore} from '@/stores';
import {endPoints} from '@/services';


export const glossaryStore = {

    state: {
        terms: [],
    },

  searchStore(searchTerm){
    sharedStore.showLandingPage();
    if(searchTerm.length > 0) {
      return new Promise((resolve, reject) => {
        http.post(endPoints.catalogue + 'glossary-terms/search', {searchWord: searchTerm}, ({data}) => {
          sharedStore.hideLoadingPage();
          this.state.terms = data.data;
          resolve(data.data);
        }, error => reject(error));
      });
    }
  },

    async getTerms(){
        sharedStore.showLandingPage();
        return new Promise((resolve, reject) => {
            http.get(endPoints.catalogue + 'glossary-terms', response => {
                this.state.terms = response.data.data;
                sharedStore.hideLoadingPage();
                resolve(response.data.data);
            }, error => reject(error, sharedStore.hideLoadingPage()));
        });
    },

  async getDefinition(ID){
    sharedStore.showLandingPage();
    let DefId = '';

    for(let x =0; x < this.state.terms.length; x++){
      if(this.state.terms[x].id.toString() === ID.toString()){
        DefId =  this.state.terms[x].relationships['glossary-definitions'].data.id;
      }
    }

    return new Promise((resolve, reject) => {
      http.get(endPoints.catalogue + 'glossary-definitions/'+ DefId, response => {
        sharedStore.hideLoadingPage();
        resolve(response.data.data);
      }, error => reject(error, sharedStore.hideLoadingPage()));
    });
  },

  updateDefinition(data, id) {
    return new Promise((resolve, reject) => {
      http.patch(endPoints.catalogue + 'glossary-definitions/' + id, data, ({data}) => {
            event.emit(event.names.USER_MESSAGE, 'Definition was updated successfully', 'success');
            resolve(data.data);
            sharedStore.hideLoadingPage();
          },
          error => reject(error, sharedStore.hideLoadingPage()));
    })
  },

    updateTerm(data, id){
      return new Promise ((resolve, reject)=>{
        http.patch(endPoints.catalogue + 'glossary-terms/'+id, data, ({data})=>{
              event.emit(event.names.USER_MESSAGE, 'Glossary Term was updated successfully', 'success');
              resolve(data.data);
              sharedStore.hideLoadingPage();
            },
            error => reject(error, sharedStore.hideLoadingPage()));
      })
  },

  deleteTerm(id){
    return new Promise((resolve, reject) => {
      http.delete(endPoints.catalogue + 'glossary-terms/' + id, id, ({ response }) => {
        event.emit(event.names.USER_MESSAGE, 'Your video was successfully deleted', 'success');
        resolve(response);
      }, error => reject(error));
    });
  },

  saveNewTerm(data){
    sharedStore.showLandingPage();
    return new Promise((resolve, reject) =>{
      http.post(endPoints.catalogue + 'glossary-terms', data,({data}) => {
        resolve(data);
        sharedStore.hideLoadingPage();
      }, error => reject(error, sharedStore.hideLoadingPage()));
    })
  }

}