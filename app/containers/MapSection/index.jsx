import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'debounce';
import { StaticMap } from 'react-map-gl';
import { IconLayer, ArcLayer } from 'libs/glmaps';
import DeckGL from 'deck.gl';

import * as d3 from 'd3';

import { get_heat_in_bound, get_checkin_group_detail } from 'actions';
import { center, defaultzoom, maxZoom, minZoom, MAPBOX_TOKEN, opacityColor } from 'constants/mapconfig';
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
      latmap: [],
      lngmap: [],
      latscale: null,
      lngscale: null
    }
  } 
  
  static getDerivedStateFromProps(props, state) {
    return {
      ...state
    }
  }

  componentDidMount() {
    this.heatMap = debounce(this.heatMap, debouncetime);
    this.setState({
      latsvgsize: [+(getComputedStyle(document.querySelector('#latitude-map-svg')).width.slice(0, -2)), +(getComputedStyle(document.querySelector('#latitude-map-svg')).height.slice(0, -2))],
      lngsvgsize: [+(getComputedStyle(document.querySelector('#longitude-map-svg')).width.slice(0, -2)), +(getComputedStyle(document.querySelector('#longitude-map-svg')).height.slice(0, -2))]
    })
  }

  mapLoaded() {
    const { latsvgsize, lngsvgsize } = this.state;
    const mapGL = this.map.getMap();

    const bounds = mapGL.getBounds();
    var latscale = d3.scaleLinear().domain([bounds.getSouth(), bounds.getNorth()]).range([latsvgsize[1], 0]),
        lngscale = d3.scaleLinear().domain([bounds.getWest(), bounds.getEast()]).range([0, lngsvgsize[0]]);
    this.setState({
      bounds: {
        latrange: [bounds.getSouth(), bounds.getNorth()],
        lngrange: [bounds.getWest(), bounds.getEast()]
      },
      latscale,
      lngscale
    })
    this.heatMap();
  }

  handleViewStateChange({ viewState }) {
    const { latscale, lngscale } = this.state;
    const mapGL = this.map.getMap();
    const bounds = mapGL.getBounds();
    latscale.domain([bounds.getSouth(), bounds.getNorth()]);
    lngscale.domain([bounds.getWest(), bounds.getEast()]);
    this.setState({
      viewState: viewState,
      bounds: {
        latrange: [bounds.getSouth(), bounds.getNorth()],
        lngrange: [bounds.getWest(), bounds.getEast()]
      },
    })
    this.heatMap();
  }

  heatMap() {
    const { bounds, latsvgsize, lngsvgsize } = this.state;
    this.props.getHeatByBound(bounds, () => {
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

  bindMap(map) {
    this.map = map;
  }
  
  render() {
    const { latsvgmapdata, latmaxcount, lngsvgmapdata, lngmaxcount } = this.props;
    const { latmap, lngmap, latscale, lngscale } = this.state;
    var latopacityscale = d3.scaleLinear().domain([0, latmaxcount]).range([0.1, 1]),
        lngopacityscale = d3.scaleLinear().domain([0, lngmaxcount]).range([0.1, 1]);

    return <div className="map-section-wrapper">
        <div className="longitude-map">
          <svg className="longitude-map-svg" id="longitude-map-svg">
            <g className="longitude-map-group">
            {
              lngsvgmapdata.map(hitem => {
                return <line  key={hitem.lng}
                  x1={lngscale(hitem.lng)}
                  y1="5"
                  x2={lngscale(hitem.lng)}
                  y2="35"
                  stroke={opacityColor}
                  opacity={lngopacityscale(hitem.count)}
                ></line>
              })
            }
            </g>
          </svg>
        </div>
        <div className="latitude-map">
          <svg className="latitude-map-svg" id="latitude-map-svg">
          {
              latsvgmapdata.map(hitem => {
                return <line  key={hitem.lat}
                  x1="5"
                  y1={latscale(hitem.lat)}
                  x2="35"
                  y2={latscale(hitem.lat)}
                  stroke={opacityColor}
                  opacity={latopacityscale(hitem.count)}
                ></line>
              })
            }
          </svg>
        </div>
        <div className="map" id="map" >
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
                  mapStyle="mapbox://styles/mapbox/basic-v9"
                  preventStyleDiffing
                  mapboxApiAccessToken={MAPBOX_TOKEN}
              />
            </DeckGL>
        </div>
      </div>
  }
}

function mapStateToProps(store) {
  var heatmapdata = store.heatmapdata;
  var latmap = {},
      lngmap = {},
      latmaxcount = 0,
      lngmaxcount = 0;

  heatmapdata.forEach(checkinitem => {
    if(!latmap[checkinitem.lat]) {
      latmap[checkinitem.lat] = {
        count: 0,
        lat: checkinitem.lat
      }
    }
    if(!lngmap[checkinitem.lng]) {
      lngmap[checkinitem.lng] = {
        count: 0,
        lng: checkinitem.lng
      }
    }
    latmap[checkinitem.lat].count ++;
    lngmap[checkinitem.lng].count ++;
    latmaxcount = Math.max(latmaxcount, latmap[checkinitem.lat].count);
    lngmaxcount = Math.max(lngmaxcount, lngmap[checkinitem.lng].count);
  })
  var latsvgmapdata = Object.keys(latmap).map(item => {
    return {
      lat: latmap[item].lat,
      count: latmap[item].count
    }
  })
  var lngsvgmapdata = Object.keys(lngmap).map(item => {
    return {
      lng: lngmap[item].lng,
      count: lngmap[item].count
    }
  })
  return {
    heatmapdata: store.heatmapdata,
    edges: store.edges,
    latsvgmapdata: latsvgmapdata,
    lngsvgmapdata: lngsvgmapdata,
    latmaxcount: latmaxcount,
    lngmaxcount: lngmaxcount
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getHeatByBound(bounds, successCb, failCb) {
      dispatch(get_heat_in_bound(bounds, successCb, failCb))
    },
    getCheckinGroupDetail(checkins, successCb, failCb) {
      dispatch(get_checkin_group_detail(checkins, successCb, failCb))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainSection);
