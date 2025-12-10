import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { mockVehicles, mockDrivers } from '../mock/mockData';
import { Plus, Search, Navigation, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { format } from 'date-fns';

const OdometerTracking = () => {
  const [isStartTripOpen, setIsStartTripOpen] = useState(false);
  const [isEndTripOpen, setIsEndTripOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock active trips
  const [activeTrips] = useState([
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
  ]);

  // Mock completed trips
  const [completedTrips] = useState([
    {
      trip_id: 'trip_003',
      vehicle_id: 'veh_001',
      driver_id: 'drv_001',
      start_odometer: 44800,
      end_odometer: 45000,
      distance: 200,
      start_time: new Date(Date.now() - 24*60*60*1000),
      end_time: new Date(Date.now() - 20*60*60*1000),
      status: 'Completed'
    }
  ]);

  // Service intervals configuration
  const serviceIntervals = {
    'Car': {
      oil_change: 5000,
      brake_check: 10000,
      air_filter: 15000,
      major_service: 30000
    },
    'Van': {
      oil_change: 5000,
      brake_check: 10000,
      air_filter: 12000,
      major_service: 40000
    },
    'Bus': {
      oil_change: 5000,
      brake_check: 10000,
      air_filter: 12000,
      major_service: 40000
    },
    'Truck': {
      oil_change: 5000,
      brake_check: 10000,
      air_filter: 12000,
      major_service: 40000
    }
  };

  // Calculate maintenance alerts
  const getMaintenanceAlerts = (vehicle) => {
    const intervals = serviceIntervals[vehicle.type] || serviceIntervals['Car'];
    const alerts = [];
    
    // Get last service mileage (mock data)
    const lastOilChange = vehicle.mileage - 4500;
    const lastBrakeCheck = vehicle.mileage - 9500;
    const lastAirFilter = vehicle.mileage - 14000;
    const lastMajorService = vehicle.mileage - 28000;

    if (vehicle.mileage - lastOilChange >= intervals.oil_change) {
      alerts.push({ type: 'Oil Change', priority: 'High', kmUntilDue: 0 });
    } else if (intervals.oil_change - (vehicle.mileage - lastOilChange) <= 500) {
      alerts.push({ type: 'Oil Change', priority: 'Medium', kmUntilDue: intervals.oil_change - (vehicle.mileage - lastOilChange) });
    }

    if (vehicle.mileage - lastBrakeCheck >= intervals.brake_check) {
      alerts.push({ type: 'Brake Check', priority: 'High', kmUntilDue: 0 });
    } else if (intervals.brake_check - (vehicle.mileage - lastBrakeCheck) <= 1000) {
      alerts.push({ type: 'Brake Check', priority: 'Medium', kmUntilDue: intervals.brake_check - (vehicle.mileage - lastBrakeCheck) });
    }

    if (vehicle.mileage - lastAirFilter >= intervals.air_filter) {
      alerts.push({ type: 'Air Filter / Tune Up', priority: 'High', kmUntilDue: 0 });
    } else if (intervals.air_filter - (vehicle.mileage - lastAirFilter) <= 1000) {
      alerts.push({ type: 'Air Filter / Tune Up', priority: 'Medium', kmUntilDue: intervals.air_filter - (vehicle.mileage - lastAirFilter) });
    }

    if (vehicle.mileage - lastMajorService >= intervals.major_service) {
      alerts.push({ type: 'Major Service', priority: 'Critical', kmUntilDue: 0 });
    } else if (intervals.major_service - (vehicle.mileage - lastMajorService) <= 2000) {
      alerts.push({ type: 'Major Service', priority: 'Medium', kmUntilDue: intervals.major_service - (vehicle.mileage - lastMajorService) });
    }

    return alerts;
  };

  const getVehicleInfo = (vehicleId) => {
    return mockVehicles.find(v => v.vehicle_id === vehicleId);
  };

  const getDriverInfo = (driverId) => {
    return mockDrivers.find(d => d.driver_id === driverId);
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Odometer Tracking</h1>
              <p className="text-gray-400 mt-1">Track vehicle mileage and automatic maintenance scheduling</p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <Dialog open={isStartTripOpen} onOpenChange={setIsStartTripOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Start Trip
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-gray-900 text-white border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Start New Trip</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="vehicle" className="text-gray-300">Vehicle *</Label>
                      <Select>
                        <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {mockVehicles.map(v => (
                            <SelectItem key={v.vehicle_id} value={v.vehicle_id}>{v.plate} - {v.brand} {v.model}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="driver" className="text-gray-300">Driver *</Label>
                      <Select>
                        <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {mockDrivers.map(d => (
                            <SelectItem key={d.driver_id} value={d.driver_id}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="startOdometer" className="text-gray-300">Starting Odometer (km) *</Label>
                      <Input id="startOdometer" type="number" placeholder="45000" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="purpose" className="text-gray-300">Trip Purpose</Label>
                      <Input id="purpose" placeholder="e.g., Delivery, Pickup, etc." className="mt-1 bg-gray-800 border-gray-700 text-white" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsStartTripOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsStartTripOpen(false)}>Start Trip</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Active Trips */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Active Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeTrips.map((trip) => {
                  const vehicle = getVehicleInfo(trip.vehicle_id);
                  const driver = getDriverInfo(trip.driver_id);
                  const duration = Math.floor((new Date() - trip.start_time) / (1000 * 60));
                  
                  return (
                    <div key={trip.trip_id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {vehicle?.photos && vehicle.photos.length > 0 && (
                            <img 
                              src={vehicle.photos[0]} 
                              alt={vehicle.plate}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-white">{vehicle?.plate}</h3>
                              <Badge className="bg-green-500/20 text-green-400">
                                <Navigation className="w-3 h-3 mr-1" />
                                In Progress
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400">{vehicle?.brand} {vehicle?.model}</p>
                            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                              <div>
                                <p className="text-gray-400">Driver</p>
                                <p className="text-white font-medium">{driver?.name}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Start Odometer</p>
                                <p className="text-white font-medium">{trip.start_odometer.toLocaleString()} km</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Started</p>
                                <p className="text-white font-medium">{format(trip.start_time, 'HH:mm')}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Duration</p>
                                <p className="text-white font-medium">{duration} mins</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => setIsEndTripOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          End Trip
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {activeTrips.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Navigation className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                    <p>No active trips</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Alerts */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Maintenance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVehicles.map((vehicle) => {
                  const alerts = getMaintenanceAlerts(vehicle);
                  if (alerts.length === 0) return null;
                  
                  return (
                    <div key={vehicle.vehicle_id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-4">
                        {vehicle.photos && vehicle.photos.length > 0 && (
                          <img 
                            src={vehicle.photos[0]} 
                            alt={vehicle.plate}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2">{vehicle.plate}</h3>
                          <p className="text-sm text-gray-400 mb-3">Current: {vehicle.mileage.toLocaleString()} km</p>
                          <div className="flex flex-wrap gap-2">
                            {alerts.map((alert, idx) => (
                              <Badge 
                                key={idx}
                                className={
                                  alert.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                  alert.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }
                              >
                                {alert.type} {alert.kmUntilDue === 0 ? '- OVERDUE' : `in ${alert.kmUntilDue} km`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Trips */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Completed Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedTrips.map((trip) => {
                  const vehicle = getVehicleInfo(trip.vehicle_id);
                  const driver = getDriverInfo(trip.driver_id);
                  
                  return (
                    <div key={trip.trip_id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-4">
                        {vehicle?.photos && vehicle.photos.length > 0 && (
                          <img 
                            src={vehicle.photos[0]} 
                            alt={vehicle.plate}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-white">{vehicle?.plate}</h3>
                            <Badge className="bg-blue-500/20 text-blue-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{driver?.name}</p>
                          <div className="grid grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-gray-400">Start</p>
                              <p className="text-white font-medium">{trip.start_odometer.toLocaleString()} km</p>
                            </div>
                            <div>
                              <p className="text-gray-400">End</p>
                              <p className="text-white font-medium">{trip.end_odometer.toLocaleString()} km</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Distance</p>
                              <p className="text-white font-medium">{trip.distance} km</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Date</p>
                              <p className="text-white font-medium">{format(trip.start_time, 'MMM dd')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* End Trip Dialog */}
          <Dialog open={isEndTripOpen} onOpenChange={setIsEndTripOpen}>
            <DialogContent className="max-w-md bg-gray-900 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">End Trip</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="endOdometer" className="text-gray-300">Ending Odometer (km) *</Label>
                  <Input id="endOdometer" type="number" placeholder="45200" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400">Distance Traveled</p>
                  <p className="text-2xl font-bold text-white">200 km</p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEndTripOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsEndTripOpen(false)}>Complete Trip</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default OdometerTracking;
