import React, { useState } from 'react'
import "../../App.css"
import Axios  from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import config from './config.json';

const SignUpPage = () => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState(''); 
  
  let navigate = useNavigate();

  const createUserSign = async () => {
  
    if (email.trim() === "" || password.trim() === "") {
    }else{
     const newSignInuser = {
      email: email,
      password: password,
    };

    Axios.post(`${config.backendUrl}/createSign`, newSignInuser) 
      .then((response) => {
        console.log(response.data);
        setemail("");
        setPassword("");
        navigate('/');
        toast.success("Sign Up Successfully Done, You Can Login Now!");
      })
      .catch((error) => {
        console.log(error); 
        toast.error("User Already Exists!");
      });
    }
  };

  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12 SignIn'>
            <div className='SignInBg'>
              <ToastContainer />
              <h3>Sign In</h3>
              <input
                className='form-control mt-4'
                type='text'
                placeholder='Username'
                value={email} 
                onChange={(e) => {
                  setemail(e.target.value);
                }}
                required
              />
              <input
                className='form-control mt-3'
                type='Password'
                placeholder='Password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
              <Link to="/">
              <button className='btn btn-primary mt-3 me-3'>Back</button>
              </Link> 
                <button className='btn btn-primary mt-3' onClick={createUserSign}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
