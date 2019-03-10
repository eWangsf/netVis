import React, { Component } from 'react';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import MapView from 'containers/MapView';
import SolutionsView from 'containers/SolutionsView';


import './index.scss';


class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <Router>
        <div className="app-container">
            <Switch>
              <Route exact path="/" component={MapView} />
              <Route exact path="/solutions" component={SolutionsView} />
            </Switch>
        </div>
      </Router>
    )
  }
}

function mapStateToProps(store) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
