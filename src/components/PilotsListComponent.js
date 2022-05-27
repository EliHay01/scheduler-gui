import React, { useState, useEffect }  from 'react';

import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import {Row, Col} from 'react-bootstrap'

import userService from '../services/user.service';

import EventBus from "../common/EventBus";

function PilotsListComponent (props) {

    console.log(props)
    

    
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [pilotsList, setPilots] = useState([]);


    useEffect(() => {
        console.log ('before calling getPilotsList')
        userService.getPilotsList().then(
            response => {
                console.log ('within pilot component then')
                setPilots(response.data);
                setIsLoaded(true);
            },
            error => {
                console.log ('within pilot component error')
                console.log(error)
                setError((error.response && error.response.data) ||
                  error.message ||
                  error.toString()
                );
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
          );
    }, [])
    
    const { user: currentUser } = props;

    console.log ('currentUser within pilots component',currentUser)

    if (!currentUser) {
      return <Redirect to="/login" />;
    }
    
    if (error) {
            return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <Spinner animation="border" />;
    } else {
        return (
            <Row className="justify-content-md-center">
                <Col md="12" >
                <Table mt='6' striped bordered hover>
                    <thead>
                        <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pilotsList.map (function (item,index) {
                                return <tr key={item.id}>
                                        <td>{item.id}</td> 
                                        <td>{item.name}</td>
                                        <td>{item.emailAddress}</td>
                                    </tr>
                            })
                        }
                    </tbody>
                </Table>
                </Col>
            </Row>
            
                
            
        );
    }
}

function mapStateToProps(state) {
    const { user } = state.auth;
    console.log ('user within mapStateToProps of pilots',user)
    return {
      user,
    };
  }
  
export default connect(mapStateToProps)(PilotsListComponent);