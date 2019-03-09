import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  } from 'actions';

import './index.scss';

class InputSection extends Component {
  
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

    return <div className="input-section-wrapper">
        233
      </div>
  }
}

function mapStateToProps(store) {

  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // getHotSpots(successCb, failCb) {
    //   dispatch(get_hotspots(successCb, failCb));
    // },
    

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputSection);
