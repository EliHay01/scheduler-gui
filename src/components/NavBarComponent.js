import React, {useState, useEffect} from 'react';

import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import {Link} from 'react-router-dom'
import NavDropdown from 'react-bootstrap/NavDropdown'

import { connect } from "react-redux";


function NavBarComponent(props) {
    
    const [loggedInName, setLoggedInName] = useState(null);
    const [loginState, setLoginState] = useState(false);

    const [userState, setUserState] = useState ({
        showModeratorBoard: false,
        showAdminBoard: false,
        currentUser: undefined,
      });

    const myLogout = () => {
        console.log ('logout attempy')
        props.logOut();
    };

    const user = props.user;
      
    useEffect (()=>{
        
        console.log ('within nav.js useEffect user:',user)
    
        if (user) {
            setUserState({
            currentUser: user,
            showModeratorBoard:'',
            showAdminBoard: '',
            });
 
            setLoginState(true);
            setLoggedInName(user.userFirstName + " " + user.userLastName);
        } else {
            setLoginState(false)
        }
    },[user]);


    let navLogin
    if (loginState){
        navLogin =  <Nav>
                        <Navbar.Text bsPrefix="nav-link"> Signed in as: <a href="/login" >{loggedInName}</a> </Navbar.Text>
                        <Nav.Link href="/login" onClick={myLogout}>Logout</Nav.Link>
                    </Nav>;
    }
    else {
        navLogin =  <Nav>
                        <Nav.Link href="/login">Login</Nav.Link>
                        <Nav.Link href="/register">Register</Nav.Link>
                    </Nav>
    }
    let mainMenu

    if  (loginState){
        mainMenu=   
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={"/pilots"}>Pilots</Nav.Link>
                        <Nav.Link as={Link} to={"/scheduler"}>Scheduler</Nav.Link>
                        <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="/home">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
    }
    else {
        mainMenu = null;
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">Airplane-Scheduler</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        {mainMenu}
                    </Nav>
                    {navLogin}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

function mapStateToProps(state) {
    const { user } = state.auth;
    console.log ('within nav.js mapStateToProps user:',user)
    return {
      user,
    };
  }
  
export default connect(mapStateToProps)(NavBarComponent);