import { useEffect, useState } from 'react';

import { Col, Row } from 'react-bootstrap'
import { Form } from 'react-bootstrap'

import userService from '../services/user.service';

import EventBus from "../common/EventBus";

export default function PilotDetails(props) {
    
    const setImageFile = props.setImageFile;
    console.log("Hi")
    const [error, setError] = useState(null);
    const [loaded, setIsLoaded] = useState(false);
    const [pilotDetails, setPilotDetails] = useState(null);
    const [medicalClass, setMedicalClass] = useState("");
    console.log("Bye");

    useEffect(() => {

        console.log ('before calling getPilotDetails')

        userService.getPilotDetails().then(
            response => {
                console.log ('within pilot details component then',response.data)
                setPilotDetails(response.data);
                setMedicalClass ("Class " + (pilotDetails && pilotDetails.medicalClass));
                console.log ("Medical ", medicalClass)
                setImageFile(response.data.profileImagePath)
                setIsLoaded(true);
            },
            error => {
                console.log ('within pilot details component error')
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
    }, [loaded])

    return (
        <Form>
            <Form.Group as={Row} className="mb-3 mt-5" controlId="formPlaintextEmail">
                <Form.Label column sm="3">
                    Name
                </Form.Label>
                <Col sm="9">
                    <Form.Control type="text" placeholder={pilotDetails && pilotDetails.name} readOnly />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                <Form.Label column sm="3">
                    Email Address
                </Form.Label>
                <Col sm="9">
                    <Form.Control type="text" placeholder={pilotDetails && pilotDetails.emailAddress} readOnly />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                <Form.Label column sm="3">
                    Phone Number
                </Form.Label>
                <Col sm="9">
                    <Form.Control type="text" placeholder={pilotDetails && pilotDetails.phoneNumber} readOnly />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                <Form.Label column sm="3">
                    Company
                </Form.Label>
                <Col sm="9">
                    <Form.Control type="text" placeholder={pilotDetails && pilotDetails.relatedCompanyName} readOnly />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                <Form.Label column sm="3">
                    License Type
                </Form.Label>
                <Col sm="3">
                    <Form.Control type="text" placeholder={pilotDetails && pilotDetails.licenseType} readOnly />
                </Col>
                <Form.Label column sm="3">
                    Medical Class
                </Form.Label>
                <Col sm="3">
                    <Form.Control type="text" placeholder={medicalClass} readOnly />
                </Col>
            </Form.Group>
            
                
            
        </Form>
    )
}