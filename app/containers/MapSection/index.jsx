import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'debounce';
import L from 'leaflet';
import {} from 'libs/leaflet-heat';
import { StaticMap } from 'react-map-gl';
import { IconLayer } from 'libs/glmaps';
import DeckGL, { LineLayer, ScatterplotLayer } from 'deck.gl';
import * as d3 from "d3";
import { AntPath, antPath } from 'leaflet-ant-path';

import { get_location_heat, get_locations_in_bound, get_location_checkins_in_bound, get_location_detail } from 'actions';
import { center, defaultzoom, maxZoom, minZoom, copytext, heatPageSize, MAPBOX_TOKEN } from 'constants/mapconfig';
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

    this.mapEventHandler = this.mapEventHandler.bind(this);
    this.heatMap = this.heatMap.bind(this);
    this.mapHeatMapUpdate = this.mapHeatMapUpdate.bind(this)
    this.locationDetailRender = this.locationDetailRender.bind(this);
    this.locationUsersRender = this.locationUsersRender.bind(this);

    this.state = {
      viewState: {
        width: 400,
        height: 400,
        latitude: center.lat,
        longitude: center.lng,
        zoom: defaultzoom
      },  
      locationheats: [],
      locationcount: 0,
      locationmarkersLayer: undefined,
      locationusersLayer: undefined
    }
  } 

  componentDidMount() {
  }
  mapLoaded() {
    this.heatMap();

    // map.on('zoom', debounce(this.mapEventHandler, debouncetime));
    // map.on('drag', debounce(this.mapEventHandler, debouncetime));
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
      // this.mapHeatMapUpdate(locationheats);
      // if(locationheats.length < heatPageSize) {
      //   console.log('所有数据传输完成：', this.state.locationcount, locationheats.length);
      //   return ;
      // }
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

  iconClickHandler() {
    console.warn(arguments)
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
      marker.on('click', this.locationSelectHandler.bind(this, item));
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
        var umarker = L.circleMarker([locationitem.lat + 0.00001 * Math.cos(degreescale(userindex)), locationitem.lng + 0.00001 * Math.sin(degreescale(userindex))], {
          fillOpacity: 0.5,
          fillColor: '#f00',
          radius: Math.max(6, useritem.weight*10)
        })
        umarker.on('click', this.locationUserSelectHandler.bind(this, locationitem, useritem));
        locationusers.push(umarker);
      });
    })
    var locationusersLayer = L.layerGroup(locationusers).addTo(map);

    this.setState({
      locationusersLayer: locationusersLayer
    })
    warn(`locationUsersRender ${locationusers.length} usermarkers rendered`);
  }

  locationSelectHandler(location) {
    console.warn('locationSelectHandler', location);
    this.props.getLocationDetail(location.id, () => {
      debugger
    });
  }
  locationUserSelectHandler(locationitem, useritem) {
    console.warn('locationUserSelectHandler', locationitem, useritem)
  }

  clearLocationMarkers() {
    if(map.hasLayer(this.state.locationmarkersLayer)) {
      map.removeLayer(this.state.locationmarkersLayer)
    }
    this.clearLocationUsers();
  }
  clearLocationUsers() {
    if(map.hasLayer(this.state.locationusersLayer)) {
      map.removeLayer(this.state.locationusersLayer)
    }
  }
  
  handleViewStateChange({viewState}) {
    this.setState({
      viewState: viewState
    })
  }
  render() {
    return <div className="map-section-wrapper">
        <div id="map" >
            
        <DeckGL
          viewState={this.state.viewState}
          onViewStateChange={this.handleViewStateChange.bind(this)}
          controller={true}
          layers={[
            new IconLayer({
              data: this.props.heatmapdata,
              viewState: {
                bearing: 0,
                latitude: this.state.viewState.latitude,
                longitude: this.state.viewState.longitude,
                maxZoom: maxZoom,
                minZoom: minZoom,
                pitch: 0,
                zoom: this.state.viewState.zoom
              },
              id: 'icon-layer',
              showCluster: true,
              onClick: this.iconClickHandler.bind(this)
            })
          ]}
        >
          <StaticMap
              onLoad={this.mapLoaded.bind(this)}
              mapStyle="mapbox://styles/mapbox/dark-v9"
              preventStyleDiffing
              mapboxApiAccessToken={MAPBOX_TOKEN}
            />
            </DeckGL>
      </div>
      </div>
  }
}

function mapStateToProps(store) {
  return {
    heatmapdata: store.heatmapdata,
    boundlocations: store.boundlocations,
    boundusers: store.boundusers,
    checkins: store.checkins,
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
    },
    getLocationDetail(lid, successCb, failCb) {
      dispatch(get_location_detail(lid, successCb, failCb));
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainSection);
