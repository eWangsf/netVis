import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'debounce';
import { StaticMap } from 'react-map-gl';
import { IconLayer, ArcLayer } from 'libs/glmaps';
import DeckGL from 'deck.gl';

import { get_heat_in_bound, get_checkin_group_detail } from 'actions';
import { center, defaultzoom, maxZoom, minZoom, MAPBOX_TOKEN } from 'constants/mapconfig';
import './index.scss';

var debouncetime = 400;

var warn = (msg) => {
  console.warn(msg);
}

var bearing = 0;
var pitch = 20;
var altitude = 0;

class MainSection extends Component {
  constructor(props) {
    super(props);

    this.heatMap = this.heatMap.bind(this);

    this.state = {
      viewState: {
        width: 400,
        height: 400,
        latitude: center.lat,
        longitude: center.lng,
        zoom: defaultzoom,
        pitch: pitch
      },
      locationcount: 0,
      bounds: {
        latrange: [0, 0],
        lngrange: [0, 0]
      },
    }
  } 

  componentDidMount() {
    this.heatMap = debounce(this.heatMap, debouncetime)
  }

  mapLoaded() {
    const mapGL = this.map.getMap();
    const bounds = mapGL.getBounds();
    this.setState({
      bounds: {
        latrange: [bounds.getSouth(), bounds.getNorth()],
        lngrange: [bounds.getWest(), bounds.getEast()]
      }
    })
    this.heatMap();
  }

  handleViewStateChange({ viewState }) {
    const mapGL = this.map.getMap();
    const bounds = mapGL.getBounds();
    // console.warn(viewState)
    this.setState({
      viewState: viewState,
      bounds: {
        latrange: [bounds.getSouth(), bounds.getNorth()],
        lngrange: [bounds.getWest(), bounds.getEast()]
      }
    })
    this.heatMap();
  }

  heatMap() {
    const { bounds } = this.state;
    this.props.getHeatByBound(bounds, () => {
      warn('get_bound_checkin done')
    })
  }

  iconClickHandler(icon) {
    var zoomLevels = icon && icon.object ? icon.object.zoomLevels : [];
    var zoom = Math.floor(this.state.viewState.zoom);

    if(!zoomLevels[zoom]) {
      return ;
    }
    var checkingroups = zoomLevels[zoom].points;
    console.log(checkingroups);

    this.props.getCheckinGroupDetail(checkingroups);

  }

  locationUsersRender() {
  }
  bindMap(map) {
    this.map = map;

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
              onClick: this.iconClickHandler.bind(this),
            }),
            new ArcLayer({
              data: this.props.edges,
              showBrushAnimation: true,
              viewState: {
                latitude: this.state.viewState.latitude,
                longitude: this.state.viewState.longitude,
                maxZoom: maxZoom,
                minZoom: minZoom,
                pitch: pitch,
                zoom: this.state.viewState.zoom
              },
              id: 'arc-layer',
              showCluster: true
            })
          ]}
        >
          <StaticMap
                bearing={bearing}
                pitch={pitch}
              ref={this.bindMap.bind(this)}
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
    edges: store.edges,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // getHeat(loctioncount, successCb, failCb) {
    //   dispatch(get_location_heat(loctioncount, successCb, failCb));
    // },
    getHeatByBound(bounds, successCb, failCb) {
      dispatch(get_heat_in_bound(bounds, successCb, failCb))
    },
    getCheckinGroupDetail(checkins, successCb, failCb) {
      dispatch(get_checkin_group_detail(checkins, successCb, failCb))
    }
    // getLocationsByBound(latrange, lngrange, successCb, failCb) {
    //   dispatch(get_locations_in_bound(latrange, lngrange, successCb, failCb))
    // },
    // getLocationUser(latrange, lngrange, successCb, failCb) {
    //   dispatch(get_location_checkins_in_bound(latrange, lngrange, successCb, failCb));
    // },
    // getLocationDetail(lid, successCb, failCb) {
    //   dispatch(get_location_detail(lid, successCb, failCb));
    // }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainSection);
