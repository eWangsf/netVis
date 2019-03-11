import React, { Component } from 'react';
import { connect } from 'react-redux';
import G2 from '@antv/g2';
import * as d3 from 'd3';
import { mainColor } from 'constants/colors';

import './index.scss';
var containersize = {
  width: 0,
  height: 0
}
var margin = {
  top: 20,
  right: 15,
  bottom: 20,
  left: 35
}

class RoseSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,

    }
  }

  componentDidMount() {
    containersize = {
      width: +(getComputedStyle(document.querySelector('#rosecontainer')).width.slice(0, -2)),
      height: +(getComputedStyle(document.querySelector('#rosecontainer')).height.slice(0, -2))
    };
    this.initRose();
  }

  initRose() {
    var data = [{
      clock: '1',
      population: 41.8
    }, {
      clock: '2',
      population: 38
    }, {
      clock: '3',
      population: 33.7
    }, {
      clock: '4',
      population: 30.7
    }, {
      clock: '5',
      population: 25.8
    }, {
      clock: '6',
      population: 31.7
    }, {
      clock: '7',
      population: 33
    }, {
      clock: '8',
      population: 46
    }, {
      clock: '9',
      population: 38.3
    }, {
      clock: '10',
      population: 28
    }, {
      clock: '11',
      population: 42.5
    }, {
      clock: '12',
      population: 30.3
    }, {
      clock: '13',
      population: 41.8
    }, {
      clock: '14',
      population: 38
    }, {
      clock: '15',
      population: 33.7
    }, {
      clock: '16',
      population: 30.7
    }, {
      clock: '17',
      population: 25.8
    }, {
      clock: '18',
      population: 31.7
    }, {
      clock: '19',
      population: 33
    }, {
      clock: '20',
      population: 46
    }, {
      clock: '21',
      population: 38.3
    }, {
      clock: '22',
      population: 28
    }, {
      clock: '23',
      population: 42.5
    }, {
      clock: '24',
      population: 30.3
    }];

    var chart = new G2.Chart({
      container: 'rosecontainer',
      width: containersize.width,
      height: containersize.height,
      padding: {
        ...margin,
        right: 85
      },
      forceFit: true,
    });
    chart.legend({
      position: 'right',
      offsetY: -80,
      offsetX: 10
    });
  
    chart.source(data);
    chart.coord('polar', {
      startAngle: - 0.5 * Math.PI, // 起始角度
      endAngle: 1.5 * Math.PI // 结束角度
    });
    chart.interval().position('clock*population').color('population', `${mainColor}-rgb(255,215,135)`)
  
    chart.render();
  
    // var chart = new G2.Chart({
    //   container: 'rosecontainer',
    //   forceFit: true,
    //   width: containersize.width - margin.left - margin.right,
    //   height: containersize.height
    // });
    // chart.source(data);
    // chart.coord('polar');
    // chart.legend({
    //   position: 'right',
    //   offsetY: 10,
    //   offsetX: -90
    // });
    // chart.axis(false);
    // chart.interval().position('clock*population').color('clock', G2.Global.colors_pie_16).style({
    //   lineWidth: 1,
    //   stroke: '#fff'
    // });
    // chart.render();
  }


  render() {
    const { candidates } = this.props;
    
    return <div className="rose-section-wrapper">

    <div className="rosecontainer" id="rosecontainer"></div>
     
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
export default connect(mapStateToProps, mapDispatchToProps)(RoseSection);
