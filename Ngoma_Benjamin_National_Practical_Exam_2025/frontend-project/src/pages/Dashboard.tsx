import React, { useState, useEffect } from 'react';
import { Car, Package, FileText, CreditCard, TrendingUp, Activity } from 'lucide-react';
import Card from '../components/UI/Card';
import { carService } from '../services/carService';
import { packageService } from '../services/packageService';
import { servicePackageService } from '../services/servicePackageService';
import { paymentService } from '../services/paymentService';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalPackages: 0,
    totalServices: 0,
    totalPayments: 0,
    todayRevenue: 0,
    thisMonthRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [cars, packages, services, payments] = await Promise.all([
        carService.getAllCars(),
        packageService.getAllPackages(),
        servicePackageService.getAllServicePackages(),
        paymentService.getAllPayments(),
      ]);

      const today = new Date().toDateString();
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();

      const todayRevenue = payments
        .filter(p => new Date(p.paymentDate).toDateString() === today)
        .reduce((sum, p) => sum + p.amountPaid, 0);

      const thisMonthRevenue = payments
        .filter(p => {
          const paymentDate = new Date(p.paymentDate);
          return paymentDate.getMonth() === thisMonth && paymentDate.getFullYear() === thisYear;
        })
        .reduce((sum, p) => sum + p.amountPaid, 0);

      setStats({
        totalCars: cars.length,
        totalPackages: packages.length,
        totalServices: services.length,
        totalPayments: payments.length,
        todayRevenue,
        thisMonthRevenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Cars',
      value: stats.totalCars,
      icon: Car,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Service Packages',
      value: stats.totalPackages,
      icon: Package,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      title: 'Total Services',
      value: stats.totalServices,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Payments',
      value: stats.totalPayments,
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const revenueCards = [
    {
      title: "Today's Revenue",
      value: `$${stats.todayRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: "This Month's Revenue",
      value: `$${stats.thisMonthRevenue.toFixed(2)}`,
      icon: Activity,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your car wash business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {revenueCards.map((revenue, index) => {
          const Icon = revenue.icon;
          return (
            <Card key={index} className="hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{revenue.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{revenue.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${revenue.bgColor}`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${revenue.color} bg-clip-text text-transparent`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
          onClick={()=> navigate("/cars")}
          className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group">
            <Car className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Add New Car</p>
          </button>
          <button 
            onClick={()=> navigate("/services")}
          className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 group">
            <FileText className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-teal-600">Create Service</p>
          </button>
          <button
          onClick={()=> navigate("/payments")}
          className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group">
            <CreditCard className="w-8 h-8 text-gray-400 group-hover:text-orange-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-orange-600">Process Payment</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;