import React, { useState, useEffect }  from 'react';

import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import Spinner from 'react-bootstrap/Spinner'
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table'
import {Row, Col} from 'react-bootstrap'
import { Link } from 'react-router-dom';

import userService from '../services/user.service';

import EventBus from "../common/EventBus";

function EventsListComponent (props) {

    console.log(props)
    

    
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [EventsList, setEvents] = useState([]);


    useEffect(() => {
        console.log ('before calling getEventsList')
        userService.getEventsList().then(
            response => {
                console.log ('within pilot component then')
                setEvents(response.data);
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

    console.log ('currentUser within Events component',currentUser)

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
                <h3> Your Scheduled Events</h3>
                <Table mt='6' striped bordered hover>
                    <thead>
                        <tr>
                        <th>Title</th>
                        <th>Airplane</th>
                        <th>Date</th>
                        <th>Start</th>
                        <th>End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            EventsList.map (function (item,index) {
                                let ed = new Date(item.eventDate)
                                let st_time = new Date(item.eventStartTime)
                                let ed_time = new Date(item.eventEndTime)
                                let curr_date = Date.now()
                                return <tr key={item.id}>   
                                        <td>{item.eventTitle}</td> 
                                        <td>{item.tailNumber}</td> 
                                        <td>{("0"+ed.getDate()).slice (-2) +'/'+("0"+(ed.getMonth()+1)).slice(-2)+'/'+ed.getFullYear()}</td>
                                        <td>{("0"+st_time.getHours()).slice (-2) +':'+("0"+st_time.getMinutes()).slice (-2)}</td>
                                        <td>{("0"+ed_time.getHours()).slice (-2) +':'+("0"+ed_time.getMinutes()).slice (-2)}</td>
                                        <td>{(ed_time > curr_date) && 
                                                <Button variant="danger" size="sm" >Cancel Future Event</Button>}
                                            {(ed_time <= curr_date) &&
                                                <Button variant="danger" size="sm" >Cancel Flight Log</Button>
                                            }
                                        </td>
                                        <td>
                                            <Link to = {{
                                                pathname: "/usage",
                                                state: {start: item.eventStartTime, end: item.eventEndTime, event_id: item.id}
                                            }}>
                                                <Button variant="primary" size="sm">Enter Flight Log</Button>
                                            </Link>
                                        </td>
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
    console.log ('user within mapStateToProps of Events',user)
    return {
      user,
    };
  }
  
export default connect(mapStateToProps)(EventsListComponent);