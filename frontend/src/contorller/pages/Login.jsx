import React from 'react';
import '../../App.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Axios  from 'axios';
import config from './config.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setCookie, getCookie } from "../pages/utils/cookies";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  function verifyUser(){
    // navigate('/Dashborad');
    if(username.trim() === "" || password.trim() === ""){
      toast.info("Please fill the fields");
    }else{
      const user = {
        username: username,
        password: password,
      };

      Axios.post(`${config.backendUrl}/checkUser`, user)
        .then((response) => {
          console.log(response);
          setCookie("token", response.data.token);
          setUsername('');
          setPassword('');
          toast.success("Login Successful");
          navigate("/Dashborad");
        })
        .catch((error) => {
          console.log(error);
          if(error.response.data.message === "Credentials Are Wrong"){
            toast.error("Credentials Are Wrong");
          }
        });
    }
  }

  return (
    <div className="container mainPages">
      <div className="row">
        <div className="col-lg-12 SignIn">
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
              <button className="btn btn-e mt-3 me-3 btn-primary" onClick={verifyUser}>Log In</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
