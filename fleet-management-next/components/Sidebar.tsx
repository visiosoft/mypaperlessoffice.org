'use client';

import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  DirectionsCar as VehicleIcon,
  Person as DriverIcon,
  Build as MaintenanceIcon,
  LocalGasStation as FuelIcon,
  Description as ContractsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Vehicles', icon: <VehicleIcon />, path: '/vehicles' },
  { text: 'Drivers', icon: <DriverIcon />, path: '/drivers' },
  { text: 'Maintenance', icon: <MaintenanceIcon />, path: '/maintenance' },
  { text: 'Fuel', icon: <FuelIcon />, path: '/fuel' },
  { text: 'Contracts', icon: <ContractsIcon />, path: '/contracts' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => router.push(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: pathname === item.path ? 'inherit' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
} 