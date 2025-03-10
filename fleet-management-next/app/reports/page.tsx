'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports() {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(30, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [reportType, setReportType] = useState('fuel');
  const [fuelData, setFuelData] = useState<any[]>([]);
  const [maintenanceData, setMaintenanceData] = useState<any[]>([]);
  const [routeData, setRouteData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [fuelRes, maintenanceRes, routeRes] = await Promise.all([
        fetch('/api/fuel'),
        fetch('/api/maintenance'),
        fetch('/api/routes'),
      ]);

      const fuel = await fuelRes.json();
      const maintenance = await maintenanceRes.json();
      const routes = await routeRes.json();

      setFuelData(fuel);
      setMaintenanceData(maintenance);
      setRouteData(routes);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fuelChartData = {
    labels: fuelData.map((record: any) => new Date(record.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Fuel Cost',
        data: fuelData.map((record: any) => record.cost),
        borderColor: '#875A7B',
        backgroundColor: '#875A7B20',
        tension: 0.4,
      },
      {
        label: 'Amount (L)',
        data: fuelData.map((record: any) => record.amount),
        borderColor: '#6B4423',
        backgroundColor: '#6B442320',
        tension: 0.4,
      },
    ],
  };

  const maintenanceChartData = {
    labels: maintenanceData.map((record: any) => record.type),
    datasets: [
      {
        data: maintenanceData.reduce((acc: any, record: any) => {
          acc[record.type] = (acc[record.type] || 0) + record.cost;
          return acc;
        }, {}),
        backgroundColor: [
          '#875A7B',
          '#6B4423',
          '#28a745',
          '#ffc107',
          '#dc3545',
        ],
      },
    ],
  };

  const routeChartData = {
    labels: routeData.map((record: any) => record.name),
    datasets: [
      {
        label: 'Distance (km)',
        data: routeData.map((record: any) => record.distance),
        backgroundColor: '#875A7B',
      },
      {
        label: 'Duration (hrs)',
        data: routeData.map((record: any) => record.estimatedDuration),
        backgroundColor: '#6B4423',
      },
    ],
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

  const getChartData = () => {
    switch (reportType) {
      case 'fuel':
        return {
          labels: fuelData.map(d => dayjs(d.date).format('MMM D')),
          datasets: [
            {
              label: 'Fuel Cost',
              data: fuelData.map(d => d.cost),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
          ],
        };
      case 'maintenance':
        return {
          labels: maintenanceData.map(d => d.type),
          datasets: [
            {
              label: 'Maintenance Count',
              data: maintenanceData.map(d => d.count),
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
        };
      case 'routes':
        return {
          labels: routeData.map(d => dayjs(d.date).format('MMM D')),
          datasets: [
            {
              label: 'Distance (km)',
              data: routeData.map(d => d.distance),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        };
      default:
        return {
          labels: [],
          datasets: [],
        };
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="fuel">Fuel Consumption</MenuItem>
                <MenuItem value="maintenance">Maintenance History</MenuItem>
                <MenuItem value="routes">Route Analytics</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={fetchData}
              sx={{ height: '56px' }}
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ height: 400 }}>
          {reportType === 'maintenance' ? (
            <Bar options={chartOptions} data={getChartData()} />
          ) : (
            <Line options={chartOptions} data={getChartData()} />
          )}
        </Box>
      </Paper>
    </Box>
  );
} 