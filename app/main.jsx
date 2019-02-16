import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'store';
import MapSection from 'containers/MapSection';
import OperationSection from 'containers/OperationSection';

import './index.scss';

export default class App extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
          <div className="layout">
            <div className="main-section" id="main">
                <MapSection />
            </div>
            <div className="append-section" id="append">
                <OperationSection />
            </div>
          </div>
      </Provider>
    )
  }
}

ReactDOM.render((
  <App />
), document.getElementById('root'));
