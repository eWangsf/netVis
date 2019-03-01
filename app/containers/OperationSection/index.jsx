import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get_hotspots, get_checkins_by_lid } from 'actions';

import * as d3 from 'd3';
// import timeseries from 'libs/timeseries/timeseries';

import './index.scss';
import 'libs/timeseries/style.css';


class OperationSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unsualshow: true,
      hotscale: null
    }
  } 

  componentDidMount() {
    this.props.getHotSpots((hotspots) => {
      var weights = hotspots.map(item => +item.weight);
      this.setState({
        hotscale: d3.scaleLinear().domain([Math.min(...weights), Math.max(...weights)]).range([0.3, 1])
      })
    })
  }

  toggleUnsualSection() {
    this.setState({
      unsualshow: !this.state.unsualshow
    })
  }

  selectSpotHandler(spot) {
    this.setState({
      unsualshow: false
    })


    this.props.getCheckinByLocation(spot.id, (timerange) => {
      var usermap = {
      };
      this.props.checkins.forEach((item) => {
        var uid = +item.uid;
        if(!usermap[uid]) {
          usermap[uid] = 0;
        }
        usermap[uid] ++;
      })

      var userids = Object.keys(usermap);

      var entries = userids.map((uid, index) => {
        return {
          uid: +uid,
          count: usermap[uid]
        }
      })

      var svg = d3.select('.checkin-svg')

      var rectsgroup = svg.append('g')
            .attr("class", "rectsgroup");

      rectsgroup.selectAll('.userall')
        .data(entries)
        .enter()
        .append('rect')
        .attr('class', `checkinitem checkin-in-${spot.id}`)
        .attr('x', function(d) {
          return 0;
        })
        .attr('y', function(d, i) {
          return i * 20;
        })
        .attr('width', function(d) {
          return d.count * 2;
        })


      // var domEl = 'hotspots-content';
      // var data = [{'value': 1380854103662},{'value': 1363641921283}];
      // var brushEnabled = true;
      // timeseries(domEl, data, brushEnabled);
    })
  }


  render() {

    return <div className="operation-section-wrapper">

            <div className={`section unusualspots-section ${this.state.unsualshow ? '' : 'hidden'}`}>
                <div className="spot-list">

                  {
                    this.props.hotspots && this.props.hotspots.length > 0 && this.state.hotscale ? this.props.hotspots.map(item => {
                      return <div className="spot-item hot-spot" key={`location-${item.id}`} onClick={this.selectSpotHandler.bind(this, item)} style={{
                        background: `rgba(253, 120, 8, ${this.state.hotscale(+item.weight)})`
                      }}>
                        <div className="lat">latitude:{item.lat}</div>
                        <div className="lng">longtitude: {item.lng}</div>
                        <div className="weight">weight: {item.weight}</div>
                      </div>
                    }) : <div>暂无热点数据</div>
                  }

                </div>
                <div className="section-icon" onClick={this.toggleUnsualSection.bind(this)}></div>
            </div>
    
            <div className="section clusters-section">
              <div className="section-title">clusters</div>
              <div className="section-content">
                <p>hotspots: {this.props.hotspots.length}</p>
                <p>checkingroups: {this.props.checkingroups.length}</p>
                <p>uids: {this.props.uids.length}</p>
                <p>lids: {this.props.lids.length}</p>
                <p>edges: {this.props.edges.length}</p>
                <p>checkins: {this.props.checkins.length}</p>
              </div>

            </div>

            <div className="section hotspots-section">
              <div className="section-title">hotspots</div>
              <div className="hotspots-content">
                <svg id="checkin-svg" className="checkin-svg"></svg>
              </div>
            </div>

            <div className="section record-section">
              <div className="section-title">record</div>

            </div>

      </div>
  }
}

function mapStateToProps(store) {
  return {
    lids: store.lids,
    uids: store.uids,
    checkingroups: store.checkingroups,
    edges: store.edges,

    hotspots: store.hotspots,
    checkins: store.checkins
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getHotSpots(successCb, failCb) {
      dispatch(get_hotspots(successCb, failCb));
    },
    getCheckinByLocation(lid, successCb, failCb) {
      dispatch(get_checkins_by_lid(lid, successCb, failCb))
    }
    

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OperationSection);
