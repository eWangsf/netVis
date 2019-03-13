import React, { Component } from 'react';
import { connect } from 'react-redux';
import G2 from '@antv/g2';
import * as d3 from 'd3';
import Dash from 'components/dash';
import { mainColor } from 'constants/colors'

import './index.scss';

var margin = {
  top: 10,
  right: 15,
  bottom: 10,
  left: 15
};

var textcellwidth = 45;

class CandidatedescSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      containersize: {
        width: 0,
        height: 0
      },
      xscale: d3.scaleLinear().domain([0, 100]),
      yscale: d3.scaleLinear().domain([0, 0])
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,

    }
  }

  componentDidMount() {
    var containersize = {
      width: +(getComputedStyle(document.querySelector('#detailsvg')).width.slice(0, -2)),
      height: +(getComputedStyle(document.querySelector('#detailsvg')).height.slice(0, -2))
    }
    this.setState({
      containersize: containersize,
      xscale: this.state.xscale.range([margin.left+textcellwidth, containersize.width-margin.right-textcellwidth]),
      yscale: this.state.yscale.range([margin.top, containersize.height-margin.bottom]),
    })
  }

  render() {
    const { candidate } = this.props;
    const { xscale, yscale } = this.state;

    candidate.attrs = [{
      title: 'distance',
      value: 80
    }, {
      title: 'hotlevel',
      value: 50
    }, {
      title: 'turnin',
      value: 60
    }]
    yscale.domain([0, candidate.attrs.length])
    var rectHeight = yscale(1) - yscale(0) - 8;

    return <div className="candidatedesc-section-wrapper">
        <div className="dash-row">
          <Dash percent={30}></Dash>
        </div>
        <div className="location-base-info-row">
            <div className="numberlogo"></div>
            <div className="location-id">{candidate.lid}</div>
        </div>

        <div className="position-row">
        </div>

        <div className="detail-row">
          <svg className="detailsvg" id="detailsvg">
            {
              candidate.attrs.map((attritem, attrindex) => {
                return <g className={`attr-group attr-group${attrindex}`} key={attrindex}
                style={{
                  'transform': `translate3d(${xscale(0)}px, ${yscale(attrindex)}px, 0)`
                }}
                >
                <text 
                className={`attr-title attr-title${attrindex}`}
                x="0"
                y="0"
                dominantBaseline="middle" 
                alignmentBaseline="middle"
                textAnchor="end"
                style={{
                  transform: `translate3d(-10px, 13px, 0)`,
                  fontSize: '13px',
                  fill: '#999'
                }}
                >{attritem.title}</text>
                <rect className={`attr-back attr-back${attrindex}`}
                x={0}
                y={0}
                rx="5"
                ry="5"
                width={xscale.range()[1]}
                height={rectHeight}
                style={{
                  fill: '#efefef'
                }}
                ></rect>
                <rect className={`attr-back attr-back${attrindex}`}
                x={0}
                y={0}
                rx="5"
                ry="5"
                width={xscale(attritem.value)}
                height={rectHeight}
                style={{
                  fill: mainColor
                }}
                ></rect>
                <text 
                className={`attr-value attr-value${attrindex}`}
                x={xscale(attritem.value)+xscale.domain()[0]}
                y="0"
                dominantBaseline="middle" 
                alignmentBaseline="middle"
                textAnchor="end"
                style={{
                  transform: `translate3d(-10px, 13px, 0)`,
                  fontSize: '13px',
                  fill: '#fff'
                }}
                >{attritem.value}</text>
                
                </g>
              }) 
            }

          </svg>
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
export default connect(mapStateToProps, mapDispatchToProps)(CandidatedescSection);
