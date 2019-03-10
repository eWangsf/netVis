import React, { Component } from 'react';
import { connect } from 'react-redux';
import G2 from '@antv/g2';
import { worldgeo } from 'constants/world.geo.js';

import './index.scss';

class SimpleMapSection extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initMap();
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
  

  render() {
    return <div className="simplemap-wrapper">
      <div className="simplemap" id="simplemap"></div>
      
    </div>
  }

}

function mapStateToProps(store) {
  return {
    bubbleData: [{
      locationid: 1,
      date: "1902/04/19",
      lat: "14",
      lng: "-91",
      checkins: "2000",
      magnitude: "7.5",
    }, {
      locationid: 2,
      date: "1902/12/16",
      lat: "40.8",
      lng: "72.3",
      checkins: "4700",
      magnitude: "6.4",
    }, {
      locationid: 3,
      date: "1903/04/28",
      location: "Malazgirt, Turkey (Ottoman Empire)",
      lat: "39.1",
      lng: "42.6",
      checkins: "3500",
      magnitude: "7.0",
    }, {
      locationid: 4,
      date: "1903/05/28",
      location: "Gole, Turkey (Ottoman Empire)",
      lat: "40.9",
      lng: "42.7",
      checkins: "1000",
      magnitude: "5.8",
    }, {
      locationid: 5,
      date: "1905/04/04",
      location: "Kangra, India",
      lat: "33.0",
      lng: "76.0",
      checkins: "1900",
      magnitude: "7.5",
    }, {
      locationid: 6,
      date: "1906/01/31",
      location: "Off coast of Esmeraldas, Ecuador",
      lat: "1",
      lng: "-81.5",
      checkins: "1000",
      magnitude: "8.8",
    }, {
      locationid: 7,
      date: "1906/03/16",
      location: "Chia-i, Taiwan",
      lat: "23.6",
      lng: "120.5",
      checkins: "1250",
      magnitude: "6.8",
    }]
  }

}

function mapDispatchToProps(dispatch) {
  return {
    // initGeoMaps(successCb, failCb) {
    //   dispatch(init_geo_map(successCb, failCb));
    // },

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SimpleMapSection);
