import axios from "axios";

const instance = axios.create({
  // THE API (cloud function) URL
  baseURL: 'https://us-central-clone-252cc.cloudfunctions.net.api/'
  
  //'http://localhost:5001/clone-252cc/us-central/api'
    
});

export default instance;