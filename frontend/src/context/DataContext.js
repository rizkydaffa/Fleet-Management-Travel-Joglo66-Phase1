import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  mockVehicles, 
  mockDrivers, 
  mockMaintenanceRecords, 
  mockFuelLogs, 
  mockWorkOrders,
  mockPartsInventory,
  mockTires,
  mockInspections,
  mockAlerts,
  mockDriverAssignments
} from '../mock/mockData';
import dataSync from '../utils/dataSync';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    vehicles: mockVehicles,
    drivers: mockDrivers,
    maintenanceRecords: mockMaintenanceRecords,
    fuelLogs: mockFuelLogs,
    workOrders: mockWorkOrders,
    parts: mockPartsInventory,
    tires: mockTires,
    inspections: mockInspections,
    alerts: mockAlerts,
    driverAssignments: mockDriverAssignments,
    odometerTrips: [
      {
        trip_id: 'trip_001',
        vehicle_id: 'veh_001',
        driver_id: 'drv_001',
        start_odometer: 45000,
        start_time: new Date(),
        status: 'In Progress'
      },
      {
        trip_id: 'trip_002',
        vehicle_id: 'veh_002',
        driver_id: 'drv_002',
        start_odometer: 68000,
        start_time: new Date(Date.now() - 2*60*60*1000),
        status: 'In Progress'
      }
    ]
  });

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
    }
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
