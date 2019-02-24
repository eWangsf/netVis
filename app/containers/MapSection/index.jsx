import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'debounce';
import path from 'path';

import { get_location_heat, get_locations_in_bound } from 'actions';
import L from 'leaflet';
import {} from 'libs/leaflet-heat';
import { center, defaultzoom, copytext, heatPageSize } from 'constants/mapconfig';

import './index.scss';

var map = null;
var heat = null;
var triggerBoundDataZoom = 12;
var triggerLocationDetailRenderZoom = 17;
var debouncetime = 400;

var warn = (msg) => {
  console.warn(msg);
}

class MainSection extends Component {
  constructor(props) {
    super(props);

    this.mapInit = this.mapInit.bind(this);
    this.mapEventHandler = this.mapEventHandler.bind(this);
    this.heatMap = this.heatMap.bind(this);
    this.mapHeatMapUpdate = this.mapHeatMapUpdate.bind(this)
    this.locationDetailRender = this.locationDetailRender.bind(this);

    this.state = {
      locationcount: 0,
      locationmarkers: [],
    }
  } 

  componentDidMount() {
    // this.heatMap();
    this.mapInit();
  }

  mapInit() {
    map = L.map('map').setView(center, defaultzoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: copytext
    }).addTo(map);

    map.on('zoom', debounce(this.mapEventHandler, debouncetime));
    map.on('drag', debounce(this.mapEventHandler, debouncetime));

  }

  mapEventHandler() {
    var zoomlevel = map.getZoom();

    if(zoomlevel >= triggerBoundDataZoom) {
      this.getBoundLocationsData();
    }
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

  getBoundLocationsData() {
    warn('---- trigger: getBoundLocationsData ---')

    var mapbound = map.getBounds(),
        latrange = [mapbound._southWest.lat, mapbound._northEast.lat],
        lngrange = [mapbound._southWest.lng, mapbound._northEast.lng];

    this.props.getLocationsByBound(latrange, lngrange, (locations) => {
      warn(`getBoundLocationsData success: ${locations.length} locations searched`);
      
      this.locationDetailRender();
      
    });
  }
  locationDetailRender() {
    this.clearLocationMarkers();
    
    var zoomlevel = map.getZoom();
    console.warn('zoomlevel ', zoomlevel)
    if(zoomlevel <= triggerLocationDetailRenderZoom) {
      return ;
    }

    warn('---- trigger: locationDetailRender ---');

    var mapbound = map.getBounds(),
        latrange = [mapbound._southWest.lat, mapbound._northEast.lat],
        lngrange = [mapbound._southWest.lng, mapbound._northEast.lng];

    var inboundlocation = this.props.boundlocations.filter(item => item.lat > latrange[0] && item.lat < latrange[1] && item.lng > lngrange[0] && item.lng < lngrange[1]);
    var locationmarkers = [];

    inboundlocation.forEach(item => {
      var marker = L.marker([item.lat, item.lng]).addTo(map)
        .bindPopup(`record: ${JSON.stringify(item)}, zoom: ${map.getZoom()} `)
        .openPopup();
      locationmarkers.push(marker);
    })

    this.setState({
      locationmarkers: locationmarkers
    })
    warn(`locationDetailRendered ${locationmarkers.length} markers rendered`)

  }
  clearLocationMarkers() {
    this.state.locationmarkers.forEach(item => {
      map.removeLayer(item)
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
    boundlocations: store.boundlocations,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getHeat(loctioncount, successCb, failCb) {
      dispatch(get_location_heat(loctioncount, successCb, failCb));
    },
    getLocationsByBound(latrange, lngrange, successCb, failCb) {
      dispatch(get_locations_in_bound(latrange, lngrange, successCb, failCb))
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainSection);
