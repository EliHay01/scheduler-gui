import { Alert, Button } from "react-bootstrap";
function DismissibleAlert(props) {

    console.log("props within DismissibleAlert :",props)

    if (props.show) {
        return (
        <Alert className = "mt-3" variant="warning" >
            <Alert.Heading> {props.errorHeading} </Alert.Heading>
            <p>         
            {props.errorsBody}
            </p>
            <hr />
            <div className="d-flex justify-content-end">
            <Button onClick={() => props.setShow(false)} variant="outline-warning">
                Close me !
            </Button>
        </div>
        </Alert>
        );
    } else
    {
        return null
    }

}

export default DismissibleAlert


  