import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get_data } from 'actions';
import path from 'path';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// import Header from 'components/header';
// import Footer from 'components/footer';

import './index.scss';

console.warn(icon)
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

class MainSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  } 

  componentDidMount() {
    this.props.getData();
    var mymap = L.map('map').setView([30.505, -97], 13);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; netVis 2019'
    }).addTo(mymap);

L.marker([30.5, -97]).addTo(mymap)
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
