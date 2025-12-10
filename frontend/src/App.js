import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import VehicleDetails from "./pages/VehicleDetails";
import Maintenance from "./pages/Maintenance";
import Drivers from "./pages/Drivers";
import Fuel from "./pages/Fuel";
import Parts from "./pages/Parts";
import Tires from "./pages/Tires";
import Inspections from "./pages/Inspections";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import OdometerTracking from "./pages/OdometerTracking";
import DriverDetails from "./pages/DriverDetails";

function AppRouter() {
  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/vehicles/:id" element={<VehicleDetails />} />
      <Route path="/odometer" element={<OdometerTracking />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/drivers" element={<Drivers />} />
      <Route path="/drivers/:id" element={<DriverDetails />} />
      <Route path="/fuel" element={<Fuel />} />
      <Route path="/parts" element={<Parts />} />
      <Route path="/tires" element={<Tires />} />
      <Route path="/inspections" element={<Inspections />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/reports" element={<Reports />} />
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <DataProvider>
          <AppRouter />
        </DataProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
