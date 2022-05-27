import React, { Component } from "react";
import { history } from '../helpers/history';
import { withRouter } from "react-router-dom";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

class AuthVerify extends Component {
  constructor(props) {
    super(props);

    history.listen((location) => {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log('within the AuthVerify and user is:',user,"location:",location)

      if (user) {
        const decodedJwt = parseJwt(user.token);
        console.log (decodedJwt.exp * 1000)

        if (decodedJwt.exp * 1000 < Date.now()) {
            console.log (decodedJwt.exp * 1000)
            props.logOut();
        }
      }
    });
  }

  render() {
    return <div></div>;
  }
}

export default withRouter(AuthVerify);