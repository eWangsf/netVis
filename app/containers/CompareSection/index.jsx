import React, { Component } from 'react';
import { connect } from 'react-redux';
import G2 from '@antv/g2';
import Circle from 'components/circle';
import * as d3 from 'd3';

import './index.scss';
import { func } from 'prop-types';

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

var bandwidth = 3600*24*1000*30; //1 day

class CompareSection extends Component {

  constructor(props) {
    super(props);

    this.getSolutions = this.getSolutions.bind(this);
    this.drawSolution = this.drawSolution.bind(this);
    this.clearSvg = this.clearSvg.bind(this);
    this.drawMarks = this.drawMarks.bind(this);

    this.state = {
      bwtype: 2
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
      solutions: candidates,
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
    
    if(!solutions[0].data) {
      setTimeout(this.getSolutions, 1000);
      return ;
    }

    solutions.forEach(solution => {
      solution.data.sort((x, y) => {
        return x.timestamp > y.timestamp ? 1 : -1;
      })
      var marks = solution.data.filter(item => item.checkins.length > (0.55 * (checkinsizescale.domain()[1]-checkinsizescale.domain()[0] + checkinsizescale.domain()[0]))).map(item => item.timestamp);
      solution.marks = marks;

      this.drawMarks(solution);
      this.drawSolution(solution);
    })

  }

  clearSvg() {
    var svg = d3.select('#comparesvg');
    svg.selectAll('g').remove();
  }

  drawMarks(solution) {
    var marks = solution.marks;

    var svg = d3.select('#comparesvg');

    var locationBubblegroup = svg.append('g')
    .attr("class", `topBubblegroup topBubblegroup${solution.lid}`)
    .style("transform", function (d, i) {
      return `translate3d(${margin.left}px, ${locationbaseyscale(solution.index)}px, 0)`
    });
    
    var marksgroup = locationBubblegroup.append('g')
      .attr('class', 'marksgroup')
      .style('transform', `translate3d(0, ${bubbleradius}px, 0)`);

      marksgroup.selectAll('.markline')
      .data(marks)
      .enter()
      .append('line')
      .attr('class', 'markline')
      .attr('x1', function (d, i) {
        return timescale(+d)
      })
      .attr('y1', 0)
      .attr('x2', function (d, i) {
        return timescale(+d)
      })
      .attr('y2', function(d, i) {
        return locationbaseyscale.range()[1] - locationbaseyscale.range()[0] - (locationbaseyscale(solution.index)) + 2*bubbleradius + 10;
      })
    
      marksgroup.selectAll('.marktext')
      .data(marks)
      .enter()
      .append('text')
      .attr('class', 'marktext')
      .attr('x', function (d, i) {
        return timescale(+d)
      })
      .attr('y', function(d, i) {
        return locationbaseyscale.range()[1]-locationbaseyscale(solution.index)+2*bubbleradius;
      })
      .style('transform-origin', function(d, i) {
        return `${timescale(+d)}px ${locationbaseyscale.range()[1]-locationbaseyscale(solution.index)+2*bubbleradius}px`
      })
      .text(function(d, i) {
        var date = new Date(+d);
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      })


  }

  drawSolution(solution) {
    var svg = d3.select('#comparesvg');

    var locationBubblegroup = svg.select(`.topBubblegroup${solution.lid}`)

    locationBubblegroup.append('circle')
    .attr('class', `topBubble topBubble${solution.lid}`)
    .attr('cx', bubbleradius)
    .attr('cy', function (d, i) {
      return bubbleradius;
    })
    .attr('r', bubbleradius-rowpadding);

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

  bandwidthChange(value) {
    this.setState({
      bwtype: value
    })

    bandwidth = value*24*3600*1000;

    setTimeout(this.getSolutions, 300);
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
              
              </div>
            })
          }
        </div>
        <svg className="comparesvg" id="comparesvg">
        </svg>
        <div className="bandwidth-change" >
            <div className={`item day ${this.state.bwtype === 1 ? 'selected' : ''}`} title="daily" onClick={this.bandwidthChange.bind(this, 1)}></div>
            <div className={`item month ${this.state.bwtype === 30 ? 'selected' : ''}`} title="monthly" onClick={this.bandwidthChange.bind(this, 30)}></div>
            <div className={`item year ${this.state.bwtype === 365 ? 'selected' : ''}`} title="yearly" onClick={this.bandwidthChange.bind(this, 365)}></div>
        </div>
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
