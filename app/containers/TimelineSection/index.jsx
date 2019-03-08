import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  } from 'actions';
import { margin, ucolor, lcolor, checkincolor } from 'constants/timelineconfig';

import * as d3 from 'd3';

import './index.scss';

var svgwidth = 0;
var svgheight = 0;
var formertime = 0;

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
      // locationscale: d3.scaleLinear().domain(props.lcountrange).range([10, 0.5*svgheight - margin.bottom]),
      locationscale: d3.scaleLinear().domain(props.lcountrange).range([0.5*svgheight, svgheight - margin.bottom]),
      checkinscale: d3.scaleLinear().domain(props.ccountrange).range([0.5*svgheight, margin.top]),
    }
  }

  componentDidMount() {
    svgwidth = +(getComputedStyle(document.querySelector('#timeline-svg')).width.slice(0, -2));
    svgheight = +(getComputedStyle(document.querySelector('#timeline-svg')).height.slice(0, -2));
  }

  showInfo(e) {
    var x = e.clientX - 10;
    if(x < margin.left) {
      return ;
    }
    if((new Date()).getTime() - formertime < 300) {
      formertime = (new Date()).getTime();
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
    .style('transform', `translate3d(${x}px, 0px, 0)`);

    // tooltipg
    // .append('rect')
    // .attr('id', 'tooltip')
    // .attr('x', 0)
    // .attr('y', 0)
    // .attr('rx', 10)
    // .attr('ry', 10)
    // .attr('width', 250)
    // .attr('height', 100)
    // .attr('fill', 'rgba(255, 255, 255, 1)')
    // .attr('stroke', 'rgba(0, 0, 0, 0.8)');
    tooltipg
    .append('line')
    .attr('id', 'tooltip')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', svgheight)
    .attr('stroke', 'rgba(0, 0, 0, 0.5)');
    
    var textsg = tooltipg
    .append('g')
    .style('transform', `translate3d(${(this.state.timescale.range()[1] - (x) < 100) ? '-100' : '10'}px, 30px, 0)`);

    textsg.append('text')
    .attr('y', `${0.5*svgheight-51}`)
    .style('font-size', "12px")
    .text(`time:${timesStr}`);

    textsg.append('text')
    .attr('y', `${0.5*svgheight-37}`)
    .style('font-size', "12px")
    .text(`checkincount: ${timelineitem.ccount}`);

    textsg.append('text')
    .attr('y', `${0.5*svgheight-23}`)
    .style('font-size', "12px")
    .text(`usercount: ${timelineitem.ucount}`);

    textsg.append('text')
    .attr('y', `${0.5*svgheight-7}`)
    .style('font-size', "12px")
    .text(`locationcount: ${timelineitem.lcount}`);


  }

  hideInfo() {
      d3.select('#tooltipg').remove();
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
        <svg className="timeline-svg" id="timeline-svg" onMouseOver={this.showInfo.bind(this)} onMouseOut={this.hideInfo.bind(this)}>
    
            <g className="users">
              
                {/* <path 
                className="userpath"
                d={userPathStr}
                stroke={ucolor}
                fill="none"
                ></path> */}
              {
                timelinedata.map((timelineitem, tindex) => {

                  return <line key={tindex}
                    className="user-item" 
                    x1={timescale(timelineitem.timestamp)} 
                    y1={userscale(timelineitem.ucount)} 
                    x2={timescale(timelineitem.timestamp)}
                    y2={0.5*svgheight}
                    stroke={ucolor}
                    ></line>

                  // return <rect key={tindex}
                  //   className="user-item" 
                  //   x={timescale(timelineitem.timestamp)} 
                  //   y={0.5*svgheight - userscale(timelineitem.ucount)} 
                  //   rx="1"
                  //   ry="1"
                  //   width={2} 
                  //   height={userscale(timelineitem.ucount)} 
                  //   fill={ucolor}
                  //   onMouseOver={this.showTimeInfo.bind(this, timelineitem)}
                  //   onMouseOut={this.hideTimeInfo.bind(this)}
                  //   ></rect>

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
                  return <line key={tindex}
                    className="location-item" 
                    x1={timescale(timelineitem.timestamp)} 
                    y1={0.5 * svgheight} 
                    x2={timescale(timelineitem.timestamp)}
                    y2={locationscale(timelineitem.lcount)}
                    stroke={lcolor}
                    ></line>
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
          
            <g className="annotations">
                {/* <line
                  x1="0"
                  y1="0"
                  x2="15"
                  y2="0"
                  stroke={ucolor}
                  strokeWidth="2"
                ></line> */}
                <text
                    x="15"
                    y={svgheight*0.5-18}
                    dominantBaseline="middle" 
                    alignmentBaseline="middle"
                    fontSize="12"
                    fill={ucolor}
                    style={{
                    }}
                >user</text>
                <text
                    x="15"
                    y={svgheight*0.5}
                    dominantBaseline="middle" 
                    alignmentBaseline="middle"
                    fontSize="12"
                    fill={checkincolor}
                    style={{
                    }}
                >checkin</text>
                <text
                    x="15"
                    y={svgheight*0.5+18}
                    dominantBaseline="middle" 
                    alignmentBaseline="middle"
                    fontSize="12"
                    fill={lcolor}
                    style={{
                    }}
                >location</text>
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
