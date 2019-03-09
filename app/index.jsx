import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'store';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import App from 'containers/App';


import './index.scss';
import 'antd/dist/antd.css';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


export default class NetVis extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
          <App />
      </Provider>
    )
  }
}

ReactDOM.render((
  <NetVis />
), document.getElementById('root'));
