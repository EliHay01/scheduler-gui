import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { Col, Row } from 'react-bootstrap'
import Home from './Home/oldHome'
import RegisterPilot from './RegisterPilot/RegisterPilot'

function Homer(props) {
    
    console.log ("Homer.props ",props)
    if (props.user.pilotExist){
        return (
            <Home></Home>
        )
    } else {
        return (
            <RegisterPilot>

            </RegisterPilot>
        )
    }
}

function mapStateToProps(state) {
    const { user } = state.auth;
    console.log ('user within mapStateToProps of homer',user)
    return {
      user,
    };
  }
  
export default connect(mapStateToProps)(Homer);