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

  // Fetch all data from backend
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        driversRes,
        vehiclesRes,
        partsRes,
        tiresRes,
        maintenanceRes,
        fuelRes,
        alertsRes,
        workOrdersRes
      ] = await Promise.all([
        driversAPI.getAll().catch(() => ({ data: [] })),
        vehiclesAPI.getAll().catch(() => ({ data: [] })),
        partsAPI.getAll().catch(() => ({ data: [] })),
        tiresAPI.getAll().catch(() => ({ data: [] })),
        maintenanceAPI.getAll().catch(() => ({ data: [] })),
        fuelAPI.getAll().catch(() => ({ data: [] })),
        alertsAPI.getAll().catch(() => ({ data: [] })),
        workOrdersAPI.getAll().catch(() => ({ data: [] }))
      ]);

      setData({
        drivers: driversRes.data || [],
        vehicles: vehiclesRes.data || [],
        parts: partsRes.data || [],
        tires: tiresRes.data || [],
        maintenanceRecords: maintenanceRes.data || [],
        fuelLogs: fuelRes.data || [],
        alerts: alertsRes.data || [],
        workOrders: workOrdersRes.data || [],
        inspections: [],
        driverAssignments: [],
        odometerTrips: []
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refreshData = () => {
    fetchAllData();
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
  const updateDriver = async (driverId, updatedData) => {
    try {
      const result = await driversAPI.update(driverId, updatedData);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error updating driver:', err);
      throw err;
    }
  };

  const deleteDriver = async (driverId) => {
    try {
      const result = await driversAPI.delete(driverId);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error deleting driver:', err);
      throw err;
    }
  };

  const addDriver = async (driverData) => {
    try {
      const result = await driversAPI.create(driverData);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error adding driver:', err);
      throw err;
    }
  };

  // Part operations
  const updatePart = async (partId, updatedData) => {
    try {
      const result = await partsAPI.update(partId, updatedData);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error updating part:', err);
      throw err;
    }
  };

  const deletePart = async (partId) => {
    try {
      const result = await partsAPI.delete(partId);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error deleting part:', err);
      throw err;
    }
  };

  const addPart = async (partData) => {
    try {
      const result = await partsAPI.create(partData);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error adding part:', err);
      throw err;
    }
  };

  // Tire operations
  const updateTire = async (tireId, updatedData) => {
    try {
      const result = await tiresAPI.update(tireId, updatedData);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error updating tire:', err);
      throw err;
    }
  };

  const deleteTire = async (tireId) => {
    try {
      const result = await tiresAPI.delete(tireId);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error deleting tire:', err);
      throw err;
    }
  };

  const addTire = async (tireData) => {
    try {
      const result = await tiresAPI.create(tireData);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error adding tire:', err);
      throw err;
    }
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
