import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  } from 'actions';
// import Header from 'components/header';
// import Footer from 'components/footer';

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
          operation section
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