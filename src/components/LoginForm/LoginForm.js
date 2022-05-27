import { Formik } from 'formik'
import * as Yup from 'yup'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
//import './LoginForm.css'
import { Row } from 'react-bootstrap'
import api from '../../api/posts'
import React,{Component, useEffect, useState} from 'react';
import { config } from 'process'


const validationSchema = Yup.object().shape({
    username: Yup.string().required("Required!"),
    email: Yup.string().required("Required!").email("Email format is wrong"),
    password: Yup.string().required("Required!")
})
export default function LoginForm() {

    const [errorsShow, setErrorsShow] = useState(false);
    const [serverErrors, setServerErrors] = useState([]);

    const onSubmit = async params => {
      console.log ("Submit")
      const {username, ...apiParams} = params

      console.log("ApiParams",apiParams)

      api.post('/AuthManagement/Login', apiParams)
      .then (data=>{
          console.log('data',data)
          var userName = data.data.userFirstName + " " + data.data.userLastName;
          console.log('userName', userName)
          localStorage.setItem('token',data.data.token)
          console.log ('token',localStorage.getItem('token'))
          localStorage.setItem('login',true)
          localStorage.setItem('userDetails',(userName))
          localStorage.setItem('isPilot',data.data.pilotExist) 
      })
      .catch (error => {
        console.log(error)
          if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response)
          const serverErrors= error.response.data.errors;
          
          setServerErrors (serverErrors.map(function (item) {return <p> {item}  </p>}))
      } else {        
          setServerErrors ( <p> {String(error)} </p>)
      }
      setErrorsShow(true);
      
      console.log (error)
      })
    }


  return (
    <Formik
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      initialValues={{        
        username: '',
        email: '',
        password: ''
      }}
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
      }) => (
        <Form noValidate onSubmit={handleSubmit}>

          <h2 className="text-center mt-4 text-primary"> Login</h2>
           
          <Row className="justify-content-md-center">
            <Form.Group as={Col} md="3" controlId="validationFormikUsername">
              <Form.Label>Username</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <Row className="justify-content-md-center">
            <Form.Group as={Col} md="3" controlId="validationFormik03">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />

              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="justify-content-md-center">
            <Form.Group as={Col} md="3" controlId="validationFormik04">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="justify-content-md-center">
            
            <Form.Group className="d-grid mt-4 gap-2" as={Col} md="3" controlId="validationFormik05">
                <Button type="submit">Log in</Button>
            </Form.Group>
          </Row>
        </Form>
      )}
    </Formik>
  );
}

