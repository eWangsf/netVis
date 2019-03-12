
import React, { Component } from 'react';
import { connect } from 'react-redux';

import SimpleMapSection from 'containers/SimpleMapSection';
import { get_candidates_detail } from 'actions';

import RoseSection from 'containers/RoseSection';
import CandidatedescSection from 'containers/CandidatedescSection';
import CompareSection from 'containers/CompareSection';

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
    this.props.getCandidatesDetail();

  }

  render() {
    
    return <div className="layout solutions-layout">
              <div className="top">
                <div className="left">
                    <SimpleMapSection  candidates={this.props.candidates}/>
                </div>
                <div className="middle">
                  <RoseSection candidates={this.props.candidates} />
                    {/* <div className="roseview-wrapper">
                    玫瑰图
                    </div> */}
                </div>
                <div className="right">
                  <CandidatedescSection candidate={this.props.candidates[0]} />
                  {/* <div className="locationdetail-wrapper">
                  地点详情
                  </div> */}
                </div>
              </div>
              <div className="bottom">
                <CompareSection candidates={this.props.candidates}/>
                {/* <div className="compare-wrapper">
                  compare
                </div> */}
              </div>
            
      </div>
  }
}

function mapStateToProps(store) {
  return {
    candidates: store.candidates,
    // heatmapdata: store.heatmapdata,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getCandidatesDetail(successCb, failCb) {
      dispatch(get_candidates_detail(successCb, failCb));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SolutionsView);
