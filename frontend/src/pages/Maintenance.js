import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { mockMaintenanceRecords, mockVehicles, mockWorkOrders } from '../mock/mockData';
import { Plus, Search, Calendar, Wrench, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { format } from 'date-fns';

const Maintenance = () => {
  const [maintenanceRecords] = useState(mockMaintenanceRecords);
  const [workOrders] = useState(mockWorkOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);

  const getVehiclePlate = (vehicleId) => {
    const vehicle = mockVehicles.find(v => v.vehicle_id === vehicleId);
    return vehicle ? vehicle.plate : 'Unknown';
  };

  const getWorkOrderBadge = (status) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Pending': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Maintenance</h1>
              <p className="text-gray-400 mt-1">Manage vehicle maintenance and work orders</p>
            </div>
          </div>

          <Tabs defaultValue="records" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="records">Maintenance Records</TabsTrigger>
              <TabsTrigger value="workorders">Work Orders</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="records">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search maintenance records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Maintenance Record</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="vehicle">Vehicle *</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockVehicles.map(v => (
                              <SelectItem key={v.vehicle_id} value={v.vehicle_id}>{v.plate} - {v.brand} {v.model}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="serviceType">Service Type *</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Oil Change">Oil Change</SelectItem>
                            <SelectItem value="Brake Service">Brake Service</SelectItem>
                            <SelectItem value="Tire Rotation">Tire Rotation</SelectItem>
                            <SelectItem value="Engine Overhaul">Engine Overhaul</SelectItem>
                            <SelectItem value="General Inspection">General Inspection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="date">Date *</Label>
                        <Input id="date" type="date" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="mileage">Mileage (km) *</Label>
                        <Input id="mileage" type="number" placeholder="0" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cost">Cost (Rp) *</Label>
                        <Input id="cost" type="number" placeholder="0" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="technician">Technician</Label>
                        <Input id="technician" placeholder="Technician name" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="warranty">Warranty Expiry</Label>
                        <Input id="warranty" type="date" className="mt-1" />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" placeholder="Additional notes..." className="mt-1" rows={3} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                      <Button onClick={() => setIsAddModalOpen(false)}>Save Record</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {maintenanceRecords.map((record) => (
                  <Card key={record.record_id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Wrench className="w-5 h-5 text-blue-600" />
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{record.service_type}</h3>
                              <p className="text-sm text-gray-600">{getVehiclePlate(record.vehicle_id)}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{record.notes}</p>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{format(record.date, 'MMM dd, yyyy')}</span>
                            </div>
                            <span>Mileage: {record.mileage.toLocaleString()} km</span>
                            <span>Technician: {record.technician}</span>
                            {record.warranty_expiry && (
                              <span>Warranty: {format(record.warranty_expiry, 'MMM dd, yyyy')}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                          <p className="text-2xl font-bold text-gray-900">Rp {(record.cost / 1000).toLocaleString()}K</p>
                          <p className="text-xs text-gray-500 mt-1">Work Order #{record.work_order_id}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="workorders">
              <div className="flex justify-end mb-6">
                <Dialog open={isWorkOrderModalOpen} onOpenChange={setIsWorkOrderModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Work Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create Work Order</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="woVehicle">Vehicle *</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockVehicles.map(v => (
                              <SelectItem key={v.vehicle_id} value={v.vehicle_id}>{v.plate} - {v.brand} {v.model}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority *</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                        <Input id="scheduledDate" type="date" className="mt-1" />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea id="description" placeholder="Describe the work to be done..." className="mt-1" rows={4} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsWorkOrderModalOpen(false)}>Cancel</Button>
                      <Button onClick={() => setIsWorkOrderModalOpen(false)}>Create Order</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {workOrders.map((order) => (
                  <Card key={order.order_id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-gray-900">WO #{order.order_id}</h3>
                                <Badge className={getPriorityColor(order.priority)}>
                                  {order.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{getVehiclePlate(order.vehicle_id)}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{order.description}</p>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <span>Scheduled: {format(order.scheduled_date, 'MMM dd, yyyy')}</span>
                            {order.completed_date && (
                              <span>Completed: {format(order.completed_date, 'MMM dd, yyyy')}</span>
                            )}
                            <span>Labor: Rp {(order.labor_cost / 1000).toLocaleString()}K</span>
                            <span>Parts: Rp {(order.parts_cost / 1000).toLocaleString()}K</span>
                          </div>
                        </div>
                        <div className="text-right mt-4 md:mt-0 space-y-2">
                          <Badge variant={getWorkOrderBadge(order.status)}>
                            {order.status}
                          </Badge>
                          <p className="text-2xl font-bold text-gray-900">Rp {(order.total_cost / 1000).toLocaleString()}K</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Maintenance Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p>Maintenance schedule based on mileage and time intervals</p>
                    <p className="text-sm mt-2">Coming soon with predictive maintenance alerts</p>
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

export default Maintenance;
