import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get_location_heat } from 'actions';
import path from 'path';
import L from 'leaflet';
import {} from 'libs/leaflet-heat';
import { center, defaultzoom, copytext, heatPageSize } from 'constants/mapconfig';

import './index.scss';

var map = null;
var heat = null;

class MainSection extends Component {
  constructor(props) {
    super(props);

    this.mapInit = this.mapInit.bind(this);
    this.heatMap = this.heatMap.bind(this);
    this.mapHeatMapUpdate = this.mapHeatMapUpdate.bind(this)
    this.locationDetailRender = this.locationDetailRender.bind(this);

    this.state = {
      locationcount: 0,
    }
  } 

  componentDidMount() {
    this.heatMap();
    this.mapInit();
  }

  mapInit() {
    map = L.map('map').setView(center, defaultzoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: copytext
    }).addTo(map);

    map.on('zoomstart', function (evt) {
      var zoomlevel = evt.target._zoom;
      console.log(zoomlevel);
      if(zoomlevel > 13) {
        this.locationDetailRender();
      }
    }.bind(this))
  }

  heatMap() {
    this.props.getHeat(this.state.locationcount, (locationheats) => {
      this.mapHeatMapUpdate(locationheats);
      if(locationheats.length < heatPageSize) {
        console.log('所有数据传输完成：', this.state.locationcount, locationheats.length);
        return ;
      }
      this.heatMap();
    });
  }

  mapHeatMapUpdate(latestedges) {
    if(heat) {
      latestedges.forEach((item, index) => {
        heat.addLatLng([item.lat.toFixed(2), item.lng.toFixed(2), item.weight]);
      })
    } else {
      var headmapdata = latestedges.map((item, index) => {
        return [item.lat.toFixed(2), item.lng.toFixed(2), item.weight];
      })
      heat = L.heatLayer(headmapdata, {radius: 15}).addTo(map);
    }
    this.setState({
        locationcount: this.state.locationcount + latestedges.length
    })
  }

  locationDetailRender() {
    L.marker(center).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();
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
    getHeat(loctioncount, successCb, failCb) {
      dispatch(get_location_heat(loctioncount, successCb, failCb));
    },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainSection);
