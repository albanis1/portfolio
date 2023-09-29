// src/components/Router.js
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Route as RouteElement } from 'react-router-dom';

import LandingPage from './containers/LandingPage/LandingPage.container'
import { Navbar } from './components/Navbar/Navbar.component';

function AppRouter() {
  return (
    <Router>
      <div>
        <Navbar/>
        <Routes>
          <RouteElement path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppRouter;
