import axios from "axios";

export default axios.create({
    baseURL: 'https://localhost:49999/api'
})