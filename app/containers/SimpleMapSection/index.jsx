import React, { Component } from 'react';
import { connect } from 'react-redux';
import G2 from '@antv/g2';
import * as d3 from 'd3';
import { worldgeo } from 'constants/world.geo.js';
import { center, defaultzoom, maxZoom, minZoom, MAPBOX_TOKEN, opacityColor } from 'constants/mapconfig';
import { IconLayer, ArcLayer } from 'libs/glmaps';
import DeckGL from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import { get_candidates_detail } from 'actions';

import './index.scss';

const bubblemargin = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
}

class SimpleMapSection extends Component {

  constructor(props) {
    super(props);

    this.state = {
      bubblesvgsize: {
        width: 20,
        height: 20,
      },
      mapVisible: true,
      location: undefined,
      viewState: {
        width: 400,
        height: 400,
        latitude: 40.75,
        longitude: -73.96,
        zoom: 11,
        pitch: 1
      },
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,

    }
  }

  componentDidMount() {
    // var bubblesvgsize = {
    //   width: +(getComputedStyle(document.querySelector('#bubblesvg')).width.slice(0, -2)), 
    //   height: +(getComputedStyle(document.querySelector('#bubblesvg')).height.slice(0, -2))
    // };
    // this.props.getUserCheckins(() => {
    //     var latrange = [90, -90],
    //         lngrange = [1000, -1000];

    //     var allLocations =  this.props.usercheckinlist.concat(this.props.candidates)

    //     allLocations.forEach(citem => {
    //       latrange[0] = Math.min(latrange[0], +citem.lat);
    //       latrange[1] = Math.max(latrange[1], +citem.lat);
    //       lngrange[0] = Math.min(lngrange[0], +citem.lng);
    //       lngrange[1] = Math.max(lngrange[1], +citem.lng);
    //     })
    //     this.setState({
    //       bubblesvgsize,
    //       latscale: d3.scaleLinear().domain(latrange).range([bubblesvgsize.height-bubblemargin.bottom, bubblemargin.top]),
    //       lngscale: d3.scaleLinear().domain(lngrange).range([bubblemargin.left, bubblesvgsize.width-bubblemargin.right]),
    //     })
    // });
    // ------------------------
    // this.initMap();
    // var location = {
    //   lid: 233,
    //   lat: 40.7,
    //   lng: -74,
    // }
    // this.setState({
    //   location: location,
    //   mapVisible: true,
    //   viewState: {
    //     ...this.state.viewState,
    //     latitude: location.lat,
    //     longitude: location.lng
    //   }
    // })
  }

  handleViewStateChange({ viewState }) {
    this.setState({
      viewState: viewState
    })
  }
  bindMap(map) {
    this.map = map;
  }
  mapLoaded() {
    const mapGL = this.map.getMap();
  }

  initMap() {
    const { bubbleData } = this.props;
    
    var containerStyle = getComputedStyle(document.querySelector('#simplemap'));

    var chart = new G2.Chart({
      container: 'simplemap',
      forceFit: true,
      width: +(containerStyle.width.slice(0, -2)),
      height: +(containerStyle.height.slice(0, -2)),
      padding: [0, 0, 0, 0]
    });
    chart.scale({
      x: {
        sync: true,
        nice: false
      },
      y: {
        sync: true,
        nice: false
      }
    });
    chart.coord().reflect();

    chart.legend(false);
    chart.axis(false);
    chart.tooltip({
      enterable: true
    });
    chart.on('tooltip:change', function(ev) {
      const items = ev.items; // tooltip显示的项
      const origin = items[0];
    });

    var ds = new DataSet();
    var dv = ds.createView('back').source(worldgeo, {
      type: 'GeoJSON'
    }).transform({
      type: 'geo.projection',
      projection: 'geoMercator',
      as: ['x', 'y', 'centroidX', 'centroidY']
    });
    var bgView = chart.view();
    bgView.source(dv);
    bgView.tooltip(false);
    bgView.polygon().position('x*y').style({
      fill: '#DDDDDD',
      stroke: '#b1b1b1',
      lineWidth: 0.5,
      fillOpacity: 0.85
    });

    var userData = ds.createView().source(bubbleData);
    userData.transform({
      type: 'map',
      callback: function callback(obj) {
        var projectedCoord = dv.geoProjectPosition([obj.lng * 1, obj.lat * 1], 'geoMercator');
        obj.x = projectedCoord[0];
        obj.y = projectedCoord[1];
        obj.checkins = obj.checkins * 1;
        obj.magnitude = obj.magnitude * 1;
        return obj;
      }
    });
    var pointView = chart.view();
    pointView.source(userData);
    pointView.point().position('x*y').size('checkins', [10, 25]).shape('circle').opacity(0.45).color(`#1890ff`).tooltip('locationid*date*lat*lng*checkins')
    chart.render();
  }
  
  selectCandidate(e) {
    var locationitem = e.object;
    this.props.getLocationDe
  }

  render() {

    const { candidates } = this.props;
    const { location } = this.state;
    
    return <div className="simplemap-wrapper">
      <div className="simplemap" id="simplemap">
        {/* <svg className="bubble-svg" id="bubblesvg">
        
        </svg> */}

          
          
          {
            this.state.mapVisible ? <DeckGL
                viewState={this.state.viewState}
                onViewStateChange={this.handleViewStateChange.bind(this)}
                controller={true}
                layers={[
                  new IconLayer({
                    data: candidates.map(item => {
                      return {
                        lid: item.lid,
                        name: `candidate-${item.lid}`,
                        coordinates: [item.lng, item.lat]
                      }
                    }),
                    viewState: {
                      bearing: 0,
                      latitude: this.state.viewState.latitude,
                      longitude: this.state.viewState.longitude,
                      maxZoom: 30,
                      minZoom: 1,
                      pitch: 0,
                      zoom: this.state.viewState.zoom
                    },
                    id: 'icon-layer',
                    showCluster: false,
                    onClick: this.selectCandidate.bind(this),
                  })
                ]}
            >
              <StaticMap
                  bearing={1}
                  pitch={1}
                  ref={this.bindMap.bind(this)}
                  onLoad={this.mapLoaded.bind(this)}
                  mapStyle="mapbox://styles/mapbox/light-v9"
                  preventStyleDiffing
                  mapboxApiAccessToken={MAPBOX_TOKEN}
              />
            </DeckGL> : null 
          }
         
        </div>
      
    </div>
  }

}

function mapStateToProps(store) {
  return {}
  // var locationtree = store.locationtree.sort((x, y) => {
  //   return x.count < y.count ? 1 : -1;
  // })
  
  // return {
  //   candidates: store.candidates,
  //   usercheckinlist: store.usercheckinlist,
  //   bubbleData: [{
  //     locationid: 1,
  //     date: "1902/04/19",
  //     lat: "14",
  //     lng: "-91",
  //     checkins: "2000",
  //     magnitude: "7.5",
  //   }, {
  //     locationid: 2,
  //     date: "1902/12/16",
  //     lat: "40.8",
  //     lng: "72.3",
  //     checkins: "4700",
  //     magnitude: "6.4",
  //   }, {
  //     locationid: 3,
  //     date: "1903/04/28",
  //     location: "Malazgirt, Turkey (Ottoman Empire)",
  //     lat: "39.1",
  //     lng: "42.6",
  //     checkins: "3500",
  //     magnitude: "7.0",
  //   }, {
  //     locationid: 4,
  //     date: "1903/05/28",
  //     location: "Gole, Turkey (Ottoman Empire)",
  //     lat: "40.9",
  //     lng: "42.7",
  //     checkins: "1000",
  //     magnitude: "5.8",
  //   }, {
  //     locationid: 5,
  //     date: "1905/04/04",
  //     location: "Kangra, India",
  //     lat: "33.0",
  //     lng: "76.0",
  //     checkins: "1900",
  //     magnitude: "7.5",
  //   }, {
  //     locationid: 6,
  //     date: "1906/01/31",
  //     location: "Off coast of Esmeraldas, Ecuador",
  //     lat: "1",
  //     lng: "-81.5",
  //     checkins: "1000",
  //     magnitude: "8.8",
  //   }, {
  //     locationid: 7,
  //     date: "1906/03/16",
  //     location: "Chia-i, Taiwan",
  //     lat: "23.6",
  //     lng: "120.5",
  //     checkins: "1250",
  //     magnitude: "6.8",
  //   }]
  // }

}

function mapDispatchToProps(dispatch) {
  return {
    // getCandidatesDetail(successCb, failCb) {
    //   dispatch(get_candidates_detail(successCb, failCb));
    // },
    // getUserCheckins(successCb, failCb) {
    //   dispatch(get_user_checkins(successCb, failCb));
    // },

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SimpleMapSection);
