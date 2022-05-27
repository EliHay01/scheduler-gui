import axios from 'axios';
import authHeader from './auth.header';

//const API_URL = 'https://localhost:44363/api/';
const API_URL = 'http://172.19.237.109:32509/api/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  getPilotsList() {
    let header=authHeader();
    console.log ('auth header = ',header)
    return axios.get(API_URL + 'Pilots/GetPilots', { headers: authHeader() });
  }
  getEventsList() {
    let header=authHeader();
    console.log ('auth header = ',header)
    return axios.get(API_URL + 'Events/GetRecentEventsForPilot', { headers: authHeader() });
  }

  getPilotDetails() {
    let header=authHeader();
    console.log ('auth header = ',header)
    return axios.get(API_URL + 'Pilots/GetPilotDetails', { headers: authHeader() });
  }

  createPilot(payload) {
    let header=authHeader();
    console.log ('auth header = ',header)
    return axios.post(API_URL + 'Pilots/CreatePilot', payload, { headers: authHeader()  });
  }

  updatePilot(payload) {
    let header=authHeader();
    console.log ('auth header = ',header)
    return axios.put(API_URL + 'Pilots/UpdatePilot', payload, { headers: authHeader()  });
  }

  getCompany(companyId) {
    let header=authHeader();
    console.log ('auth header = ',header)
    return axios.post(API_URL + 'Company/GetCompany',{ Id: companyId });
  }

  getCompanyList() {
    let header=authHeader();
    console.log ('auth header = ',header)
    return axios.get(API_URL + 'Company/GetCompanyList');
  }

  getAirplaneUsageLimits(payload) {
    let header=authHeader();
    return axios.post(API_URL + 'AirplaneUsage/GetAirplaneUsageLimits', payload, { headers: header  });
  }

  getAirplaneList() {
    let header=authHeader();
    return axios.get(API_URL + 'Airplane/GetAirplaneListForUser', { headers: header  });
  }

  createUsage(payload) {
    let header=authHeader();
    return axios.post(API_URL + 'AirplaneUsage/CreateUsage', payload, { headers: header  });
  }
}

export default new UserService();