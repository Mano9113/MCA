import React, { useState } from "react";
import Axios from "axios";
import { setCookie } from "./utils/cookies";
import config from './config.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";


const UrlLoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  const navigate = useNavigate();


    const handleLogin = async () => {
        try {
            const response = await Axios.post(
                "http://localhost:3001/checkUser",
                { username, password }
            ).then((response) => {
                console.log(response);
                setCookie("token", response.data.token);
                const queryParams = new URLSearchParams(window.location.search);
                const redirectUrl = `/Dashboard?${queryParams.toString()}`;
                window.location.href = redirectUrl;
                navigate("/Dashboard");
              })
              .catch((error) => {
                console.log(error);
                if(error.response.data.message === "Credentials Are Wrong"){
                  toast.error("Credentials Are Wrong");
                }
              });

        } catch (err) {
            setError("Invalid username or password.");
        }
    };

    return (
        <div className="container mainPages">
          <div className="row">
            <div className="col-lg-12 SignIn">
            <h5>You must log in to access this page.</h5>

              <div className="SignInBg">
              <ToastContainer />
                <h3>Log In</h3>
                <input
                  className="form-control mt-4"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  className="form-control mt-3"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Link to="/SignIn">
                  <button className="btn btn-e mt-3 me-3 btn-danger">Sign In</button>
                </Link>
                  <button className="btn btn-e mt-3 me-3 btn-primary" onClick={handleLogin}>Log In</button>
              </div>
            </div>
          </div>
        </div>
      );
};

export default UrlLoginPage;
