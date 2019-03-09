import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Divider, InputNumber, Slider, Input } from 'antd';
import { mapShotImg } from 'constants/mapconfig';
import { generate_locations } from 'actions';

import './index.scss';

const marks = {
  0: '0°C',
  26: '26',
  47: '47',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>100°C</strong>,
  },
};


class InputSection extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loadingLocation: false,
      userid: undefined,
      locations: [],
      hotscale: []
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
        img: mapShotImg,
        range: [-73, 41]
      }]
    })
  }

  generateLocations() {
    console.warn('generateLocations', this.state)
    this.setState({
      loadingLocation: true
    })
    const { userid, locations, hotscale } = this.state;
    this.props.generateLocations({
      userid,
      locations,
      hotscale
    }, () => {
      this.setState({
        loadingLocation: false
      })
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
    const { userid, loadingLocation } = this.state;

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
                return <div className="location-preference-item" key={index}>
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

              <Slider className="hot-slider" size="small" range marks={marks} defaultValue={[26, 47]} 
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

  return {
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
