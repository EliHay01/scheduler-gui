import Button from 'react-bootstrap/esm/Button';
import Label from 'react-bootstrap/esm/FormLabel';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import './Register.css';

const initialValues = {
    firstName:'',
    lastName:'',
    email:'',
    password:''
}

const onSubmit = values => {
}

const validationSchema = Yup.object({
    firstName: Yup.string().required("Required!"),
    lastName: Yup.string().required("Required!"),
    email: Yup.string().required("Required!").email("Email format is wrong"),
    password: Yup.string().required("Required!"),
    confirmPassword:Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
})

const validate = values => {
    let errors = {}

    if (!values.firstName){
        errors.firstName = 'First name is required'
    }
    if (!values.lastName){
        errors.lastName = 'Last name is required'
    }
    if (!values.email){
        errors.email = 'Email address is required'
    } else {
        if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i.test(values.email)){
            errors.email = 'Email address not in correct format'
        }
    }
    if (!values.password){
        errors.password = 'Password is empty'
    } else if (values.password  .length < 6){
        errors.password = 'Password must be 6 characters at lease'
    }
    if (!values.confirmPassword){
        errors.confirmPassword = 'Password confirmation is required'
    } else if (values.password !== values.confirmPassword){
        errors.confirmPassword = 'Password and password confirmation are not identical'
    }
    console.log (errors)
    return errors
}

function RegisterComponent() {
    const formik = useFormik({
        initialValues,
        onSubmit,
        validate,
        //validationSchema
    })

    return (
        <div className="form-signin">
            <form onSubmit = {formik.handleSubmit}>
                <h1 className="h3 mb-3 fw-normal">Please sign up</h1>
                <div className="form-floating">
                    <input name="firstName" type="text" class="form-control" id="floatingInput" placeholder="First Name" onChange={formik.handleChange} value={formik.values.firstName}/>
                    <label for="floatingInput">First Name</label>
                </div>
                <div className="form-floating">
                    <input name="lastName" type="text" class="form-control" id="floatingInput" placeholder="Last Name" onChange={formik.handleChange} value={formik.values.lastName}/>
                    <label for="floatingInput">Last Name</label>
                </div>
                <div className="form-floating">
                    <input name="email" type="email" class="form-control" id="floatingInput" placeholder="name@example.com" onChange={formik.handleChange} value={formik.values.email}/>
                    <label for="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input name="password" type="password" className="form-control" id="floatingPassword" placeholder="Password" onChange={formik.handleChange} value={formik.values.password}/>
                    <label for="floatingPassword">Password</label>
                </div>
                <div className="form-floating">
                    <input name="confirmPassword" type="password" className="form-control" id="floatingPassword" placeholder="Confirm Password" onChange={formik.handleChange} value={formik.values.confirmPassword}/>
                    <label for="floatingPassword">Confirm Password</label>
                </div>

                <button className="w-100 btn btn-lg btn-primary" type="submit">Sign up</button>
            </form>
        </div>
    )
}

export default RegisterComponent