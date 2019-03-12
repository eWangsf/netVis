import React, { Component } from 'react';
import { connect } from 'react-redux';
import G2 from '@antv/g2';
import * as d3 from 'd3';
import Dash from 'components/dash';

import './index.scss';

class CandidatedescSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,

    }
  }

  componentDidMount() {
  }

  render() {
    const { candidate } = this.props;
    
    return <div className="candidatedesc-section-wrapper">
        <div className="dash-row">
          <Dash percent={30}></Dash>
        </div>
        <div className="location-base-info-row">
            <div className="numberlogo"></div>
            <div className="location-id">{candidate.lid}</div>
        </div>

     
    </div>
  }

}

function mapStateToProps(store) {
  return {

  }

}

function mapDispatchToProps(dispatch) {
  return {
    // getCandidatesDetail(successCb, failCb) {
    //   dispatch(get_candidates_detail(successCb, failCb));
    // },

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CandidatedescSection);
