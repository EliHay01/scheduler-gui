import { connect } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import React from 'react'

import NavBarComponent from './components/NavBarComponent';

import PilotsListComponent from './components/PilotsListComponent';
import SchedulerComponent from './components/SchedulerComponent';
import RegisterForm from './components/RegisterForm/RegisterForm';
import LoginForm from './components/login.component';
import RegisterPilot from './components/RegisterPilot/RegisterPilot';

import { logout } from "./redux/actions/auth";
//import { clearMessage } from "./redux/actions/message";
import { history } from './helpers/history';
import { useEffect } from 'react';

import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";
import { Container } from "react-bootstrap";
import Home from "./components/Home/oldHome";
import AirplaneUsage from "./components/AirplaneUsage/AirplaneUsage";

function App(props) {
  
const user = props.user;

  useEffect (()=>{
    
    console.log ('within app.js useEffect user:',user)
  
    EventBus.on("logout", () => {
      logOut();
    });

    return function cleanup() {
      EventBus.remove("logout");
    };

  },[user]);

  function logOut() {
    props.dispatch(logout());
    history.push("/Login")
  }

  return (
    <div className="App">
      <Router history={history}>
        <NavBarComponent logOut={logOut}/>  
          <Switch>
            <React.Fragment>
            <Container fluid>
              <Route path={"/editpilot"} component={RegisterPilot} />
              <Route path={"/Pilots"} component={PilotsListComponent}/>
              <Route path={"/scheduler"} component={SchedulerComponent}/>
              <Route exact path={["/Register/:compId", "/Register/"]} component={RegisterForm}/>
              <Route exact path={"/Login"} component={LoginForm}/>
              <Route exact path={"/Home"} component={Home}/>
              <Route exact path={"/Usage"} component={AirplaneUsage}/>
            </Container>
            </React.Fragment>
          </Switch>
          <AuthVerify logOut={logOut}/>
      </Router>
    </div>
  );
}

function mapStateToProps(state) {
  const { user } = state.auth;
  console.log ('within app.js mapStateToProps user:',user)
  return {
    user,
  };
}

export default connect(mapStateToProps)(App);