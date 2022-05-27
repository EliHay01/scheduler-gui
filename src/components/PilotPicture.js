import { useEffect, useState } from 'react';
import {Image} from 'react-bootstrap'

export default function PilotPicture(props) {
    useEffect(() => {
        console.log ("props",props)

    },[props])
    
    const [error, setError] = useState(null);

    return (
        <div>
             <Image src={props.imageFile} rounded fluid thumbnail className="mt-5" />
        </div>
    )
}