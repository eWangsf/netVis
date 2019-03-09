import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get_hotspots, get_checkins_by_lid, get_alllocations_by_userlist } from 'actions';

import { bubblesvgwidth, bubblesvgheight, margin, movestep, 
  topcircleconfig, toptextconfig, childcircleconfig, childtextconfig
} from 'constants/bubblesvgconfig';

import * as d3 from 'd3';

import './index.scss';


class OperationSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unsualshow: false,
      hotscale: null,
      activeLocation: {},
      activeLocationIndex: -1,
    }
  } 
  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      locationtree: props.locationtree.map(item => +item.lid === +state.activeLocation.lid ? {...item, active: true} : item),
      usertree: props.usertree,
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

  activateBubble(location, index) {
    this.setState({
      activeLocation: location,
      activeLocationIndex: index
    })
  }
  resetBubble(location, index) {
    this.setState({
      activeLocation: {},
      activeLocationIndex: -1,
      locationtree: this.state.locationtree.map(item => {
        return { ...item, active: false }
      })
    })
  }

  selectLocation(location) {
    console.warn('selectLocation', )
    var users = location.users;

    this.props.getAllLocationsByUserList(users, () => {
        console.warn(this.props.locationlist)
    })
  }

  selectUserInLocation(user) {
    console.warn('selectUserInLocation', user);
  }

  showLocationCheckinDetail(locationitem) {
    console.warn('showLocationCheckinDetail', locationitem.lid)
  }
  hideLocationCheckinDetail() {
    // d3.select('#locationDetailSvg').remove();
  }


  render() {
    const { locationlist } = this.props;
    var { locationtree, usertree, activeLocation, activeLocationIndex } = this.state;

    var nTop = locationtree.length;

    var radiusradio = 2.5;
    var bubblemarginratio = 0.25;
    var bubblemarginOuterratio = 0.5;

    var everypercent = (bubblesvgwidth - margin.left - margin.right - (activeLocationIndex > -1 ? 40 : 0)) / ((2*radiusradio+2+bubblemarginratio+bubblemarginOuterratio)*nTop);
    everypercent = Math.min(everypercent, 
    (bubblesvgheight - margin.top - margin.bottom) / (2*radiusradio+4+2*bubblemarginratio)
    )
    childcircleconfig.radius = everypercent;
    topcircleconfig.radius = radiusradio*everypercent;
    topcircleconfig.bubblemargin = bubblemarginratio*everypercent;
    topcircleconfig.hoverRadius = radiusradio*everypercent + 20;

    var xscale = d3.scaleLinear().domain([0, nTop-1]).range([margin.left + topcircleconfig.radius, bubblesvgwidth - margin.right - topcircleconfig.radius - topcircleconfig.bubblemargin - 2.5 * childcircleconfig.radius]),
        bubbledscale = d3.scaleLinear().domain([0, 1]).range([0, 2*Math.PI]),
        colors = [];

    for(var i = 0; i < Math.ceil(nTop/10); i++) {
      colors = colors.concat(d3.schemeCategory10);
    }

    var secondbubbles = [];
    
    return <div className="operation-section-wrapper">

            <div className={`section unusualspots-section ${this.state.unsualshow ? '' : 'hidden'}`}>
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
            </div>
    
            <div className="section clusters-section">
              {/* <div className="section-title">clusters</div> */}
              <div className="section-content">
                  <svg id="bubblesvg" className="bubblesvg">
                  {
                        locationtree && locationtree.length > 0 ? locationtree.map((locationitem, lindex) => {
                          var hasActive = activeLocationIndex >= 0;
                          var active = +activeLocation.lid === +locationitem.lid;

                          var cx = xscale(lindex), 
                              cy = 0.5 * bubblesvgheight,
                              r = active ? (topcircleconfig.hoverRadius) : (topcircleconfig.radius);
                          var movestep = (2*topcircleconfig.hoverRadius - 2*topcircleconfig.radius) / (nTop);
                          if(hasActive && activeLocationIndex > lindex) {
                            cx -= movestep;
                          }
                          if(hasActive && activeLocationIndex < lindex) {
                            cx += movestep;
                          }
                          // locationitem.usermap.forEach(umitem => {
                          //   var r1 = r,
                          //       r2 = r *0.65;
                          //   var path = `M${r1*Math.cos(bubbledscale())}`;

                          //   return <path d={path} fill={userinfo.color}></path>
                          // })

                          // second bubbles start
                          var degreescale = d3.scaleLinear().domain([0, locationitem.users.length -1]).range([-0.25*Math.PI, 0.25*Math.PI]);
                          var step = 0;
                          var _sarr = locationitem.usermap.map((useritem, uindex) => {
                            var userinfo = usertree.find(item => +item.uid === +useritem.uid);
                            var r1 = r,
                                r2 = r *0.65,
                                startdegree = bubbledscale( step/(+locationitem.count) ),
                                enddegree = bubbledscale( (step+useritem.count)/(+locationitem.count) );
                            step += useritem.count;
                            return {
                              lid: locationitem.lid,
                              uid: +useritem.uid,
                              r: childcircleconfig.radius,
                              x: cx + (r+topcircleconfig.bubblemargin+childcircleconfig.radius) * Math.cos(degreescale(uindex)),
                              y: cy - (r+topcircleconfig.bubblemargin+childcircleconfig.radius) * Math.sin(degreescale(uindex)),
                              active: active,
                              path: `M0 0L${r1*Math.cos(startdegree)} ${r1*Math.sin(startdegree)}A${r1} ${r1} 0 ${enddegree-startdegree < Math.PI ? 0 : 1} 1 ${r1*Math.cos(enddegree)} ${r1*Math.sin(enddegree)}Z`,
                              color: userinfo.color
                            }
                          })
                          secondbubbles = secondbubbles.concat(_sarr);
                          // second bubbles end

                          return <g className={`topBubbleAndText topBubbleAndText_${locationitem.lid} ${active ? 'active' : ''}`} key={locationitem.lid || lindex}
                                style={{
                                  'transform': `translate3d(${cx}px, ${cy}px, 0)`
                                }}
                                onMouseOver={this.activateBubble.bind(this, locationitem, lindex)} 
                                onMouseLeave={this.resetBubble.bind(this, locationitem, lindex)}
                                onClick={this.selectLocation.bind(this, locationitem)}
                            >
                              <circle className="topBubble" id={`topBubble${locationitem.lid}`} 
                                r={r} 
                                cx={0} 
                                cy={0} 
                                style={{
                                'fill': colors[lindex],
                                'opacity': topcircleconfig.opacity
                                }}
                              ></circle>
                              
                              {
                                _sarr.map((item, index) => {
                                  return <path d={item.path} fill={item.color} key={index}></path>
                                })
                              }
                              <circle 
                                r={r*0.65} 
                                cx={0} 
                                cy={0} 
                                style={{
                                  'fill': '#fff'
                                }}
                              ></circle>
                              <text className="topBubbleText" 
                                x={0}
                                y={0} 
                                textAnchor="middle"
                                fontSize={active ? toptextconfig.hoverFontSize : toptextconfig.fontSize}
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
                          var r = childcircleconfig.radius,
                              inner_r = r - 2,
                              bubble_r = r - 4,
                              active = uitem.active,
                              userinfo = usertree.find(item => +item.uid === +uitem.uid),
                              percent = userinfo && userinfo.total ? +userinfo.count / +userinfo.total : '',
                              degree = [Math.asin(1-2*percent), Math.PI - Math.asin(1-2*percent)];
  
                          return <g key={index} 
                            className={`childBubbleAndText childBubbleAndText${uitem.uid}`}
                            transform={`translate(${uitem.x},${uitem.y})`}
                            onClick={this.selectUserInLocation.bind(this, uitem)}
                            >
                            {/* <circle 
                              className={`childBubble childBubble${uitem.uid}`} 
                              id={`childBubble_${uitem.lid}sub_${uitem.uid}`} 
                              r={10} 
                              cx={uitem.x} 
                              cy={uitem.y} 
                              cursor="pointer" 
                              style={{
                                'opacity': 0.5,
                                'fill': `${d3.schemeCategory10[index]}`
                              }}></circle> */}
                            <path d={`M0,${r}A${r},${r} 0 1,1 0,-${r}A${r},${r} 0 1,1 0,${r}M0,${inner_r}A${inner_r},${inner_r} 0 1,0 0,-${inner_r}A${inner_r},${inner_r} 0 1,0 0,${inner_r}Z`} 
                              className={`childBubblePath childBubblePath${uitem.uid}`} 
                              style={{
                                  'fill': userinfo.color
                                }}>
                            </path>

                            {
                              percent ? <path d={`M${bubble_r*Math.cos(degree[1])},${bubble_r*Math.sin(degree[1])}A${bubble_r},${bubble_r} 0 0 0 0 ${bubble_r}A${bubble_r},${bubble_r} 0 0 0 ${bubble_r*Math.cos(degree[0])} ${bubble_r*Math.sin(degree[0])}Z`} 
                                className={`childBubbleInnerPath childBubbleInnerPath${uitem.uid}`} 
                                style={{
                                    'fill': 'rgb(23, 139, 202)'
                                  }}>
                              </path> : null
                            }
                              
                            
                            <text className={`childBubbleText childBubbleText${uitem.uid}`} 
                                x={0} 
                                y={percent < 0.25 || percent > 0.75 ? 0 : childcircleconfig.radius + 5} 
                                textAnchor="middle" 
                                fontSize={active ? childtextconfig.hoverFontSize : childtextconfig.fontSize} 
                                cursor="pointer" 
                                dominantBaseline="middle" 
                                alignmentBaseline="middle" 
                                style={{
                                  'opacity': active ? childtextconfig.hoverOpacity : childtextconfig.opacity,
                                  'fill': percent < 0.25 ? 'rgb(31, 119, 180)' : (percent > 0.75 ?  '#fff' : '#333')
                                }}>
                                {uitem.uid}
                            </text>
                          </g>
                        })
                      }
                  </svg>
              </div>
            </div>

            <div className="section record-section">
              <div className="section-content">
                  <div className="location-item location-item-header location-item-even">
                      <div className="cell location-id">位置id</div>
                      <div className="cell location-lng">经度</div>
                      <div className="cell location-lat">纬度</div>
                      <div className="cell location-userscount">用户数</div>
                      <div className="cell location-weight">签到数</div>
                  </div>
                  <svg className="locationDetailSvg" id="locationDetailSvg"></svg>
                  {
                    locationlist.map((litem, lindex) => {
                      return <div key={litem.lid} className={`location-item location-item-${litem.lid} ${lindex % 2 === 1 ? 'location-item-even' : ''}`}
                        onMouseOver={this.showLocationCheckinDetail.bind(this, litem)}
                        onMouseOut={this.hideLocationCheckinDetail.bind(this, litem)}
                      >
                          <div className="cell location-id">{litem.lid}</div>
                          <div className="cell location-lng">{litem.lng}</div>
                          <div className="cell location-lat">{litem.lat}</div>
                          <div className="cell location-userscount">{litem.users.length}</div>
                          <div className="cell location-weight">{litem.weight}</div>
                      </div>
                    })
                  }
                  
              </div>
            </div>

            {/* <div className="section hotspots-section">
              <div className="section-title">checkinsbyuid</div>
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

  var testlocationtree = [{
    "lid":771946,"count":3,"users":[51647,33817],usermap: [{uid: 51647, count: 1}, {uid: 33817, count: 2}]
  },{
    "lid":1426192,"count":1,"users":[34311],usermap: [{uid: 34311, count: 1}]
  },{
    "lid":3453809,"count":1,"users":[18512],usermap: [{uid: 18512, count: 1}]
  },{
    "lid":3937313,"count":1,"users":[112956],usermap: [{uid: 112956, count: 1}]
  }];

  var testusertree=[{
    "uid":18512,
    "count":1,
    "color": 'rgba(23, 65, 87, 1)',
    "total": 346,
    "checkins": [
      {"name":"checkin-2078158","coordinates":[-74.121740967,40.6710719],"lat":40.6710719,"lng":-74.121740967,"lid":3453809,"uid":18512,"time":"1284138600000","x":373.82685215462817,"y":208.55098537743356,"zoomLevels":""}
    ]
  },{
    "uid":33817,
    "count":1,
    "color": 'rgba(254, 123, 1, 1)',
    "total": 225,
    "checkins":[
      {"name":"checkin-2820832","coordinates":[-74.1116481,40.6679821],"lat":40.6679821,"lng":-74.1116481,"lid":771946,"uid":33817,"time":"1271192913000","x":373.8412063771566,"y":208.55642997839166,"zoomLevels":""}
    ]
  },{
    "uid":34311,
    "count":1,
    "color": 'rgba(134, 63, 87, 1)',
    "total": 223,
    "checkins":
    [
      {"name":"checkin-2851287","coordinates":[-74.10765868,40.67343455],"lat":40.67343455,"lng":-74.10765868,"lid":1426192,"uid":34311,"time":"1278881302000","x":373.84688126127,"y":208.54682195570052,"zoomLevels":""}
    ]
    },{
      "uid":51647,
      "count":1,
      "color": 'rgba(7, 124, 18, 1)',
      "total": 47,
      "checkins":[
        {"name":"checkin-3586281","coordinates":[-74.1116481,40.6679821],"lat":40.6679821,"lng":-74.1116481,"lid":771946,"uid":51647,"time":"1269285680000","x":373.8412063771566,"y":208.55642997839166,"zoomLevels":""}
    ]
    },{
      "uid":112956,
      "count":1,
      "color": 'rgba(23, 98, 180, 1)',
      "total": 2, //299
      "checkins":[
        {"name":"checkin-5107287","coordinates":[-74.099024838,40.670383532],"lat":40.670383532,"lng":-74.099024838,"lid":3937313,"uid":112956,"time":"1284780671000","x":373.8591603971751,"y":208.55219838388362,"zoomLevels":""}
      ]
    }];
  return {
    hotspots: store.hotspots,
    checkins: store.checkins,
    locationlist: store.locationlist,
    locationtree: store.locationtree.length > 0 ? store.locationtree : testlocationtree,
    usertree: store.usertree.length > 0 ? store.usertree : testusertree,
    // checkinsByuid: entries
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getHotSpots(successCb, failCb) {
      dispatch(get_hotspots(successCb, failCb));
    },
    getCheckinByLocation(lid, successCb, failCb) {
      dispatch(get_checkins_by_lid(lid, successCb, failCb));
    },
    getAllLocationsByUserList(users, successCb, failCb) {
      dispatch(get_alllocations_by_userlist(users, successCb, failCb));
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OperationSection);
