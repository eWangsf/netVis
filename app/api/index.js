import axios from 'axios';
const CancelToken = axios.CancelToken;

const responseBody = res => res.data;

const api_point = location.hostname.includes('localhost') ? 'http://localhost:8081/api' : `${location.origin}/api`;
const hc = axios.create({
  baseURL: api_point,
  timeout: 100000
});



class Api {
    websocket() {

    }
    getByUrl(path, params, withToken, verison) {
      const hc_url = axios.create({
        baseURL: path,
        timeout: 100000
      });
      return hc_url.get('', {headers: this.getHeaders(withToken, verison), params})
        .then(responseBody)
    }
    
    get(path, params, withToken, verison) {
      return hc.get(path, {headers: this.getHeaders(withToken, verison), params})
        .then(responseBody)
    }

    post(path, data, withcancel=0, withToken, verison) {
      if(withcancel) {
        var cancelseed = undefined;
        var request = hc.post(path, data, {
          cancelToken: new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancelseed = c;
          })
        }, {headers: this.getHeaders(withToken, verison)})
        .then(responseBody)
        return {
          cancelseed,
          request
        }
      }
      return hc.post(path, data, {headers: this.getHeaders(withToken, verison)})
        .then(responseBody)
    }

    put(path, data, withToken, verison) {
      return hc.put(path, data, {headers: this.getHeaders(withToken, verison)})
        .then(responseBody)
    }

    delete(path, params, withToken, verison) {
      return hc.delete(path, {headers: this.getHeaders(withToken, verison), params})
        .then(responseBody)
    }

    getHeaders(withToken=false, version=1) {
        let headers = {
          "Content-Type": "application/json",
          "Accept": `application/vnd.netVis+json;version=${version}`
        };
        return headers;
    }

}

const api = new Api();
api.url = api_point;
export default api;