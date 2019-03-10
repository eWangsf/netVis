
import React, { Component } from 'react';
import { connect } from 'react-redux';

import SimpleMapSection from 'containers/SimpleMapSection';
// import MapSection from 'containers/MapSection';
// import TimelineSection from 'containers/TimelineSection';
// import OperationSection from 'containers/OperationSection';

import {  } from 'actions';
import './index.scss';


class SolutionsView extends Component {
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
    
    return <div className="layout solutions-layout">
              <div className="left">
                <div className="top">
                    <SimpleMapSection />
                </div>
                <div className="bottom">
                barchart
                </div>
              </div>
              <div className="right">
              timeline
              </div>
            
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

export default connect(mapStateToProps, mapDispatchToProps)(SolutionsView);
