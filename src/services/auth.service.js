import axios from "axios";

//const API_URL = "https://localhost:44363/api/AuthManagement/";
const API_URL = "http://172.19.237.109:32509/api/AuthManagement/";

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "Login", { email, password })
      .then(
        response => 
        {
          if (response.data.token) 
          {
            localStorage.setItem("user", JSON.stringify(response.data));
          }
          return response.data;
        },
        error => 
        {
          console.log ("within the auth.service:", error)
        });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password, firstName, lastName) {
    console.log("URL:",API_URL)
    return (axios.post(API_URL + "Register", {
      username,
      email,
      password,
      firstName,
      lastName
    })
    .then(
      response => 
      {
        if (response.data.token) 
        {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      })
    //.catch(
//      error => 
        //{
//          console.log ("within the auth.service:",error)
  //        if (error.response) {
    //        console.log(error.response.data);
      //      console.log(error.response.status);
        //    console.log(error.response.headers);
//          }
  //        return error;
    //    })
    )
  }
}

export default new AuthService();