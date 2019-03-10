import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { Button, Icon, Divider, InputNumber, Slider, Input, message } from 'antd';
import { mapShotImg } from 'constants/mapconfig';
import { generate_locations } from 'actions';

import './index.scss';

const success = (msg) => {
  message.success(msg);
};

const error = (msg) => {
  message.error(msg);
};

const warning = (msg) => {
  message.warning(msg);
};


class InputSection extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loadingLocation: false,
      userid: 22,
      locations: [{
        bounds: {
          latrange: [40.477801417067724, 40.965600641811676],
          lngrange: [-74.14907136830624, -73.85488618730457]
        },
        img: mapShotImg
      }],
      hotscale: [50, 100]
    }
  } 

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
    }
  }

  componentDidMount() {
  }

  onUserChange(e) {
    this.setState({
      userid: +e.target.value
    })
  }
  addLocationRangePreference() {
    
    this.setState({
      locations: [...this.state.locations, {
        bounds: {
          latrange: [40.477801417067724, 40.965600641811676],
          lngrange: [-74.14907136830624, -73.85488618730457]
        },
        img: mapShotImg
      }]
    })
  }

  generateLocations() {
    const { countrange } = this.props;
    const { userid, locations, hotscale } = this.state;
    this.setState({
      loadingLocation: true
    })
    var d3hotcale = d3.scaleLinear().domain([0, 100]).range(countrange)
    this.props.generateLocations({
      userid,
      locations,
      hotscale: [Math.floor(d3hotcale(hotscale[0])), Math.ceil(d3hotcale(hotscale[1]))]
    }, () => {
      this.setState({
        loadingLocation: false
      })
      location.hash = '#/solutions';
    }, () => {
      this.setState({
        loadingLocation: false
      })
      warning('generate failed')
    })
  }

  generateUsers() {
    console.warn('generateUsers', this.state)
  }

  onHotChange(value) {
    this.setState({
      hotscale: value
    })
  }


  render() {
    const { countrange } = this.props;
    const { userid, loadingLocation, hotscale } = this.state;

    const marks = {
      0: `${countrange[0]}`,
      100: {
        style: {
          color: '#f50',
        },
        label: countrange[1],
      },
    }

    return <div className="input-section-wrapper">
        <div className="section param-section">
          <div className="param-item">
            <div className="param-item-title"><Icon type="tags" />user id</div>
            <div className="param-item-content">
              <Input addonBefore={<Icon type="user" />} defaultValue="0" value={this.state.userid}
                onChange={this.onUserChange.bind(this)}
              />

              {/* <InputNumber
                className="input-number"
                defaultValue={0}
                size="small"
                formatter={value => `# ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              /> */}
            </div>
          </div>

          <div className="param-item">
            <div className="param-item-title"><Icon type="tags" />location preference</div>
            <div className="param-item-content">
            {
              this.state.locations.map((item, index) => {
                return <div className="location-preference-item" key={index} onClick={() => console.warn(item.bounds)}>
                    <img src={item.img} />
                </div>
              })
            }
              <Icon className="location-add-btn" type="plus-square" 
              style={{
                marginLeft: this.state.locations.length === 0 ? 0 : '12px'
              }}
              onClick={this.addLocationRangePreference.bind(this)}/>
            </div>
          </div>

          <div className="param-item">
            <div className="param-item-title"><Icon type="tags" />hot scale</div>
            <div className="param-item-content">

              <Slider className="hot-slider" size="small" range marks={marks} defaultValue={hotscale} 
                onChange={this.onHotChange.bind(this)}/>

            </div>
          </div>
         

        </div>
        <div className="section operation-section">
            <Button className="input-btn" type="primary" size="large" loading={loadingLocation} onClick={this.generateLocations.bind(this)}>{!loadingLocation ? <Icon type="environment" /> : null}Find Locations</Button>
            <Button className="input-btn" type="primary" size="large" onClick={this.generateUsers.bind(this)}><Icon type="team" />Find Friends</Button>
        </div>
      </div>
  }
}

function mapStateToProps(store) {
  var heatmapdata = store.heatmapdata;
  var lmap = {};

  heatmapdata.forEach(item => {
    if(!lmap[item.lid]) {
      lmap[item.lid] = {
        count: 0
      }
    }
    lmap[item.lid].count ++;
  });
  var counts = Object.keys(lmap).map(item => {
   return lmap[item].count;
  })

  return {
    countrange: [Math.min(...counts, 0), Math.max(...counts, 0)]
  }
}

function mapDispatchToProps(dispatch) {
  return {
    generateLocations(params, successCb, failCb) {
      dispatch(generate_locations(params, successCb, failCb));
    },
    

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputSection);
