
import React, { Component } from 'react';
import { connect } from 'react-redux';

import InputSection from 'containers/InputSection';
import MapSection from 'containers/MapSection';
import TimelineSection from 'containers/TimelineSection';
import OperationSection from 'containers/OperationSection';

import {  } from 'actions';
import './index.scss';


class MapView extends Component {
  constructor(props) {
    super(props);
  } 
  
  // static getDerivedStateFromProps(props, state) {
  //   return {
  //     ...state
  //   }
  // }

  componentDidMount() {
  }

  render() {
    
    return <div className="layout mapview-layout">
              <div className="left">
                  <div className="input-section">
                      <InputSection />
                  </div>
              </div>
              <div className="right">
                  <div className="map-section">
                      <MapSection />
                  </div>
              </div>
            
              {/* <div className="left">
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
              </div> */}
      </div>
  }
}

function mapStateToProps(store) {
  return {
    // heatmapdata: store.heatmapdata,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // getHeatByBound(bounds, successCb, failCb) {
    //   dispatch(get_heat_in_bound(bounds, successCb, failCb))
    // },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
