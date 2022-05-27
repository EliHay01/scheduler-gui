import { useEffect, useState } from 'react';

import { Col, Row } from 'react-bootstrap'
import PilotPicture from '../PilotPicture'
import PilotDetails from '../PilotDetails'
import EventsListComponent from '../EventsListComponent'
import { connect } from "react-redux";

function Home(props) {

    console.log ("props are :", props)
    if (props.user && props.user.pilotExist == false){
        const { history, message } = props;
        history.push("/editpilot")
    }
    
    const [error, setError] = useState(null);
    const [imageFile, setImageFile] = useState("");

    return (
        <div>
            <Row>
                <h1 className="mt-3 text-center">Pilot's Homepage</h1>
            </Row>
            <Row className="justify-content-md-center">
                <Col xs={12} sm={10} md={3} lg={3}>
                    <PilotPicture imageFile={imageFile}>

                    </PilotPicture>
                </Col>
                <Col md={1}/>
                <Col xs={12} sm={10} md={5} lg={5}>
                    <PilotDetails setImageFile={setImageFile}/>
                </Col>
            </Row>
            <Row>
                <EventsListComponent/>
            </Row>
        </div>
    )
}

function mapStateToProps(state) {
    const { user } = state.auth;
    console.log ('user within mapStateToProps of Home',user)
    return {
      user,
    };
  }
  
export default connect(mapStateToProps)(Home);