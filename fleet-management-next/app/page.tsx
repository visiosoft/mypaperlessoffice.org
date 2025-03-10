'use client';

import React, { useState, useEffect } from 'react';
import './dashboard.css';
import {
  Card,
  Grid,
} from '@mui/material';
import {
  DirectionsCar as VehicleIcon,
  People as DriverIcon,
  Route as RouteIcon,
  LocalGasStation as FuelIcon,
  Build as ToolsIcon,
} from '@mui/icons-material';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface MaintenanceItem {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: string;
  dueDate: string;
  status: string;
}

interface Activity {
  id: string;
  icon: React.ReactNode;
  content: string;
  time: string;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  link: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, link }) => (
  <Card className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{title}</div>
    <a href={link} className="stat-link">View Details</a>
  </Card>
);

const ActivityItem: React.FC<Activity> = ({ icon, content, time }) => (
  <div className="activity-item">
    <div className="activity-icon">{icon}</div>
    <div className="activity-content">
      <div>{content}</div>
      <div className="activity-time">{time}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeVehicles: 0,
    activeDrivers: 0,
    activeRoutes: 0,
    averageFuelLevel: 0,
  });

  const [vehicleStatus, setVehicleStatus] = useState({
    active: 8,
    maintenance: 3,
    inactive: 1,
  });

  const [driverStatus, setDriverStatus] = useState({
    onDuty: 6,
    offDuty: 2,
    onLeave: 0,
  });

  const [upcomingMaintenance, setUpcomingMaintenance] = useState<MaintenanceItem[]>([
    {
      id: '1',
      vehicleId: 'TRK-001',
      vehicleName: 'Truck 001',
      type: 'Oil Change',
      dueDate: '2024-03-25',
      status: 'Scheduled',
    },
    {
      id: '2',
      vehicleId: 'VAN-002',
      vehicleName: 'Van 002',
      type: 'Tire Rotation',
      dueDate: '2024-03-26',
      status: 'Scheduled',
    },
    {
      id: '3',
      vehicleId: 'TRK-003',
      vehicleName: 'Truck 003',
      type: 'Brake Inspection',
      dueDate: '2024-03-27',
      status: 'Scheduled',
    },
  ]);

  const [recentActivity, setRecentActivity] = useState<Activity[]>([
    {
      id: '1',
      icon: <VehicleIcon />,
      content: 'Vehicle TRK-001 completed delivery',
      time: '5 minutes ago',
    },
    {
      id: '2',
      icon: <FuelIcon />,
      content: 'Fuel refill completed for VAN-002',
      time: '15 minutes ago',
    },
    {
      id: '3',
      icon: <ToolsIcon />,
      content: 'Maintenance scheduled for TRK-003',
      time: '1 hour ago',
    },
    {
      id: '4',
      icon: <RouteIcon />,
      content: 'New route assigned to DRV-001',
      time: '2 hours ago',
    },
  ]);

  const vehicleChartData = {
    labels: ['Active', 'Maintenance', 'Inactive'],
    datasets: [{
      data: [vehicleStatus.active, vehicleStatus.maintenance, vehicleStatus.inactive],
      backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
    }],
  };

  const driverChartData = {
    labels: ['On Duty', 'Off Duty', 'On Leave'],
    datasets: [{
      data: [driverStatus.onDuty, driverStatus.offDuty, driverStatus.onLeave],
      backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const fetchDashboardData = async () => {
    try {
      const [vehiclesRes, driversRes, routesRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/drivers'),
        fetch('/api/routes'),
      ]);

      const vehicles = await vehiclesRes.json();
      const drivers = await driversRes.json();
      const routes = await routesRes.json();

      setStats({
        activeVehicles: vehicles.filter((v: any) => v.status === 'Active').length,
        activeDrivers: drivers.filter((d: any) => d.status === 'On Duty').length,
        activeRoutes: routes.filter((r: any) => r.status === 'Active').length,
        averageFuelLevel: Math.round(
          vehicles.reduce((acc: number, v: any) => acc + v.fuelLevel, 0) / vehicles.length
        ),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      {/* Stats Cards */}
      <Grid container spacing={3} className="mb-4">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Vehicles"
            value={stats.activeVehicles}
            icon={<VehicleIcon />}
            link="/vehicles"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Drivers"
            value={stats.activeDrivers}
            icon={<DriverIcon />}
            link="/drivers"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Routes"
            value={stats.activeRoutes}
            icon={<RouteIcon />}
            link="/routes"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Fuel Level"
            value={`${stats.averageFuelLevel}%`}
            icon={<FuelIcon />}
            link="/fuel"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} className="mb-4">
        <Grid item xs={12} md={8}>
          <Card className="chart-card">
            <div className="card-header">
              <h6>Vehicle Status Distribution</h6>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <Doughnut data={vehicleChartData} options={chartOptions} />
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="chart-card">
            <div className="card-header">
              <h6>Driver Status</h6>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <Doughnut data={driverChartData} options={chartOptions} />
              </div>
            </div>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity and Upcoming Maintenance */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="activity-card">
            <div className="card-header">
              <h6>Recent Activity</h6>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} {...activity} />
              ))}
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="maintenance-card">
            <div className="card-header">
              <h6>Upcoming Maintenance</h6>
            </div>
            <div className="maintenance-list">
              {upcomingMaintenance.map((item) => (
                <div key={item.id} className="maintenance-item">
                  <div className="maintenance-vehicle">{item.vehicleName}</div>
                  <div className="maintenance-date">Due: {new Date(item.dueDate).toLocaleDateString()}</div>
                  <div className="maintenance-type">{item.type}</div>
                </div>
              ))}
            </div>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
