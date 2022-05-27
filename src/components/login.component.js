import { Formik } from 'formik'
import * as Yup from 'yup'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
//import './LoginForm.css'
import { Row } from 'react-bootstrap'
import React from 'react';
import { connect } from "react-redux";
import { login } from "../redux/actions/auth";

const validationSchema = Yup.object().shape({
    username: Yup.string().required("Required!"),
    email: Yup.string().required("Required!").email("Email format is wrong"),
    password: Yup.string().required("Required!")
})

function LoginForm(props) {

  console.log ("Props ", props)

    //const [errorsShow, setErrorsShow] = useState(false);
    //const [serverErrors, setServerErrors] = useState([]);

    const onSubmit = async params => {
      console.log ("Submit")
      //const {username, ...apiParams} = params

      const { dispatch, history } = props;
      console.log('params',params)
      dispatch(login(params.email, params.password))
        .then(() => {
          console.log ('within then of login.component.js')
          console.log ("myprops within login ",props)
          history.push("/home");

         // window.location.reload();
        })
        .catch(() => {
            console.log('error');
        });
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

function mapStateToProps(state) {
  const { isLoggedIn } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    message
  };
}

export default connect(mapStateToProps)(LoginForm);