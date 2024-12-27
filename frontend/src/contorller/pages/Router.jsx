import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './Login';
import SignUpPage from './SignIn';
// import Dashboard from './appComponents/structure/skeliton';
// import Panel from './appComponents/Panel';
import Dashborad  from './Dashborad';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/SignIn" element={<SignUpPage />} />
 
      <Route path="/Dashborad" element={<Dashborad />} />
    </Routes>
  );
};

export default Router;