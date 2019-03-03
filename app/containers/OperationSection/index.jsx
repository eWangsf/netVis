import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get_hotspots, get_checkins_by_lid } from 'actions';

import * as d3 from 'd3';

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

    })
  }


  render() {

    var width = 470,
        height = 220,
        nTop = this.props.locationtree.length;
    var margin = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    }
    
    var oR = Math.min((height-margin.top-margin.bottom) / 2, (width - margin.left - margin.right)/(2*nTop));

    var xscale = d3.scaleLinear().domain([0, nTop-1]).range([margin.left + oR, width - margin.right - oR]);

    var colors = [];

    for(var i = 0; i < Math.ceil(nTop/10); i++) {
      colors = colors.concat(d3.schemeCategory10);
    }

    var secondbubbles = [];


    
    return <div className="operation-section-wrapper">

            {/* <div className={`section unusualspots-section ${this.state.unsualshow ? '' : 'hidden'}`}>
                <div className="section-content spot-list">

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
            </div> */}
    
            <div className="section clusters-section">
              <div className="section-title">clusters</div>
              <div className="section-content">
                  <svg id="bubblesvg" className="bubblesvg">
                      {
                        this.props.locationtree && this.props.locationtree.length > 0 ? this.props.locationtree.map((locationitem, lindex) => {
                          var dscale = d3.scaleLinear().domain([0, locationitem.users.length -1]).range([-0.25*Math.PI, 0.25*Math.PI]);
                          var _sarr = locationitem.users.map((userid, uindex) => {
                            return {
                              lid: locationitem.lid,
                              uid: +userid,
                              r: 10,
                              x: xscale(lindex) + (oR) * Math.cos(dscale(uindex)),
                              y: height * 0.5 - (oR) * Math.sin(dscale(uindex))
                            }
                          })
                          secondbubbles = secondbubbles.concat(_sarr);
                          return <g className={`topBubbleAndText_${locationitem.lid}`} key={locationitem.lid || lindex}>
                              <circle className="topBubble" id={`topBubble${locationitem.lid}`} 
                                r={oR - 20} 
                                cx={xscale(lindex)} 
                                cy={0.5 * height} 
                                style={{
                                'fill': colors[lindex],
                                'opacity': 0.3
                              }}></circle>
                              <text className="topBubbleText" 
                                x={xscale(lindex)}
                                y={0.5 * height} 
                                textAnchor="middle"
                                fontSize="16"
                                dominantBaseline="middle" 
                                alignmentBaseline="middle"
                                style={{
                                'fill': 'rgb(31, 119, 180)'
                              }}>{locationitem.lid}</text>
                          </g>
                        }) : <div className="empty">empty</div>
                      }

                      {
                        secondbubbles.map((uitem, index) => {
                          return <g key={index}>
                            {/* <circle 
                              className={`childBubble${uitem.uid}`} 
                              id={`childBubble_${uitem.lid}sub_${uitem.uid}`} 
                              r={10} 
                              cx={uitem.x} 
                              cy={uitem.y} 
                              cursor="pointer" 
                              style={{
                                'opacity': 0.5,
                                'fill': `${d3.schemeCategory10[index]}`
                              }}></circle> */}

<g transform={`translate(${uitem.x - 15},${uitem.y - 15}) scale(0.12, 0.12)`}>
        <path d="M0,125A125,125 0 1,1 0,-125A125,125 0 1,1 0,125M0,118.75A118.75,118.75 0 1,0 0,-118.75A118.75,118.75 0 1,0 0,118.75Z" 
          transform="translate(125,125)" 
          style={{
            'fill': 'rgb(23, 139, 202)'
          }}>
        </path>
        <text className="liquidFillGaugeText" 
          textAnchor="middle" 
          fontSize="6" 
          transform="translate(125,146.875)" 
          style={{
            'fill': 'rgb(4, 86, 129)'
          }}>
          54%
        </text>
        <defs>
          <clipPath id="clipWavefillgauge1" 
            transform="translate(-212.5,115.58599853515625)">
              <path d="M0,229.8416687884447L5.625,229.8416687884447L11.25,229.8416687884447L16.875,229.8416687884447L22.5,229.8416687884447L28.125,229.8416687884447L33.75,229.8416687884447L39.375,229.8416687884447L45,229.8416687884447L50.625,229.8416687884447L56.25,229.8416687884447L61.87500000000001,229.8416687884447L67.5,229.8416687884447L73.125,229.8416687884447L78.75,229.8416687884447L84.375,229.8416687884447L90,229.8416687884447L95.625,229.8416687884447L101.25,229.8416687884447L106.875,229.8416687884447L112.5,229.8416687884447L118.125,229.8416687884447L123.75000000000001,229.8416687884447L129.375,229.8416687884447L135,229.8416687884447L140.625,229.8416687884447L146.25,229.8416687884447L151.875,229.8416687884447L157.5,229.8416687884447L163.125,229.8416687884447L168.75,229.8416687884447L174.375,229.8416687884447L180,229.8416687884447L185.625,229.8416687884447L191.25,229.8416687884447L196.875,229.8416687884447L202.5,229.8416687884447L208.125,229.8416687884447L213.75,229.8416687884447L219.375,229.8416687884447L225,229.8416687884447L230.62499999999997,229.8416687884447L236.25,229.8416687884447L241.875,229.8416687884447L247.50000000000003,229.8416687884447L253.125,229.8416687884447L258.75,229.8416687884447L264.375,229.8416687884447L270,229.8416687884447L275.625,229.8416687884447L281.25,229.8416687884447L286.875,229.8416687884447L292.5,229.8416687884447L298.125,229.8416687884447L303.75,229.8416687884447L309.375,229.8416687884447L315,229.8416687884447L320.625,229.8416687884447L326.25,229.8416687884447L331.875,229.8416687884447L337.5,229.8416687884447L343.125,229.8416687884447L348.75,229.8416687884447L354.375,229.8416687884447L360,229.8416687884447L365.625,229.8416687884447L371.25,229.8416687884447L376.875,229.8416687884447L382.5,229.8416687884447L388.125,229.8416687884447L393.75,229.8416687884447L399.375,229.8416687884447L405,229.8416687884447L410.625,229.8416687884447L416.25,229.8416687884447L421.875,229.8416687884447L427.5,229.8416687884447L433.125,229.8416687884447L438.75,229.8416687884447L444.375,229.8416687884447L450,229.8416687884447L450,-2.3717336737201818e-15L444.375,-0.7574038668223285L438.75,-1.4961579367641789L433.125,-2.198071632839377L427.5,-2.8458615103325666L421.875,-3.423576832568512L416.25,-3.916992330986531L410.625,-4.3139584784634275L405,-4.604700650993201L399.375,-4.782059811370225L393.75,-4.841668788444707L388.125,-4.782059811370223L382.5,-4.604700650993199L376.875,-4.313958478463426L371.25,-3.9169923309865293L365.625,-3.42357683256851L360,-2.8458615103325635L354.375,-2.198071632839373L348.75,-1.4961579367641749L343.125,-0.7574038668223244L337.5,1.7788002552901363e-15L331.875,0.757403866822328L326.25,1.4961579367641782L320.625,2.198071632839376L315,2.8458615103325657L309.375,3.423576832568512L303.75,3.916992330986531L298.125,4.3139584784634275L292.5,4.6047006509932L286.875,4.782059811370225L281.25,4.841668788444707L275.625,4.782059811370223L270,4.604700650993199L264.375,4.313958478463425L258.75,3.916992330986527L253.125,3.423576832568507L247.50000000000003,2.845861510332567L241.875,2.1980716328393775L236.25,1.4961579367641753L230.62499999999997,0.757403866822325L225,-1.1858668368600909e-15L219.375,-0.7574038668223316L213.75,-1.4961579367641775L208.125,-2.1980716328393797L202.5,-2.8458615103325657L196.875,-3.423576832568509L191.25,-3.916992330986531L185.625,-4.313958478463425L180,-4.6047006509932L174.375,-4.782059811370223L168.75,-4.841668788444707L163.125,-4.782059811370223L157.5,-4.604700650993199L151.875,-4.313958478463425L146.25,-3.9169923309865293L140.625,-3.4235768325685076L135,-2.8458615103325644L129.375,-2.198071632839376L123.75000000000001,-1.496157936764178L118.125,-0.7574038668223299L112.5,5.929334184300454e-16L106.875,0.757403866822331L101.25,1.4961579367641769L95.625,2.198071632839379L90,2.8458615103325653L84.375,3.423576832568508L78.75,3.91699233098653L73.125,4.313958478463425L67.5,4.6047006509932L61.87500000000001,4.782059811370223L56.25,4.841668788444707L50.625,4.782059811370223L45,4.604700650993199L39.375,4.313958478463425L33.75,3.91699233098653L28.125,3.4235768325685076L22.5,2.845861510332565L16.875,2.1980716328393783L11.25,1.4961579367641762L5.625,0.7574038668223305L0,0Z" 
                  transform="translate(190.89679104854812,0)">
              </path>
          </clipPath>
        </defs>
        <g clipPath="url(#clipWavefillgauge1)">
          <circle cx="125" cy="125" r="112.5" 
            style={{
              'fill': 'rgb(23, 139, 202)'
            }}>
          </circle>
          <text className="liquidFillGaugeText" 
            textAnchor="middle" 
            fontSize="8" 
            transform="translate(125,146.875)" 
            style={{
              'fill': 'rgb(164, 219, 248)'
            }}>
              54%
          </text>
        </g>
      </g>
                            <text className={`childBubbleText${uitem.uid}`} 
                                x={uitem.x} 
                                y={uitem.y} 
                                textAnchor="middle" 
                                fontSize="6" 
                                cursor="pointer" 
                                dominantBaseline="middle" 
                                alignmentBaseline="middle" 
                                style={{
                                  'opacity': 0.5,
                                  'fill': 'rgb(31, 119, 180)'
                                }}>
                                {uitem.uid}
                            </text>
                          </g>
                        })
                      }
                  </svg>
                {/* <p>hotspots: {this.props.hotspots.length}</p>
                <p>edges: {this.props.edges.length}</p>
                <p>checkins: {this.props.checkins.length}</p> */}
              </div>
            </div>

            <div className="section hotspots-section">
              <div className="section-title">hotspots</div>
              <div className="section-content hotspots-content">
                <svg id="checkin-svg" className="checkin-svg">
                  <g className="rectsgroup">
                      {
                        this.props.checkinsByuid && this.props.checkinsByuid.length ? this.props.checkinsByuid.map((citem, cindex) => {
                          return <rect key={citem.id || cindex} className={`checkinitem checkin-in-${citem.id}`} x="0" y={cindex * 20} width={citem.count * 2} height="18"></rect>
                        }) : null
                      }
                  </g>
                </svg>
              </div>
            </div>

            {/* <div className="section record-section">
              <div className="section-title">record</div>
              
            </div> */}

      </div>
  }
}

function mapStateToProps(store) {
  // var usermap = {
  // };
  // if(store.checkins.length > 0) {
  //   store.checkins.forEach((item) => {
  //     var uid = +item.uid;
  //     if(!usermap[uid]) {
  //       usermap[uid] = 0;
  //     }
  //     usermap[uid] ++;
  //   })
  // }

  // var userids = Object.keys(usermap);

  // var entries = userids.map((uid, index) => {
  //   return {
  //     uid: +uid,
  //     count: usermap[uid]
  //   }
  // })

  // console.warn(userids, usermap, store.checkins)

  return {
    edges: store.edges,
    hotspots: store.hotspots,
    checkins: store.checkins,
    locationtree: store.locationtree,
    usertree: store.usertree,
    // checkinsByuid: entries
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
