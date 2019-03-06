import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'store';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import MapSection from 'containers/MapSection';
import TimelineSection from 'containers/TimelineSection';
import OperationSection from 'containers/OperationSection';

import './index.scss';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


export default class App extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
          <div className="layout">
            <div className="left">
                <div className="map-section" id="main">
                    <MapSection />
                </div>
                <div className="timeline-section" id="timeline">
                    <TimelineSection />
                </div>
            </div>
            <div className="right">
              <div className="append-section" id="append">
                  <OperationSection />
              </div>
            </div>
          </div>
      </Provider>
    )
  }
}

ReactDOM.render((
  <App />
), document.getElementById('root'));
