import axios from "axios";
const API = axios.create({
baseURL: "http://localhost:3001/",
withCredentials: true, // Enable HttpOnly cookie usage
});
 

 
export default API;