import Modal from "react-bootstrap/Modal"
import { Button } from "react-bootstrap";

function ErrorModel (props) {
    return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        variant='alert'
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Error !!!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>{props.errorTitle}</h5>
          {props.errorList}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
}

export default ErrorModel;
  
