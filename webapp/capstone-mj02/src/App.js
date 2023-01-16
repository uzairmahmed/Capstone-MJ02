import React, { Component } from 'react';
import { Navbar } from "./components/Navbar";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Moneyspentonpowergraph from './pages/Money_spent_on_power_graph';
import Powerusagegraph from './pages/Power_usage_graph';
import Header from './header/Header';
import { HomeIcon } from '@heroicons/react/24/outline';
import Homeiotdevicestats from './pages/Home_iot_device_statistics';
import Networkstatisticspage from './pages/Network_statistics_page';
import Deviceonduration from './pages/Device_on_duration';

function App() {
  return (
    <BrowserRouter>
      <Header>
        <Routes>
          <Route path="/" element={<Homeiotdevicestats />} /> 
          <Route path="/money_spent_on_power_graph" element={<Moneyspentonpowergraph />} /> 
          <Route path="/power_usage_graph" element={<Powerusagegraph />} /> 
          <Route path="/network_statistics" element={<Networkstatisticspage />} /> 
          <Route path="/device_on_duration_graph" element={<Deviceonduration />} /> 
        </Routes>
      </Header>
    </BrowserRouter>
  );
}

export default App;
