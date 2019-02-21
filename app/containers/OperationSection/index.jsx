import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  } from 'actions';
import icon from 'leaflet/dist/images/marker-icon.png';

import './index.scss';

class OperationSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  } 

  componentDidMount() {
  }


  render() {

    return <div className="operation-section-wrapper">
    
            <div className="section clusters-section">
              <div className="section-title">clusters</div>

            </div>

            <div className="section hotspots-section">
              <div className="section-title">hotspots</div>

            </div>

            <div className="section record-section">
              <div className="section-title">record</div>

            </div>

          <img src={icon} />
      </div>
  }
}

function mapStateToProps(store) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // checkLogin(successCb, failCb) {
    //   dispatch(load_userfromwechat(successCb, failCb));
    // },
    

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OperationSection);
