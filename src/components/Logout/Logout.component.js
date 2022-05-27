import React, { useState, useEffect }  from 'react';

import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'

import userService from '../services/user.service';

function LogoutComponent (props) {
    retun (
        <h2>Sorry to see you leave...</h2>
    )

}

function mapStateToProps(state) {
    const { user } = state.auth;
    console.log ('user within mapStateToProps of pilots',user)
    return {
        user,
    };
}
    
export default connect(mapStateToProps)(LogoutComponent);