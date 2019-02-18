import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get_data } from 'actions';
import path from 'path';
import L from 'leaflet';
import {} from 'libs/leaflet-heat';
import { center, defaultzoom, copytext } from 'constants/mapconfig';

import './index.scss';

var intervalclock = null;
var map = null;
var updateinterval = 2000;

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
    this.props.getData();
    this.mapInit();

    intervalclock = setInterval(() => {
      console.log('2', this.props.edges.length)
      // this.mapNodesUpdate();
      if(this.props.edges.length === this.state.edgescount) {
        clearInterval(intervalclock);
        intervalclock = null;
        console.warn('mapHeatMapUpdate rendering...')
        this.mapHeatMapUpdate();
        return ;
      }
      console.log('unfished', this.props.edges.length)
      this.setState({
        edgescount: this.props.edges.length
      })
    }, updateinterval);
    // setTimeout(this.mapHeatMapUpdate, 1000);
  }
  mapInit() {
    map = L.map('map').setView(center, defaultzoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: copytext
    }).addTo(map);

    
    // L.marker([30.5, -97]).addTo(map)
    //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //     .openPopup();
  }

  mapNodesUpdate() {
    // console.warn(this.props.nodecheckincountmap)
  }

  mapHeatMapUpdate() {
    var headmapdata = this.props.edges.map((item, index) => {
      var _ins = Math.random().toFixed(2) 
      return [+item.lat.toFixed(2), +item.lng.toFixed(2), parseInt(_ins * 100)];
    })
    console.warn(headmapdata)
    var heat = L.heatLayer(headmapdata, {radius: 10}).addTo(map);
    console.warn('mapHeatMapUpdate rendered...')
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
