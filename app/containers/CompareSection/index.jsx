import React, { Component } from 'react';
import { connect } from 'react-redux';
import G2 from '@antv/g2';
import Circle from 'components/circle';
import * as d3 from 'd3';

import './index.scss';

var containersize = {
  width: 0,
  height: 0
}
var margin = {
  top: 20,
  right: 15,
  bottom: 20,
  left: 15
}

var usersectionwidth = 200;
var textareaheight = 60;

var rowpadding = 5;

var bubbleradius = 10;
var locationbaseyscale = d3.scaleLinear().domain([0, 0]).range([margin.top, containersize.height-margin.bottom-textareaheight]);
var checkinsizescale = d3.scaleLinear().domain([0, 0]).range([0, bubbleradius]);
var timescale = d3.scaleLinear().domain([0, 0]).range([0, containersize.width]);

var bandwidth = 3600*24*1000*15; //1 day

class CompareSection extends Component {

  constructor(props) {
    super(props);

    this.getSolutions = this.getSolutions.bind(this);
    this.drawSolution = this.drawSolution.bind(this);
    this.clearSvg = this.clearSvg.bind(this);

    this.state = {
      candidatescheckins: [],
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { candidates } = props;
    var timerange = [+new Date().getTime(), 0];
    var maxcount = 0;
    var mincount = Number.MAX_SAFE_INTEGER;

    candidates.forEach((solution, sindex) => {
      if(!solution.checkins) {
        return ;
      }
      var checkins = solution.checkins.map((item, index) => {
        return {
          ...item,
          candidateindex: sindex,
        }
      });
      var times = checkins.map((item, index) => {
        return +item.time;
      })
      timerange = [Math.min(timerange[0], ...times), Math.max(timerange[1], ...times)]
    });
    timescale.domain(timerange);


    candidates.forEach((solution, sindex) => {
      var checkinmap = {};
      if(!solution.checkins) {
        return ;
      }
      solution.checkins.forEach(checkin => {
        var key = Math.floor((checkin.time - timerange[0]) / bandwidth) * bandwidth + timerange[0];
        if(!checkinmap[key]) {
          checkinmap[key] = {
            timekey: key,
            checkins: [],
          }
        }
        checkinmap[key].checkins.push(checkin)
      })
      var output = Object.keys(checkinmap).map(item => {
        mincount = Math.min(mincount, checkinmap[item].checkins.length);
        maxcount = Math.max(maxcount, checkinmap[item].checkins.length);
        return {
          timestamp: item,
          checkins: checkinmap[item].checkins
        }
      });
      solution.data = output;
      solution.index = sindex;
      solution.users = Array.from({
        length: Math.floor(Math.random()*20)
      }).fill(0);
    });
    checkinsizescale.domain([mincount, maxcount])

    return {
      ...state,
      solutions: candidates
    }
  }

  componentDidMount() {
    const { candidates } = this.props;
    containersize = {
      width: +(getComputedStyle(document.querySelector('#comparesvg')).width.slice(0, -2)),
      height: +(getComputedStyle(document.querySelector('#comparesvg')).height.slice(0, -2))
    };
    bubbleradius = (containersize.height - margin.top - margin.bottom - textareaheight) / (candidates.length*2);
    locationbaseyscale.domain([0, candidates.length-1]).range([margin.top, containersize.height-margin.bottom-2*bubbleradius-textareaheight])
    checkinsizescale.range([2, bubbleradius-rowpadding]);
    timescale.range([2*bubbleradius+margin.left+10, containersize.width-usersectionwidth-margin.right-2*bubbleradius])
    
    setTimeout(this.getSolutions, 1000);
  }

  getSolutions() {
    const { solutions } = this.state;

    this.clearSvg();
    
    console.warn(solutions);
    if(!solutions[0].data) {
      setTimeout(this.getSolutions, 1000);
      return ;
    }

    solutions.forEach(solution => {
      solution.data.sort((x, y) => {
        return x.timestamp > y.timestamp ? 1 : -1;
      })
      this.drawSolution(solution);
    })

  }

  clearSvg() {
    var svg = d3.select('#comparesvg');
    svg.selectAll('g').remove();
  }

  drawSolution(solution) {

    // var timelinedata = this.changeCheckinRecords();
    // console.warn(timelinedata)

    var svg = d3.select('#comparesvg');

    var locationBubblegroup = svg.append('g')
    .attr("class", `topBubblegroup topBubblegroup${solution.lid}`)
    .style("transform", function (d, i) {
      return `translate3d(${margin.left}px, ${locationbaseyscale(solution.index)}px, 0)`
    });

    locationBubblegroup.append('circle')
    .attr('class', `topBubble topBubble${solution.lid}`)
    .attr('cx', bubbleradius)
    .attr('cy', function (d, i) {
      return bubbleradius;
    })
    .attr('r', bubbleradius-rowpadding);

    // var checkingroups = locationBubblesgroups.append('g')
    // .attr('class', 'checkinbubblesgroup')
    // .style('transform', `translate3d(${2*bubbleradius+margin.left+10}px, 0, 0)`);

    console.warn(solution.data)
    locationBubblegroup.selectAll('.checkinbubble')
    .data(solution.data)
    .enter()
    .append('circle')
    .attr('class', 'checkinbubble')
    .attr('cx', function(d, i) {
      return timescale(+d.timestamp);
    })
    .attr('cy', function(d, i) {
        return bubbleradius;
    })
    .attr('r', function(d, i) {
      return checkinsizescale(d.checkins.length)
    })

  }

  render() {
    const { solutions } = this.state;

    return <div className="compare-section-wrapper">
        <div className="svg" id="svg">
        {
            solutions.map((item, index) => {
              return <div className="svg-line" key={index} style={{
                position: 'absolute',
                top: locationbaseyscale(index),
                left: margin.left,
                width: `calc(100% - ${margin.left+margin.right}px)`,
                height: 2*bubbleradius
              }}>
                <div className="user-items-list" style={{
                  position: 'absolute',
                  width: usersectionwidth,
                  height: 2*bubbleradius,
                  right: 0,
                  top: 0
                }}>

                {
                  item.users && item.users.length > 0 ? item.users.map((suitem, suindex) => {
                    return  <div className="user-item" key={suindex}></div>
                  }) : null
                }

                </div>
                {/* <div className="top-bubble-cell" style={{
                  width: 2*bubbleradius,
                  height: 2*bubbleradius
                }}>
                </div>
                <div className="timeline-bubbles" id={`timeline-bubble-${item.lid}`}>

                </div> */}
              
              </div>
            })
          }
        </div>
        <svg className="comparesvg" id="comparesvg">
        </svg>
    </div>
  }

}

function mapStateToProps(store) {
  return {
  
  }

}

function mapDispatchToProps(dispatch) {
  return {
    // getCandidatesDetail(successCb, failCb) {
    //   dispatch(get_candidates_detail(successCb, failCb));
    // },

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CompareSection);
