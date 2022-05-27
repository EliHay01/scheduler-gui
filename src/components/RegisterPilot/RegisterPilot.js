import { Formik } from 'formik'
import * as Yup from 'yup'
import { Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { Row, Col } from 'react-bootstrap'
import React,{ useState, useEffect } from 'react';
import { connect } from "react-redux";

import UserService from '../../services/user.service';
import EventBus from "../../common/EventBus";

const regex = /^0(5[^7]|[2-4]|[8-9]|7[0-9])[0-9]{7}$/;

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required!"),
  emailAddress: Yup.string().required("Required!").email("Email format is wrong"),
  phoneNumber: Yup.string().matches(regex,'It doesn\'t look like a phone number').required("Required!"),
  licenseType: Yup.string().required("Required!"),
  medicalClass: Yup.string().required("Required!"),
  medicalExpirationDate: Yup.string().required("Required!")
})


function RegisterPilot(props) {

  const defaultImageSource='/Images/Avatar.png'
  
  const fileInitialValues = {
    imageFile: '',
    fileName: ''
  }
  const [fileValues, setFileValues] = useState (fileInitialValues);
  //const [pilotExist, setPilotExist] = useState(props.user.pilotExist);
  const initPilotDetails = { name: '', emailAddress: '', phoneNumber: '', licenseType: '', medicalClass:'', medicalExpirationDate: '' }
  const [pilotDetails, setPilotDetails] = useState(initPilotDetails);

  const [error, setError] = useState(null);
  
  const [imageSrc, setImageSrc] = useState(defaultImageSource);
  const [loaded, setIsLoaded] = useState(false);  

  useEffect(() => {
    console.log (props)

    if (props.user && props.user.pilotExist){
      UserService.getPilotDetails().then(
        response => {
            
            var pilotData = response.data;
            var medExpDate = new Date(response.data.medicalExpirationDate);
            pilotData = {
              ...pilotData,
              medicalExpirationDate: ((medExpDate.getFullYear()) + '-' +  
              ((medExpDate.getMonth() > 8) ? (medExpDate.getMonth() + 1) : ('0' + (medExpDate.getMonth() + 1))) + '-' + 
              ((medExpDate.getDate() > 9) ? medExpDate.getDate() : ('0' + medExpDate.getDate())))
            }
            
            setPilotDetails (pilotData);
            
            setFileValues({ fileName: pilotData.fileName,
                            imageFile: ''});
            
            setImageSrc (pilotData.profileImagePath);

            setIsLoaded(true);
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
}, [ ])
  
  const showPreview = e =>{
    if (e.target.files && e.target.files[0]){
      let imageFile = e.target.files[0];

      setFileValues({fileName: imageFile.name,
        imageFile: imageFile});
      const reader = new FileReader();
      reader.onload = x => {
        setImageSrc(x.target.result)
      }
      reader.readAsDataURL(imageFile)
    }
  }

  const onSubmit = async params => {
    
    params = {
      ...params,
      imageFile: fileValues.imageFile,
      fileName: fileValues.fileName
    }

    const formData = new FormData()
            formData.append('name', params.name)
            formData.append('emailAddress', params.emailAddress)
            formData.append('phoneNumber', params.phoneNumber)
            formData.append('licenseType', params.licenseType)
            formData.append('medicalClass', params.medicalClass)
            formData.append('medicalExpirationDate', params.medicalExpirationDate)
            formData.append('imageFile', params.imageFile)
            formData.append('fileName', params.fileName)
    
    if (props.user && props.user.pilotExist){
      UserService.updatePilot(formData).then(
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
      validationSchema={validationSchema}
      onSubmit={onSubmit}     
      initialValues={{        
        name: pilotDetails.name,
        emailAddress: pilotDetails.emailAddress,
        phoneNumber: pilotDetails.phoneNumber,
        licenseType: pilotDetails.licenseType,
        medicalClass: pilotDetails.medicalClass,
        medicalExpirationDate: pilotDetails.medicalExpirationDate,
        imageSrc: imageSrc
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
        errors,
        myfileValues = fileValues,
        myShowPreview = showPreview
      }) => (
          <Form  noValidate onSubmit={handleSubmit}>
            <Row xs={12} md={6} lg={6} className="justify-content-md-center">
              <h2> Pilot Details </h2>
            </Row>
            <Row className="justify-content-md-center">
              <Col xs={12} md={4} lg={3}>
                <img src={values.imageSrc} className="mt-4 mb-3 card-img-top"/>
                <Form.Group className="mb-3" controlId="formBasicFileUpload">
                    <Form.Label>Pilot Image</Form.Label>
                    <Form.Control
                      className="form-control"
                      type="file"
                      placeholder="Select Image"
                      aria-describedby="inputGroupPrepend"
                      name="imageFile"
                      accept="image/*"
                      value={values.fileName}
                      onChange={myShowPreview}
                      isInvalid={!!errors.fileName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Pilot Name</Form.Label>
                  <Form.Control 
                    type="text"
                    placeholder="Enter Pilot Name"
                    aria-describedby="inputGroupPrepend"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={1}/>
              <Col xs={12} md={4} lg={4}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Pilot Email Address</Form.Label>
                  <Form.Control 
                    type="text"
                    placeholder="Enter Email Address"
                    aria-describedby="inputGroupPrepend"
                    name="emailAddress"
                    value={values.emailAddress}
                    onChange={handleChange}
                    isInvalid={!!errors.emailAddress}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.emailAddress}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    We'll use it only to send reminders.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="text"
                    placeholder="Enter Phone Number"
                    aria-describedby="inputGroupPrepend"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    isInvalid={!!errors.phoneNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNumber}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Label>Select Pilot License Type</Form.Label>
                  <Form.Control as="select" aria-label="License Level" className="form-select"
                      placeholder="Select license type"
                      aria-describedby="inputGroupPrepend"
                      name="licenseType"
                      value={values.licenseType}
                      onChange={handleChange}
                      isInvalid={!!errors.licenseType}>
                    <option>Select license type</option>
                    <option value="PPL">Private Pilot</option>
                    <option value="CPL">Commertial Pilot</option>
                    <option value="ATPL">Airline Pilot</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Label>Select Medicate Certificate Class</Form.Label>
                <Form.Control as="select" aria-label="Medical Class" className="form-select"
                      placeholder="Select Medical Class"
                      aria-describedby="inputGroupPrepend"
                      name="medicalClass"
                      value={values.medicalClass}
                      onChange={handleChange}
                      isInvalid={!!errors.medicalClass}>
                  <option>Select Medical Class</option>
                  <option value="1">Class I</option>
                  <option value="2">Class II</option>
                </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Enter Medical Class Expiration Date
                  </Form.Label>
                  <Form.Control type="date" placeholder="Select Medical Class"
                      aria-describedby="inputGroupPrepend"
                      name="medicalExpirationDate"
                      value={values.medicalExpirationDate}
                      onChange={handleChange}
                      isInvalid={!!errors.medicalExpirationDate}>
                  </Form.Control>
                </Form.Group>

                <Form.Group>          
                  <Button className="mt-3" variant="primary" type="submit">
                    Save Pilot Data
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
  console.log ('user within mapStateToProps of register pilot',user)
  return {
    user,
  };
}

export default connect(mapStateToProps)(RegisterPilot);
