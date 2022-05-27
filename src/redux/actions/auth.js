import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
  } from "./types";
  
  import AuthService from "../../services/auth.service";
  
  export const register = (username, email, password, firstName, lastName) => (dispatch) => {
    return AuthService.register(username, email, password, firstName, lastName).then(
      (response) => {
        console.log ("within register of auth.js response:", response)
        dispatch({
          type: REGISTER_SUCCESS,
        });

        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: response },
        })
  
        //dispatch({
//          type: SET_MESSAGE,
          //payload: response.data.message,
       // })
       ;
  
        return Promise.resolve();
      }).catch (
      (error) => {
        console.log ("error within redux is: ",error)
        if (error.response) {
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
        }
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.errors[0]) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: REGISTER_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject(error);
      });
  };
  
  export const login = (email, password) => (dispatch) => {
    return AuthService.login(email, password).then(
      (data) => {
        console.log('within action auth.js login')
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: data },
        });
  
        return Promise.resolve();
      },
      (error) => {
        console.log('login error',error)
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: LOGIN_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
  };
  
  export const logout = () => (dispatch) => {
    AuthService.logout();
  
    dispatch({
      type: LOGOUT,
    });
  };