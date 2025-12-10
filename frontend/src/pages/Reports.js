import React from 'react';
import Sidebar from '../components/Sidebar';
import { mockVehicles, mockMaintenanceRecords, mockFuelLogs } from '../mock/mockData';
import { BarChart3, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Reports = () => {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
              <p className="text-gray-400 mt-1">Fleet performance insights and metrics</p>
            </div>
            <Button className="mt-4 sm:mt-0">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          <Tabs defaultValue="cost" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
              <TabsTrigger value="utilization">Utilization</TabsTrigger>
              <TabsTrigger value="fuel">Fuel Efficiency</TabsTrigger>
              <TabsTrigger value="downtime">Downtime</TabsTrigger>
            </TabsList>

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
