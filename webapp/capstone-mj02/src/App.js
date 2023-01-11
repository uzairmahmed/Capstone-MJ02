import React, { Component } from 'react';
import { Navbar } from "./components/Navbar";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Main from './pages/Main.js';
import Moneyspentonpowergraph from './pages/Moneyspentonpowergraph';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} /> 
        <Route path="/moneyspentonpowergraph" element={<Moneyspentonpowergraph />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
