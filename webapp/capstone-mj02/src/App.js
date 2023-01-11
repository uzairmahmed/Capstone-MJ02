import React, { Component } from 'react';
import { Navbar } from "./components/Navbar";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Main from './pages/Main.js';
import Moneyspentonpowergraph from './pages/Moneyspentonpowergraph';
import Powerusagegraph from './pages/Powerusagegraph';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} /> 
        <Route path="/money_spent_on_power_graph" element={<Moneyspentonpowergraph />} /> 
        <Route path="/power_usage_graph" element={<Powerusagegraph />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
