import { Formik } from 'formik'
import * as yup from 'yup'
import { Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { Row, Col } from 'react-bootstrap'
import React,{ useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";

import UserService from '../../services/user.service';
import EventBus from "../../common/EventBus";

const HobbsRegex = /^[0-9]{2,6}\.[0-9]{1}$/;

const yup_minValue = (comp_value, message) => {
    console.log ("Comp Value", comp_value)
    
    return yup.string().test("minValue2", message, function (value) {
        const {path, createError} = this
        console.log ("value is ", value)
        console.log ("path = ", path)
        if (comp_value >= value){
            return createError ({ path, message });
        }
        return true
    })
}

const yup_maxValue = (comp_value, message) => {
    console.log ("Comp Value", comp_value)
    
    return yup.string().test("minValue2", message, function (value) {
        const {path, createError} = this
        console.log ("value is ", value)
        console.log ("path = ", path)
        if (comp_value <= value){
            return createError ({ path, message });
        }
        return true
    })
}

yup.addMethod (yup.string, "yup_minValue", yup_minValue)
yup.addMethod (yup.string, "yup_maxValue", yup_maxValue)






function AirplaneUsage(props)
{
    const ref = useRef(null);
    const initAirplaneUsageDetails = { flightDate: '', flightStartTime: '', flightEndTime: '', totalHobbsTime:'0.0',startHobbs: '', endHobbs:'', endTach: '', takeOffAirport:'', intermidiateAirport:'', landAirport:'', fuel:0};  
    const [airplaneUsageDetails, setairplaneUsageDetails] = useState(initAirplaneUsageDetails);
    const initLimitDetails = {minHobbs:0, maxHobbs: 99999.9, minTach:0, maxTach:99999.9};
    const [flightDateReadOnly, setReadOnly] = useState (false);
    const [airplaneOpt, setAirplaneOpt] = useState (null);
    const [usageLimits, setUsageLimits] = useState(initLimitDetails);
    
    const [error, setError] = useState(null);
    const [loaded, setIsLoaded] = useState(false);
    const initRequest = {startDate: null, endDate: null}
    const [requestRange, setRange] = useState (initRequest)

    let validationSchema = yup.object().shape({
        flightDate: yup.date().required("Required!"),
        flightStartTime: yup.string().required("Required!"),
        flightEndTime: yup.string().required("Required!"),
        startHobbs: yup.string().yup_minValue(usageLimits.minHobbs,("Value should be bigger than "+usageLimits.minHobbs.toString())).matches(HobbsRegex,'One decimal place is mandatory').required("Required!"),
        endHobbs: yup.string().matches(HobbsRegex,'One decimal place is mandatory').required("Required!"),
        endTach: yup.string().matches(HobbsRegex,'One decimal place is mandatory').required("Required!"),
        airplane: yup.string().required("Required!")
    })

    if (!flightDateReadOnly && props.location.state != null)
    {
        let start = props.location.state.start;
        let end = props.location.state.end;
        let request = {
            startDate: start,
            endDate: end
        }
        setRange(request);
        setReadOnly (true);
        const flightDate = new Date(start);
        const usageData = 
        {
            ...airplaneUsageDetails,
            flightDate: ((flightDate.getFullYear()) + '-' +  
            ((flightDate.getMonth() > 8) ? (flightDate.getMonth() + 1) : ('0' + (flightDate.getMonth() + 1))) + '-' + 
            ((flightDate.getDate() > 9) ? flightDate.getDate() : ('0' + flightDate.getDate())))
        }

        setairplaneUsageDetails (usageData);
    }

    const validate = values => 
    {
        console.log ("within validate ",values)

        let usageDetails = 
        {
            ...values
        }

        if (values && values.flightDate && values.flightStartTime && values.flightEndTime)
        {
            console.log (values.flightDate,values.flightStartTime )
            const startDate = new Date(values.flightDate+"T"+values.flightStartTime)
            const endDate = new Date(values.flightDate+"T"+values.flightEndTime)

            if (! (requestRange.startDate === startDate && requestRange.endDate === endDate))
            {
                let request = 
                {
                    startDate: startDate,
                    endDate: endDate
                }
                console.log ("range is being changed")

                setRange(request);



            }
        }

        let startHobbs = parseFloat(values.startHobbs);
        let endHobbs = parseFloat(values.endHobbs);
        if (values && (typeof startHobbs == 'number') && (typeof endHobbs == 'number'))
        {
            usageDetails = 
            {
                ...values,
                totalHobbsTime: (values.endHobbs - values.startHobbs).toFixed(1)
            }
        }


        console.log ("usageDetails within validate", usageDetails);
        setairplaneUsageDetails(usageDetails)

    }



    useEffect(() => {

        console.log ("props: ", props)
        if (! loaded)
        {
            UserService.getAirplaneList().then(
                response => {
                    console.log ("List response", response)
                    let airplaneList = response.data;
                    let dropDownOptions = airplaneList.map(rec => <option key={rec.id} value={rec.id}>{rec.tailNumber}</option>);
                    setAirplaneOpt (dropDownOptions);
                    setIsLoaded(true);
                },
                error => {
                    console.log ('within Airplane Usage component error')
                    console.log(error)
                    console.log(error.response)
                    console.log(error.status)
        
                    setError((error.response && error.response.data) ||
                    error.message ||
                    error.toString()
                    );
                    if (error.response && error.response.status === 401) {
                    console.log("loging out...")
                    EventBus.dispatch("logout");
                    }
                }
            );
        }
        
        
        if (requestRange.startDate != null && requestRange.endDate != null){

            console.log ("retrieving limits...", requestRange, requestRange.startDate)
            UserService.getAirplaneUsageLimits(requestRange).then(
                response => {
                    console.log ("response", response)
                    if (response.data & response.data.previousAirplaneUsageData)
                    {
                        let currMinHobbs = response.data.previousAirplaneUsageData.endHobbs
                        let currMinTach = response.data.previousAirplaneUsageData.endTach

                        setUsageLimits 
                        ({
                            ...usageLimits,
                            minHobbs : currMinHobbs,
                            minTach : currMinTach
                        })
                    }
                    if (response.data & response.data.followingAirplaneUsageData)
                    {
                        let currMaxHobbs = response.data.followingAirplaneUsageData.startHobbs
                        let currMaxTach = response.data.followingAirplaneUsageData.endTach

                        setUsageLimits 
                        ({
                            ...usageLimits,
                            minHobbs : currMaxHobbs,
                            minTach : currMaxTach
                        })
                    }

                    
                },
                error => {
                    console.log ('within Register Pilot component error')
                    console.log(error)
                    console.log(error.response)
                    console.log(error.status)

                    setError((error.response && error.response.data) ||
                    error.message ||
                    error.toString()
                    );
                    if (error.response && error.response.status === 401) {
                    console.log("loging out...")
                    EventBus.dispatch("logout");
                    }
                }
            );
        }

    }, [requestRange])
  

    const onSubmit = async params => 
    {
        params = 
        {
            ...params,
        }

        const formData = new FormData()
                formData.append('airplaneId', params.airplane)
                formData.append('flightDate', params.flightDate)
                formData.append('flightStartTime', params.flightStartTime)
                formData.append('flightEndTime', params.flightEndTime)
                formData.append('startHobbs', params.startHobbs)
                formData.append('endHobbs', params.endHobbs)
                formData.append('endTach', params.endTach)
                formData.append('takeOffAirport', params.takeOffAirport)
                formData.append('intermidiateAirport', params.intermidiateAirport)
                formData.append('landAirport', params.landAirport)
                formData.append('fuel', params.fuel === undefined ? 0 : params.fuel)    
    
        if (props.user && props.user.pilotExist){
        UserService.createUsage(formData).then(
            response => {
                console.log ('within pilot (update) component then ' + response)
            },
            error => {
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
        }else{
        UserService.createPilot(formData).then(
            response => {
                console.log ('within pilot component then ' + response)
            },
            error => {
                setError((error.response && error.response.data) ||
                error.message ||
                error.toString()
            );
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("logout");
            }
            }
        );
        } 
    }

    return (
        <Formik
        innerRef={ref}
        validate={validate}
        validationSchema={validationSchema}
        onSubmit={onSubmit}     
        initialValues={{
            airplane: airplaneUsageDetails.airplane,     
            flightDate: airplaneUsageDetails.flightDate,
            flightStartTime: airplaneUsageDetails.flightStartTime,
            flightEndTime: airplaneUsageDetails.flightEndTime,
            startHobbs: airplaneUsageDetails.startHobbs,
            endHobbs: airplaneUsageDetails.endHobbs,
            totalHobbsTime: airplaneUsageDetails.totalHobbsTime,
            endTach: airplaneUsageDetails.endTach,
            takeOffAirport: airplaneUsageDetails.takeOffAirport,
            intermidiateAirport: airplaneUsageDetails.intermidiateAirport,
            landAirport: airplaneUsageDetails.landAirport,
            fuel: airplaneUsageDetails.fuel
        }}
        enableReinitialize={true}
        >
        {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            isInvalid,
            errors
        }) => (
            <Form  noValidate onSubmit={handleSubmit}>
                <Row xs={12} md={4} lg={4} className="justify-content-md-center">
                <h2> Enter Usage Data </h2>
                </Row>
                <Row className="justify-content-md-center">
                <Col xs={12} md={4} lg={3}>
                    <Form.Group className="mb-3" controlId="formBasicFileUpload">
                        <Form.Label>Flight Date</Form.Label>
                        <Form.Control
                        className="form-control"
                        readOnly={flightDateReadOnly}
                        type="date"
                        placeholder="Date..."
                        aria-describedby="inputGroupPrepend"
                        name="flightDate"
                        value={values.flightDate}
                        onChange={handleChange}
                        isInvalid={!!errors.flightDate}
                        />
                        <Form.Control.Feedback type="invalid">
                        {errors.flightDate}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Takeoff Time</Form.Label>
                    <Form.Control 
                        type="time"
                        placeholder="Enter Takeoff Time"
                        aria-describedby="inputGroupPrepend"
                        name="flightStartTime"
                        value={values.flightStartTime}
                        onChange={handleChange}
                        isInvalid={!!errors.flightStartTime}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.flightStartTime}
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Landing Time</Form.Label>
                    <Form.Control 
                        type="time"
                        placeholder="Enter Landing Time"
                        aria-describedby="inputGroupPrepend"
                        name="flightEndTime"
                        value={values.flightEndTime}
                        onChange={handleChange}
                        isInvalid={!!errors.flightEndTime}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.flightEndTime}
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Takeoff Airport</Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="Takeoff Airport"
                        aria-describedby="inputGroupPrepend"
                        name="takeOffAirport"
                        value={values.takeOffAirport}
                        onChange={handleChange}
                        isInvalid={!!errors.takeOffAirport}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.takeOffAirport}
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Intermidiate Airport</Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="Intermidiate Airports"
                        aria-describedby="inputGroupPrepend"
                        name="intermidiateAirport"
                        value={values.intermidiateAirport}
                        onChange={handleChange}
                        isInvalid={!!errors.intermidiateAirport}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.intermidiateAirport}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                        Free text - You can add many airports.
                    </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Landing Airport</Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="Landing Airport"
                        aria-describedby="inputGroupPrepend"
                        name="landAirport"
                        value={values.landAirport}
                        onChange={handleChange}
                        isInvalid={!!errors.landAirport}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.landAirport}
                    </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={1}/>
                <Col xs={12} md={3} lg={3}>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Label>Select Airplane</Form.Label>
                    <Form.Control as="select" aria-label="License Level" className="form-select"
                        placeholder="Airplane Registration"
                        aria-describedby="inputGroupPrepend"
                        name="airplane"
                        value={values.airplane}
                        onChange={handleChange}
                        isInvalid={!!errors.airplane}>
                        <option>Select Airplane</option>
                        {airplaneOpt}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.airplane}
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Start Hobbs</Form.Label>
                    <Form.Control type="text"
                        placeholder="Enter Start Hobbs"
                        aria-describedby="inputGroupPrepend"
                        name="startHobbs"
                        value={values.startHobbs}
                        onChange={handleChange}
                        isInvalid={!!errors.startHobbs}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.startHobbs}
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>End Hobbs</Form.Label>
                    <Form.Control type="text"
                        placeholder="Enter End Hobbs"
                        aria-describedby="inputGroupPrepend"
                        name="endHobbs"
                        value={values.endHobbs}
                        onChange={handleChange}
                        isInvalid={!!errors.endHobbs}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.endHobbs}
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Total Hobbs</Form.Label>
                    <Form.Control type="text"
                        readOnly
                        placeholder="0.0"
                        aria-describedby="inputGroupPrepend"
                        name="totalHobbsTime"
                        value={values.totalHobbsTime}
                        onChange={handleChange}
                        isInvalid={!!errors.totalHobbsTime}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>End Tach</Form.Label>
                    <Form.Control type="text"
                        placeholder="Enter End Tachometer"
                        aria-describedby="inputGroupPrepend"
                        name="endTach"
                        value={values.endTach}
                        onChange={handleChange}
                        isInvalid={!!errors.endTach}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.endTach}
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Fuel Added</Form.Label>
                    <Form.Control type="text"
                        placeholder="Enter Fuel Added"
                        aria-describedby="inputGroupPrepend"
                        name="fuel"
                        value={values.fuel}
                        onChange={handleChange}
                        isInvalid={!!errors.fuel}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.fuel}
                    </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>          
                    <Button className="mt-3" variant="primary" type="submit">
                        Submit
                    </Button>
                    </Form.Group>
                </Col>
                </Row>
                
            </Form>
            )}
        </Formik>
    );
}


function mapStateToProps(state) {
  const { user } = state.auth;
  console.log ('user within mapStateToProps of Airplane Usage',user)
  return {
    user,
  };
}

export default connect(mapStateToProps)(AirplaneUsage);