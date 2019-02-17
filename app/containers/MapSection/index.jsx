import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get_data } from 'actions';
import path from 'path';
import L from 'leaflet';
import { center, defaultzoom, copytext } from 'constants/mapconfig';

import './index.scss';

class MainSection extends Component {
  constructor(props) {
    super(props);

    this.mapUpdateNodes = this.mapUpdateNodes.bind(this)
    this.state = {
    }
  } 

  componentDidMount() {
    this.props.getData();
    this.mapInit();

    setInterval(this.mapUpdateNodes, 1000);
  }
  mapInit() {
    var map = L.map('map').setView(center, defaultzoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: copytext
    }).addTo(map);

    L.marker([30.5, -97]).addTo(map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();
  }

  mapUpdateNodes() {
    console.warn(this.props.nodecheckincountmap)
  }

  render() {
    return <div className="map-section-wrapper">
        <div id="map" ></div>
      </div>
  }
}

function mapStateToProps(store) {
  return {
    nodecheckincountmap: store.nodecheckincountmap,
    edges: store.edges
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
