import { useEffect, useState } from 'react';
import userService from '../../services/user.service';
import { Form , Row } from 'react-bootstrap'
import EventBus from "../../common/EventBus";

export default function CompanySelector(props) {

    const [showList, setShowList] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [companyList, setCompanyList] = useState([]);
    const [serverErrors, setServerErrors] = useState([]);
    const [errorsShow, setErrorsShow] = useState(false);

    useEffect(() => {
        const Id =props.match.params.compId ;
        
        console.log ('before calling getCompany with Id')
        console.log ("company id ",Id)

        if (Id != ""){
            userService.getCompany(Id).then(
                response => {
                    console.log ('within register company selector then', response.data)
                    setCompanyName(response.data.companyName);
                },
                error => {
                  console.log ("error = ",error)
                  if (error.response.data.title) {
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
        } else {
            setShowList(true);
            userService.getCompanyList().then(
                response => {
                    console.log ('within register component then', response.data)
                    setCompanyList(response.data);
                },
                error => {
                  console.log ("error = ",error)
                  if (error.response.data.title) {
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
        }
        
    }, [])

    if (showList){
      let dropDownOptions = companyList.map(rec => <option value={rec.Id}>{rec.companyName}</option>);
      return (
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Label>Select Pilot License Type</Form.Label>
              <Form.Control as="select" aria-label="License Level" className="form-select"
                  placeholder="Select license type"
                  aria-describedby="inputGroupPrepend"
                  name="licenseType"
              >
              <option>Select Company</option>
              {dropDownOptions}
              </Form.Control>
          </Form.Group>
      ) 
    } else {

    }
}