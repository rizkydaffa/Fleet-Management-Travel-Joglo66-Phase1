import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useData } from '../context/DataContext';
import { Plus, Search, Circle, Edit, Trash2, Power } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { format } from 'date-fns';

const Tires = () => {
  const [tires] = useState(mockTires);
  const [searchTerm, setSearchTerm] = useState('');

  const getVehiclePlate = (vehicleId) => {
    const vehicle = mockVehicles.find(v => v.vehicle_id === vehicleId);
    return vehicle ? vehicle.plate : 'Unknown';
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Tire Management</h1>
              <p className="text-gray-400 mt-1">Track tire installation and maintenance</p>
            </div>
            <Button className="mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Tire Record
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search tires..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tires.map((tire) => (
              <Card key={tire.tire_id} className="hover:shadow-xl transition-shadow bg-gray-900 border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-500/10 rounded-lg">
                        <Circle className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{tire.position}</h3>
                        <p className="text-sm text-gray-400">{getVehiclePlate(tire.vehicle_id)}</p>
                      </div>
                    </div>
                    <Badge className={tire.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                      {tire.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Brand:</span>
                      <span className="text-white font-medium">{tire.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Size:</span>
                      <span className="text-white font-medium">{tire.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Installed:</span>
                      <span className="text-white font-medium">{format(new Date(tire.installation_date), 'MMM yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mileage:</span>
                      <span className="text-white font-medium">{tire.mileage_installed.toLocaleString()} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cost:</span>
                      <span className="text-white font-medium">Rp {(tire.cost / 1000).toLocaleString()}K</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <Button variant="outline" size="sm" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tires;
