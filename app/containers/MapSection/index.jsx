import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get_data, init_data } from 'actions';
import path from 'path';
import L from 'leaflet';
import {} from 'libs/leaflet-heat';
import { center, defaultzoom, copytext } from 'constants/mapconfig';

import './index.scss';

var intervalclock = null;
var map = null;
var heat = null;
var updateinterval = 1000;

class MainSection extends Component {
  constructor(props) {
    super(props);

    this.mapNodesUpdate = this.mapNodesUpdate.bind(this);
    this.mapHeatMapUpdate = this.mapHeatMapUpdate.bind(this)
    
    this.state = {
      edgescount: 0
    }
  } 

  componentDidMount() {
    this.props.getData(() => {
        setTimeout(() => {
          clearInterval(intervalclock);
        }, 2*updateinterval);
    });
    this.mapInit();

    intervalclock = setInterval(() => {
      this.mapHeatMapUpdate();
    }, updateinterval);
  }
  mapInit() {
    map = L.map('map').setView(center, defaultzoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: copytext
    }).addTo(map);
  }

  mapNodesUpdate() {
    // console.warn(this.props.nodecheckincountmap)
  }

  mapHeatMapUpdate() {
    var latestedges = this.props.edges.slice(this.state.edgescount, this.props.edges.length);
    console.log(this.props.edges.length, this.state.edgescount, latestedges.length, latestedges[latestedges.length - 1])
    if(heat) {
      latestedges.forEach((item, index) => {
        var _ins = Math.random().toFixed(2);
        heat.addLatLng([+item.lat.toFixed(2), +item.lng.toFixed(2), parseInt(_ins * 30)]);
      })
    } else {
      var headmapdata = this.props.edges.map((item, index) => {
        var _ins = Math.random().toFixed(2);
        return [+item.lat.toFixed(2), +item.lng.toFixed(2), parseInt(_ins * 30)];
      })
      heat = L.heatLayer(headmapdata, {radius: 15}).addTo(map);
    }
    this.setState({
        edgescount: this.props.edges.length
    })
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
      dispatch(init_data(successCb, failCb));
    },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainSection);
