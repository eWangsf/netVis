import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  } from 'actions';
import { width as svgwidth, height as svgheight, margin, ucolor, lcolor, checkincolor } from 'constants/timelineconfig';

import * as d3 from 'd3';

import './index.scss';

class TimelineSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timerange: [],
      timescale: null,
      userscale: null,
      locationscale: null,
      checkinscale: null,
      infoVisible: false
    }
  } 

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      timescale: d3.scaleLinear().domain(props.timerange).range([margin.left, svgwidth - margin.right]),
     
      // userscale: d3.scaleLinear().domain(props.ucountrange).range([svgheight - margin.bottom, margin.top]),
      // locationscale: d3.scaleLinear().domain(props.lcountrange).range([svgheight - margin.bottom, margin.top]),
      // checkinscale: d3.scaleLinear().domain(props.ccountrange).range([svgheight - margin.bottom, margin.top]),
       userscale: d3.scaleLinear().domain(props.ucountrange).range([0.5*svgheight, margin.top]),
      locationscale: d3.scaleLinear().domain(props.lcountrange).range([10, 0.5*svgheight - margin.bottom]),
      checkinscale: d3.scaleLinear().domain(props.ccountrange).range([0.5*svgheight, margin.top]),
    }
  }

  componentDidMount() {
  }


  showTimeInfo(timelineitem) {
    console.warn('show: ', timelineitem);
    // this.setState({
    //   infoVisible: true
    // })
  }
  hodeTimeInfo() {
    console.warn('hide')
    // this.setState({
    //   infoVisible: false
    // })
  }
  showInfo(e) {
    
    var x = e.clientX - 10;
    if(x < margin.left) {
      return ;
    }
    
    var timestamp = this.state.timescale.invert(x);
    timestamp = Math.floor((timestamp - this.state.timescale.domain()[0]) / 86400000) * 86400000 + this.state.timescale.domain()[0];
    var timelineitem = this.props.timelinedata.find(item => +item.timestamp === +timestamp);

    if(!timelineitem) {
      return ;
    }
    var _time = new Date(timestamp);
    var timesStr = `${_time.getFullYear()}-${_time.getMonth()+1}-${_time.getDate()}`;
    d3.select('#tooltipg').remove();
    var tooltipg = d3.select('#timeline-svg')
    .append("g")
    .attr('id', 'tooltipg')
    .style('transform', `translate3d(${e.clientX-margin.left}px, ${e.clientY - 506}px, 0)`);

    tooltipg
    .append('rect')
    .attr('id', 'tooltip')
    .attr('x', 0)
    .attr('y', 0)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('width', 250)
    .attr('height', 100)
    .attr('fill', 'rgba(255, 255, 255, 1)')
    .attr('stroke', 'rgba(0, 0, 0, 0.8)');
    
    tooltipg
    .append('text')
    .attr('x', 10)
    .attr('y', 30)
    .text(`${timesStr}: checkincount: ${timelineitem.ccount}`)


  }

  render() {

    const { timelinedata } = this.props;
    const { timescale, userscale, locationscale, checkinscale } = this.state;
    var userPathStr = '',
        locationPathStr = '',
        checkinPathStr = '';
    timelinedata.forEach((timelineitem, tindex) => {

      if(tindex === 0) {
        userPathStr += `M${timescale(timelineitem.timestamp)} ${userscale(timelineitem.ucount)} `;
        locationPathStr += `M${timescale(timelineitem.timestamp)} ${locationscale(timelineitem.lcount)} `;
        checkinPathStr += `M${timescale(timelineitem.timestamp)} ${checkinscale(timelineitem.ccount)} `;
        return  ;
      }
      userPathStr += `L${timescale(timelineitem.timestamp)} ${userscale(timelineitem.ucount)} `;
      locationPathStr += `L${timescale(timelineitem.timestamp)} ${locationscale(timelineitem.lcount)} `;
      checkinPathStr += `L${timescale(timelineitem.timestamp)} ${checkinscale(timelineitem.ccount)} `;
    })

    return <div className="timeline-section-wrapper">
        <svg className="timeline-svg" id="timeline-svg" onMouseMove={this.showInfo.bind(this)}>

            <g className="users">
              
                {/* <path 
                className="userpath"
                d={userPathStr}
                stroke={ucolor}
                fill="none"
                ></path> */}
              {
                timelinedata.map((timelineitem, tindex) => {
                  return <rect key={tindex}
                    className="user-item" 
                    x={timescale(timelineitem.timestamp)} 
                    y={0.5*svgheight - userscale(timelineitem.ucount)} 
                    rx="1"
                    ry="1"
                    width={2} 
                    height={userscale(timelineitem.ucount)} 
                    fill={ucolor}
                    onMouseOver={this.showTimeInfo.bind(this, timelineitem)}
                    onMouseOut={this.hodeTimeInfo.bind(this)}
                    ></rect>
                })
              }
            </g>
            <g className="locations">
              {/* <path 
                className="locationpath"
                d={locationPathStr}
                stroke={lcolor}
                fill="none"
                ></path> */}
              {
                timelinedata.map((timelineitem, tindex) => {
                  return <rect key={tindex}
                    className="location-item" 
                    x={timescale(timelineitem.timestamp)} 
                    y={0.5 * svgheight} 
                    rx="1"
                    ry="1"
                    width={2} 
                    height={locationscale(timelineitem.lcount)} 
                    fill={lcolor}
                    onMouseOver={this.showTimeInfo.bind(this, timelineitem)}
                    onMouseOut={this.hodeTimeInfo.bind(this)}
                    ></rect>
                })
              }
            </g>
            <g className="checkins">
                  <path 
                    className="checkinpath"
                    d={checkinPathStr}
                    stroke={checkincolor}
                    fill="none"
                    ></path>
            </g>
          
  
        </svg>
      </div>
  }
}

function mapStateToProps(store) {
  var heatmapdata = store.heatmapdata,
      times = heatmapdata.map(item => item.time),
      timerange = [Math.min(...times), Math.max(...times)];
    
  var checkinmap = {}
  
  heatmapdata.forEach(checkin => {
    var key = Math.floor((checkin.time - timerange[0]) / 86400000) * 86400000 + timerange[0];
    if(!checkinmap[key]) {
      checkinmap[key] = {
        locations: [],
        users: [],
        ccheckin: 0
      }
    }
    if(!checkinmap[key].locations.includes(checkin.lid)) {
      checkinmap[key].locations.push(checkin.lid)
    }
    if(!checkinmap[key].users.includes(checkin.uid)) {
      checkinmap[key].users.push(checkin.uid)
    }
    checkinmap[key].ccheckin ++;
  })


  var maxucount = 0,
      maxlcount = 0,
      maxccount = 0;
  var timelinedata = Object.keys(checkinmap).map(item => {
    maxucount = Math.max(maxucount, checkinmap[item].users.length);
    maxlcount = Math.max(maxlcount, checkinmap[item].locations.length);
    maxccount = Math.max(maxccount, checkinmap[item].ccheckin);
    return {
      timestamp: item,
      ucount: checkinmap[item].users.length,
      lcount: checkinmap[item].locations.length,
      ccount: checkinmap[item].ccheckin
    }
  });

  return {
    timerange: timerange,
    ucountrange: [0, maxucount],
    lcountrange: [0, maxlcount],
    ccountrange: [0, maxccount],
    timelinedata: timelinedata.sort((x, y) => {
      return +x.timestamp < +y.timestamp ? -1 : 1;
    }),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // getHotSpots(successCb, failCb) {
    //   dispatch(get_hotspots(successCb, failCb));
    // },
    

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelineSection);
