import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  driversAPI, 
  vehiclesAPI, 
  partsAPI, 
  tiresAPI, 
  maintenanceAPI, 
  fuelAPI, 
  alertsAPI, 
  workOrdersAPI 
} from '../services/api';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    vehicles: [],
    drivers: [],
    maintenanceRecords: [],
    fuelLogs: [],
    workOrders: [],
    parts: [],
    tires: [],
    inspections: [],
    alerts: [],
    driverAssignments: [],
    odometerTrips: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize dataSync with initial data
  useEffect(() => {
    dataSync.initializeData(data);
  }, []);

  const refreshData = () => {
    setData({ ...dataSync.getAllData() });
  };

  // Vehicle operations
  const updateVehicleMileage = (vehicleId, newMileage) => {
    const result = dataSync.updateVehicleMileage(vehicleId, newMileage);
    refreshData();
    return result;
  };

  // Trip operations
  const startTrip = (tripData) => {
    const result = dataSync.startTrip(tripData);
    refreshData();
    return result;
  };

  const endTrip = (tripId, endOdometer) => {
    const result = dataSync.endTrip(tripId, endOdometer);
    refreshData();
    return result;
  };

  // Alert operations
  const markAlertAsDone = (alertId) => {
    const result = dataSync.markAlertAsDone(alertId);
    refreshData();
    return result;
  };

  const createAlert = (alertData) => {
    const result = dataSync.createAlert(alertData);
    refreshData();
    return result;
  };

  // Maintenance operations
  const addMaintenanceRecord = (recordData) => {
    const result = dataSync.addMaintenanceRecord(recordData);
    refreshData();
    return result;
  };

  // Fuel operations
  const addFuelLog = (fuelData) => {
    const result = dataSync.addFuelLog(fuelData);
    refreshData();
    return result;
  };

  // Work order operations
  const addWorkOrder = (orderData) => {
    const result = dataSync.addWorkOrder(orderData);
    refreshData();
    return result;
  };

  const updateWorkOrderStatus = (orderId, status, completedDate) => {
    const result = dataSync.updateWorkOrderStatus(orderId, status, completedDate);
    refreshData();
    return result;
  };

  // Driver operations
  const updateDriver = (driverId, updatedData) => {
    const result = dataSync.updateDriver(driverId, updatedData);
    refreshData();
    return result;
  };

  const deleteDriver = (driverId) => {
    const result = dataSync.deleteDriver(driverId);
    refreshData();
    return result;
  };

  const addDriver = (driverData) => {
    const result = dataSync.addDriver(driverData);
    refreshData();
    return result;
  };

  // Part operations
  const updatePart = (partId, updatedData) => {
    const result = dataSync.updatePart(partId, updatedData);
    refreshData();
    return result;
  };

  const deletePart = (partId) => {
    const result = dataSync.deletePart(partId);
    refreshData();
    return result;
  };

  const addPart = (partData) => {
    const result = dataSync.addPart(partData);
    refreshData();
    return result;
  };

  // Tire operations
  const updateTire = (tireId, updatedData) => {
    const result = dataSync.updateTire(tireId, updatedData);
    refreshData();
    return result;
  };

  const deleteTire = (tireId) => {
    const result = dataSync.deleteTire(tireId);
    refreshData();
    return result;
  };

  const addTire = (tireData) => {
    const result = dataSync.addTire(tireData);
    refreshData();
    return result;
  };

  const value = {
    data,
    refreshData,
    updateVehicleMileage,
    startTrip,
    endTrip,
    markAlertAsDone,
    createAlert,
    addMaintenanceRecord,
    addFuelLog,
    addWorkOrder,
    updateWorkOrderStatus,
    getDashboardStats: dataSync.getDashboardStats,
    getActiveTrips: dataSync.getActiveTrips,
    getCompletedTrips: dataSync.getCompletedTrips,
    getActiveAlerts: dataSync.getActiveAlerts,
    getMaintenanceRecords: dataSync.getMaintenanceRecords,
    getFuelLogs: dataSync.getFuelLogs,
    getVehicle: dataSync.getVehicle,
    checkMaintenanceAlerts: (vehicleId) => {
      dataSync.checkMaintenanceAlerts(vehicleId);
      refreshData();
    },
    // Driver CRUD
    updateDriver,
    deleteDriver,
    addDriver,
    // Part CRUD
    updatePart,
    deletePart,
    addPart,
    // Tire CRUD
    updateTire,
    deleteTire,
    addTire
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
