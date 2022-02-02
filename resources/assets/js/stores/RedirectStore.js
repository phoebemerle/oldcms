import {http} from '@/services';
import {event} from '@/services';
import {sharedStore} from '@/stores';
import {endPoints} from '@/services';


export const RedirectStore = {

    state: {
        redirects: [],
    },

  getUrlRedirect(url, oldUrl){
    sharedStore.showLandingPage();
      return new Promise((resolve, reject) => {
        http.post(endPoints.catalogue + 'url-redirects/check', {url: url, old_url:oldUrl}, ({data}) => {

          let count = data.data.length;

          sharedStore.hideLoadingPage();

          if(data.length > 0) {
            resolve(data.data[(count - 1)].attributes.new_url);
          }else{
            resolve(null);
          }
        }, error => reject(error));
      });
  },

  savedNewRedirect(data){
    sharedStore.showLandingPage();
    return new Promise ((resolve, reject) => {
      http.post(endPoints.catalogue + 'url-redirects/new' ,data, ({data})=>{
        sharedStore.hideLoadingPage();
      }, error => reject(error, sharedStore.hideLoadingPage()));
    });
  }

}