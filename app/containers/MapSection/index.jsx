import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get_data } from 'actions';
import L from 'leaflet';
// import Header from 'components/header';
// import Footer from 'components/footer';
// console.warn(L, L.Map)

import './index.scss';
import 'leaflet/dist/leaflet.css';

class MainSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  } 

  componentDidMount() {
    this.props.getData();
    var map = L.map('map', {
        center: [51.505, -0.09],
        zoom: 13
    });
  }


  render() {

    return <div className="map-section-wrapper">
        <div id="map" ></div>
      </div>
  }
}

function mapStateToProps(store) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getData(successCb, failCb) {
      dispatch(get_data(successCb, failCb));
    },
    

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainSection);
