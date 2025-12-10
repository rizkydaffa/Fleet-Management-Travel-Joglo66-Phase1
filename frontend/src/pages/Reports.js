import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { mockVehicles, mockMaintenanceRecords, mockFuelLogs, mockWorkOrders } from '../mock/mockData';
import { BarChart3, Download, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';

const Reports = () => {
  const [selectedMonth, setSelectedMonth] = useState('current');
  
  // Calculate vehicle downtime (days in maintenance status)
  const vehicleDowntime = mockVehicles.map(vehicle => {
    const maintenanceRecords = mockMaintenanceRecords.filter(m => m.vehicle_id === vehicle.vehicle_id);
    const downtimeDays = vehicle.status === 'Maintenance' ? Math.floor(Math.random() * 30) + 5 : Math.floor(Math.random() * 10);
    return {
      ...vehicle,
      downtimeDays,
      maintenanceCount: maintenanceRecords.length
    };
  }).sort((a, b) => b.downtimeDays - a.downtimeDays);
  
  // Calculate vehicle reliability (lower maintenance = more reliable)
  const vehicleReliability = mockVehicles.map(vehicle => {
    const maintenanceRecords = mockMaintenanceRecords.filter(m => m.vehicle_id === vehicle.vehicle_id);
    const totalCost = maintenanceRecords.reduce((sum, r) => sum + r.cost, 0);
    const reliabilityScore = 100 - (maintenanceRecords.length * 5) - (totalCost / 1000000);
    return {
      ...vehicle,
      reliabilityScore: Math.max(reliabilityScore, 0),
      maintenanceCount: maintenanceRecords.length,
      totalMaintenanceCost: totalCost
    };
  }).sort((a, b) => b.reliabilityScore - a.reliabilityScore);
  
  // Calculate fuel efficiency
  const vehicleFuelEfficiency = mockVehicles.map(vehicle => {
    const fuelLogs = mockFuelLogs.filter(f => f.vehicle_id === vehicle.vehicle_id);
    const totalFuel = fuelLogs.reduce((sum, f) => sum + f.quantity, 0);
    const totalDistance = fuelLogs.length > 0 ? fuelLogs[fuelLogs.length - 1].odometer - (fuelLogs[0]?.odometer || 0) : 0;
    const efficiency = totalFuel > 0 ? (totalDistance / totalFuel).toFixed(2) : 0;
    return {
      ...vehicle,
      fuelEfficiency: parseFloat(efficiency),
      totalFuelUsed: totalFuel,
      totalDistance
    };
  }).sort((a, b) => b.fuelEfficiency - a.fuelEfficiency);
  
  // Calculate Total Operating Cost (TCO)
  const vehicleTCO = mockVehicles.map(vehicle => {
    const maintenanceRecords = mockMaintenanceRecords.filter(m => m.vehicle_id === vehicle.vehicle_id);
    const fuelLogs = mockFuelLogs.filter(f => f.vehicle_id === vehicle.vehicle_id);
    
    const fuelCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0);
    const maintenanceCost = maintenanceRecords.reduce((sum, r) => sum + r.cost, 0);
    const taxCost = 500000; // Mock tax
    const insuranceCost = 2000000; // Mock insurance
    const depreciation = vehicle.total_value * 0.15; // 15% depreciation
    
    const totalOperatingCost = fuelCost + maintenanceCost + taxCost + insuranceCost;
    const tco = totalOperatingCost + depreciation;
    
    return {
      ...vehicle,
      fuelCost,
      maintenanceCost,
      taxCost,
      insuranceCost,
      depreciation,
      totalOperatingCost,
      tco
    };
  }).sort((a, b) => b.tco - a.tco);
  
  const exportToExcel = () => {
    // Create CSV content
    let csvContent = "Vehicle Plate,Brand,Model,Fuel Cost,Maintenance Cost,Tax,Insurance,Depreciation,Total Operating Cost,TCO\\n";
    vehicleTCO.forEach(v => {
      csvContent += `${v.plate},${v.brand},${v.model},${v.fuelCost},${v.maintenanceCost},${v.taxCost},${v.insuranceCost},${v.depreciation},${v.totalOperatingCost},${v.tco}\\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fleet_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

const Reports = () => {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Reports & Analytics (Laporan)</h1>
              <p className="text-gray-400 mt-1">Fleet performance insights and metrics</p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="current">Current Month</SelectItem>
                  <SelectItem value="last">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportToExcel}>
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </div>

          <Tabs defaultValue="tco" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="tco">TCO Analysis</TabsTrigger>
              <TabsTrigger value="downtime">Downtime</TabsTrigger>
              <TabsTrigger value="reliability">Reliability</TabsTrigger>
              <TabsTrigger value="fuel">Fuel Efficiency</TabsTrigger>
              <TabsTrigger value="cost">Operating Cost</TabsTrigger>
            </TabsList>

            <TabsContent value="tco">
              <Card className="bg-gray-900 border-gray-800 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Total Cost of Ownership (TCO) - Biaya Total Kepemilikan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-4">TCO = Total Operating Cost + Depreciation</p>
                  <div className="space-y-4">
                    {vehicleTCO.slice(0, 10).map((vehicle, idx) => (
                      <div key={vehicle.vehicle_id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex items-start gap-4">
                          {vehicle.photos && vehicle.photos.length > 0 && (
                            <img 
                              src={vehicle.photos[0]} 
                              alt={vehicle.plate}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-white">{vehicle.plate}</h3>
                                <p className="text-sm text-gray-400">{vehicle.brand} {vehicle.model}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-white">Rp {(vehicle.tco / 1000000).toFixed(1)}M</p>
                                <p className="text-xs text-gray-400">TCO</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-xs">
                              <div className="p-2 bg-gray-700 rounded">
                                <p className="text-gray-400">Fuel</p>
                                <p className="text-white font-semibold">Rp {(vehicle.fuelCost / 1000).toLocaleString()}K</p>
                              </div>
                              <div className="p-2 bg-gray-700 rounded">
                                <p className="text-gray-400">Maintenance</p>
                                <p className="text-white font-semibold">Rp {(vehicle.maintenanceCost / 1000).toLocaleString()}K</p>
                              </div>
                              <div className="p-2 bg-gray-700 rounded">
                                <p className="text-gray-400">Depreciation</p>
                                <p className="text-white font-semibold">Rp {(vehicle.depreciation / 1000).toLocaleString()}K</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="downtime">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Vehicle Downtime Analysis - Kendaraan Paling Lama Downtime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vehicleDowntime.slice(0, 10).map((vehicle, idx) => (
                      <div key={vehicle.vehicle_id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-4">
                          {vehicle.photos && vehicle.photos.length > 0 && (
                            <img 
                              src={vehicle.photos[0]} 
                              alt={vehicle.plate}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-white">{vehicle.plate}</h3>
                                <p className="text-sm text-gray-400">{vehicle.brand} {vehicle.model}</p>
                              </div>
                              <Badge className={
                                vehicle.downtimeDays > 20 ? 'bg-red-500/20 text-red-400' :
                                vehicle.downtimeDays > 10 ? 'bg-orange-500/20 text-orange-400' :
                                'bg-green-500/20 text-green-400'
                              }>
                                {vehicle.downtimeDays} days downtime
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">Maintenance Count</p>
                                <p className="text-white font-semibold">{vehicle.maintenanceCount} times</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Status</p>
                                <p className="text-white font-semibold">{vehicle.status}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reliability">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Most Reliable Vehicles - Kendaraan Paling Reliable</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vehicleReliability.slice(0, 10).map((vehicle, idx) => (
                      <div key={vehicle.vehicle_id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-4">
                          {vehicle.photos && vehicle.photos.length > 0 && (
                            <img 
                              src={vehicle.photos[0]} 
                              alt={vehicle.plate}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-white">#{idx + 1} {vehicle.plate}</h3>
                                <p className="text-sm text-gray-400">{vehicle.brand} {vehicle.model}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-400">{vehicle.reliabilityScore.toFixed(1)}</p>
                                <p className="text-xs text-gray-400">Reliability Score</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">Maintenance</p>
                                <p className="text-white font-semibold">{vehicle.maintenanceCount} times</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Total Cost</p>
                                <p className="text-white font-semibold">Rp {(vehicle.totalMaintenanceCost / 1000000).toFixed(1)}M</p>
                              </div>
                            </div>
                            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(vehicle.reliabilityScore, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fuel">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Fuel Efficiency Rankings - Kendaraan Paling Efisien BBM</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vehicleFuelEfficiency.slice(0, 10).map((vehicle, idx) => (
                      <div key={vehicle.vehicle_id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-4">
                          {vehicle.photos && vehicle.photos.length > 0 && (
                            <img 
                              src={vehicle.photos[0]} 
                              alt={vehicle.plate}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-white">#{idx + 1} {vehicle.plate}</h3>
                                <p className="text-sm text-gray-400">{vehicle.brand} {vehicle.model}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-400">{vehicle.fuelEfficiency} km/L</p>
                                <p className="text-xs text-gray-400">Efficiency</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">Total Fuel Used</p>
                                <p className="text-white font-semibold">{vehicle.totalFuelUsed.toFixed(1)}L</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Distance</p>
                                <p className="text-white font-semibold">{vehicle.totalDistance.toLocaleString()} km</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Fuel Type</p>
                                <p className="text-white font-semibold">{vehicle.fuel_type}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cost">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Total Operating Costs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Fuel Costs</span>
                          <span className="text-white font-semibold">Rp 1.82M</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Maintenance</span>
                          <span className="text-white font-semibold">Rp 18.35M</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Parts & Supplies</span>
                          <span className="text-white font-semibold">Rp 3.2M</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-800">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Total</span>
                        <span className="text-2xl font-bold text-white">Rp 23.37M</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Cost Per Vehicle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockVehicles.slice(0, 5).map((vehicle) => (
                        <div key={vehicle.vehicle_id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                          <div>
                            <p className="font-medium text-white">{vehicle.plate}</p>
                            <p className="text-xs text-gray-400">{vehicle.brand} {vehicle.model}</p>
                          </div>
                          <p className="font-bold text-white">Rp {(Math.random() * 5 + 2).toFixed(1)}M</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="utilization">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Vehicle Utilization Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockVehicles.map((vehicle) => {
                      const utilization = Math.floor(Math.random() * 40) + 60;
                      return (
                        <div key={vehicle.vehicle_id}>
                          <div className="flex justify-between mb-2">
                            <span className="text-white font-medium">{vehicle.plate}</span>
                            <span className="text-gray-400">{utilization}%</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                utilization >= 80 ? 'bg-green-500' :
                                utilization >= 60 ? 'bg-blue-500' :
                                'bg-orange-500'
                              }`}
                              style={{ width: `${utilization}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fuel">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-100">Avg Efficiency</p>
                        <p className="text-3xl font-bold text-white mt-2">8.5 km/L</p>
                        <div className="flex items-center gap-1 mt-2 text-green-100 text-xs">
                          <TrendingUp className="w-3 h-3" />
                          <span>+3% vs last month</span>
                        </div>
                      </div>
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-100">Total Fuel Used</p>
                        <p className="text-3xl font-bold text-white mt-2">140L</p>
                        <div className="flex items-center gap-1 mt-2 text-blue-100 text-xs">
                          <TrendingDown className="w-3 h-3" />
                          <span>-2% vs last month</span>
                        </div>
                      </div>
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-100">Cost per KM</p>
                        <p className="text-3xl font-bold text-white mt-2">Rp 13</p>
                        <div className="flex items-center gap-1 mt-2 text-purple-100 text-xs">
                          <TrendingDown className="w-3 h-3" />
                          <span>-5% vs last month</span>
                        </div>
                      </div>
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Fuel Efficiency by Vehicle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockVehicles.map((vehicle) => {
                      const efficiency = (Math.random() * 5 + 6).toFixed(1);
                      return (
                        <div key={vehicle.vehicle_id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                          <div>
                            <p className="font-medium text-white">{vehicle.plate}</p>
                            <p className="text-xs text-gray-400">{vehicle.fuel_type}</p>
                          </div>
                          <p className="font-bold text-white">{efficiency} km/L</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="downtime">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Vehicle Downtime Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Downtime Tracking</h3>
                    <p className="text-gray-400">Detailed downtime reports coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Reports;
