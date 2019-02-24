import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'debounce';

import { get_location_heat, get_locations_in_bound, get_location_checkins_in_bound } from 'actions';
import L from 'leaflet';
import {} from 'libs/leaflet-heat';
import * as d3 from "d3";
import { AntPath, antPath } from 'leaflet-ant-path';
import { center, defaultzoom, copytext, heatPageSize } from 'constants/mapconfig';

import './index.scss';

var map = null;
var heat = null;
var triggerBoundDataZoom = 12;
var triggerLocationDetailRenderZoom = 17;
var triggerLocationUsersRenderZoom = 18;
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
    this.locationUsersRender = this.locationUsersRender.bind(this);

    this.state = {
      locationcount: 0,
      locationmarkersLayer: undefined,
      locationusersLayer: undefined
    }
  } 

  componentDidMount() {
    // this.heatMap();
    this.mapInit();
  }

  mapInit() {
    map = L.map('map', {
      maxZoom: 22
    }).setView(center, defaultzoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: copytext
    }).addTo(map);

    // L.marker(center).addTo(map);
    // var usercount = 5;
    // var degreescale = d3.scaleLinear().domain([0, usercount]).range([0, 2 * Math.PI]);
    // console.warn(map.getZoom(), defaultzoom)
    // for(var i = 0; i <= usercount; i++) {
    //   var userindex = i;

    //   L.circleMarker([center[0]+ 0.001 * (Math.cos(degreescale(userindex)) - map.getZoom()/defaultzoom), center[1]+ 0.001 * (Math.sin(degreescale(userindex)) - map.getZoom() / defaultzoom)], {
    //     fillOpacity: 0.5,
    //     fillColor: '#f00',
    //     radius: 10
    //   }).addTo(map)
    // }

    map.on('zoom', debounce(this.mapEventHandler, debouncetime));
    map.on('drag', debounce(this.mapEventHandler, debouncetime));
  }

  mapEventHandler() {
    var zoomlevel = map.getZoom();
      
    // this.clearLocationMarkers();

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
    warn(`zoomlevel ${zoomlevel}`)
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
      var marker = L.marker([item.lat, item.lng])
        .bindPopup(`record: ${JSON.stringify(item)}, zoom: ${map.getZoom()} `)
        .openPopup();
      locationmarkers.push(marker);
    })
    var locationmarkersLayer = L.layerGroup(locationmarkers).addTo(map);

    this.setState({
      locationmarkersLayer: locationmarkersLayer
    })
    warn(`locationDetailRendered ${locationmarkers.length} markers rendered`);

    this.props.getLocationUser(latrange, lngrange, (checkins) => {
        warn(`getLocationUser success: ${checkins.length} checkins searched`);
        this.locationUsersRender();
    })
  }

  locationUsersRender() {
    this.clearLocationUsers();

    var zoomlevel = map.getZoom();
    warn(`zoomlevel ${zoomlevel}`)
    if(zoomlevel <= triggerLocationUsersRenderZoom) {
      return ;
    }
    warn('---- trigger: locationUsersRender ---');

    var mapbound = map.getBounds(),
        latrange = [mapbound._southWest.lat, mapbound._northEast.lat],
        lngrange = [mapbound._southWest.lng, mapbound._northEast.lng];

    var boundusers = this.props.boundusers;
    var locationusers = [];

    boundusers.forEach((locationitem, locationindex) => {
      var degreescale = d3.scaleLinear().domain([0, locationitem.usermap.length]).range([0, 2 * Math.PI]);
      locationitem.usermap.forEach((useritem, userindex) => {
        // console.warn(locationitem, userindex, Math.cos(degreescale(userindex)), 0.000001 * Math.sin(degreescale(userindex)))
        var umarker = L.circleMarker([locationitem.lat + 0.00001 * Math.cos(degreescale(userindex)), locationitem.lng + 0.00001 * Math.sin(degreescale(userindex))], {
          fillOpacity: 0.5,
          fillColor: '#f00',
          radius: Math.max(6, useritem.weight*10)
        })
        locationusers.push(umarker);
      });
    })
    var locationusersLayer = L.layerGroup(locationusers).addTo(map);

    this.setState({
      locationusersLayer: locationusersLayer
    })
    warn(`locationUsersRender ${locationusers.length} usermarkers rendered`);

  }
  clearLocationMarkers() {
    if(map.hasLayer(this.state.locationmarkersLayer)) {
      map.removeLayer(this.state.locationmarkersLayer)
    }
  }
  clearLocationUsers() {
    if(map.hasLayer(this.state.locationusersLayer)) {
      map.removeLayer(this.state.locationusersLayer)
    }
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
    boundusers: store.boundusers
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getHeat(loctioncount, successCb, failCb) {
      dispatch(get_location_heat(loctioncount, successCb, failCb));
    },
    getLocationsByBound(latrange, lngrange, successCb, failCb) {
      dispatch(get_locations_in_bound(latrange, lngrange, successCb, failCb))
    },
    getLocationUser(latrange, lngrange, successCb, failCb) {
      dispatch(get_location_checkins_in_bound(latrange, lngrange, successCb, failCb));
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainSection);
