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
              <div className="section-title">clusters 
                <p>checkingroups: {this.props.checkingroups.length}</p>
                <p>uids: {this.props.uids.length}</p>
                <p>lids: {this.props.lids.length}</p>
                <p>edges: {this.props.edges.length}</p>
              </div>

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
    lids: store.lids,
    uids: store.uids,
    checkingroups: store.checkingroups,
    edges: store.edges
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
