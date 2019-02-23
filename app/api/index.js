import axios from 'axios';

const responseBody = res => res.data;

const api_point = location.hostname.includes('localhost') ? 'http://localhost:8081/api' : `${location.origin}/api`;
const hc = axios.create({
  baseURL: api_point,
  timeout: 50000
});

class Api {
    websocket() {

    }
    
    get(path, params, withToken, verison) {
      return hc.get(path, {headers: this.getHeaders(withToken, verison), params})
        .then(responseBody)
    }

    post(path, data, withToken, verison) {
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