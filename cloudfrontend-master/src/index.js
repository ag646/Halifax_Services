import React from "react";
import ReactDOM from "react-dom";
import Amplify, { Auth } from "aws-amplify";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_7SlfVVh01",
    userPoolWebClientId: "70im3kk8gtfsefhu479dh8g4n2",
  },
  API: {
    endpoints: [
      {
        name: "EC2_URL",
        endpoint: "http://ec2-3-86-205-247.compute-1.amazonaws.com:3000",
        custom_header: async () => { 
          return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }
        }
      },
    ],
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
