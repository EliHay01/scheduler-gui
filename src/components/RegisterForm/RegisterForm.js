//import './RegisterForm.css';
import { Formik } from 'formik'
import * as Yup from 'yup'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import './RegisterForm.css'
import { Row, Col } from 'react-bootstrap'
import api from '../../api/posts'
import React,{ useState, useEffect } from 'react';
import DismisableAlert from './DismisableAlert'
import userService from '../../services/user.service';
import EventBus from "../../common/EventBus";
import { connect } from "react-redux";
import { register } from '../../redux/actions/auth'

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Required!"),
    lastName: Yup.string().required("Required!"),
    username: Yup.string().required("Required!"),
    email: Yup.string().required("Required!").email("Email format is wrong"),
    password: Yup.string().required("Required!"),
    confirmPassword:Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
})

function RegisterForm(props) {

  const [companyName, setCompanyName] = useState("");
  const [errorsShow, setErrorsShow] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  console.log("props. message = :", props.message)
  console.log("server errors: ", serverErrors )

  if (props.message !== undefined &&  props.message !== serverErrors){
    setServerErrors (String(props.message))
  }

  if (props.message !== undefined && serverErrors.length === 0){
    setServerErrors (String(props.message))
  }

  useEffect(() => {
    let Id = props.match.params.compId ;

    userService.getCompany(Id).then(
        response => {
            setCompanyName(response.data.companyName);
        },
        error => {
          console.log ("error = ",error)
          if (error.response && error.response.data && error.response.data.title) {
            const serverError = error.response.data.title;
            console.log ("error titles ", serverErrors)
            setServerErrors ( String(serverError))
          } else {
            setServerErrors ( <p> {String(error)} </p>)
          }
          setErrorsShow(true);
          if (error.response && error.response.status === 401) {
            EventBus.dispatch("logout");
          }
        }
      );
  }, [serverErrors])

  const onSubmit = async params => {
      const { dispatch, history, message } = props;
      console.log ("params ", params)
      const {confirmPassword,companyName, ...apiParams} = params
      dispatch(register(params.username, params.email, params.password, params.firstName, params.lastName))
        .then(() => {
          history.push("/home");

         // window.location.reload();
        })
        .catch(() => {
            setErrorsShow(true);
        });

      
    }
    
  return (
    <Formik
      validationSchema={validationSchema}
      onSubmit={onSubmit} 
      initialValues={{
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyId: props.match.params.compId
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
          <Row sm={12} md={8} lg={4} className="mt-3 justify-content-xl-center justify-content-sm-center">
              <h3> Sign up airplane suite </h3>
          </Row>
          <Row xs={12} md={2} lg={3} className="justify-content-md-center">
            <Col>
              <DismisableAlert
                show={errorsShow}
                setShow={setErrorsShow}
                errorHeading = "User registration failed"
                errorsBody = {serverErrors}
              />
              <Form.Group className="mb-2" controlId="validationFormik01">
                <Form.Label >First name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  isValid={touched.firstName && !errors.firstName}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-2" controlId="validationFormik02">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  isValid={touched.lastName && !errors.lastName}
                  isInvalid={!!errors.lastName}
                />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2" controlId="validationFormikUsername">
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
                    isValid={touched.username && !errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-2" controlId="validationFormik03">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="example@gmail.com"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  isValid={touched.email && !errors.email}
                />

                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2" controlId="validationFormik04">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  isValid={touched.password && !errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group  className="mb-2" controlId="validationFormik05">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                  isValid={touched.confirmPassword && !errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group  className="mb-2" controlId="validationFormik06">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={companyName}
                  name="companyName"
                  value={values.companyName}
                  disabled
                />
                <Form.Control.Feedback type="invalid">
                  {errors.companyName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-3 d-grid gap-10 "  controlId="validationFormik05">
                  <Button type="submit">Create an Account</Button>
              </Form.Group>


            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}


function mapStateToProps(state) {
  const { isLoggedIn } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    message
  };
}

export default connect(mapStateToProps)(RegisterForm);