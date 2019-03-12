import React, { Component } from 'react';
import * as d3 from 'd3';
import G2 from '@antv/g2';

import './index.scss';
import { mainOrange, mainGreen, mainBlue, assistColorOrange, assistColorGreen, assistColorBlue } from 'constants/colors';


class Dash extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  static getDerivedStateFromProps(props, state) {
    renderDash(props.percent)
    return {
      ...state
    };
  }

  render() {

    return <div className="dash-wrapper" id="dash">
    </div>
  }
}

Dash.defaultProps = {
  percent: 0
}

export default Dash;

function renderDash(value) {
  var dash = document.getElementById('dash')

  if(!dash) {
    return ;
  }
  dash.innerHTML = '';
  var height = +(getComputedStyle(document.querySelector('#dash')).height.slice(0, -2));
  var data1 = [];
    for (var i = 0; i < 100; i++) {
      var item = {};
      item.type = i + '';
      item.value = 10;
      data1.push(item);
    }
  
    var data2 = [];
    for (var _i = 0; _i < 100; _i++) {
      var _item = {};
      _item.type = _i + '';
      _item.value = 10;
      if (_i === value) {
        _item.value = 14;
      }
      if (_i > value) {
        _item.value = 0;
      }
      data2.push(_item);
    }
  
    var chart = new G2.Chart({
      container: 'dash',
      forceFit: true,
      height: height,
      padding: 0
    });
    chart.scale({
      type: {
        range: [0, 1]
      },
      value: {
        sync: true
      }
    });
    chart.legend(false);
    chart.tooltip(false);
    var view1 = chart.view();
    view1.source(data1);
    view1.axis(false);
    view1.coord('polar', {
      startAngle: -9 / 8 * Math.PI,
      endAngle: 1 / 8 * Math.PI,
      innerRadius: 0.75,
      radius: 0.8
    });
    view1.interval().position('type*value').color('#CBCBCB').size(6);
  
    var view2 = chart.view();
    view2.source(data1, {
      type: {
        tickCount: 3
      }
    });
    view2.axis('value', false);
    view2.axis('type', {
      grid: null,
      line: null,
      tickLine: null,
      label: {
        offset: -6,
        textStyle: {
          textAlign: 'center',
          fill: '#CBCBCB',
          fontSize: 10
        },
        formatter: function formatter(val) {
          if (val === '99') {
            return 100;
          }
  
          return val;
        }
      }
    });
    view2.coord('polar', {
      startAngle: -9 / 8 * Math.PI,
      endAngle: 1 / 8 * Math.PI,
      innerRadius: 0.95,
      radius: 0.55
    });
    view2.interval().position('type*value').color('#CBCBCB').size(6);
  
    var view3 = chart.view();
    view3.source(data2);
    view3.axis(false);
    view3.coord('polar', {
      startAngle: -9 / 8 * Math.PI,
      endAngle: 1 / 8 * Math.PI,
      innerRadius: 0.75,
      radius: 0.8
    });

    var colors = `${mainOrange}-${assistColorOrange}`;
    var textColor = '#aaa';
    if(value > 40) {
      colors = `${mainBlue}-${assistColorBlue}`;
    }
    if(value > 70) {
      colors = `${mainGreen}-${assistColorGreen}`;
      textColor = mainGreen;
    }
    view3.interval().position('type*value').color('value', colors).opacity(1).size(6);
    view3.guide().text({
      position: ['50%', '65%'],
      content: `${value}%`,
      style: {
        fill: textColor,
        fontSize: 14,
        textAlign: 'center',
        textBaseline: 'middle'
      }
    });
  
    chart.render();
}