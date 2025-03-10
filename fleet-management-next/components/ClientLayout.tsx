'use client';

import React, { useState } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/lib/theme';
import Sidebar from './Sidebar';
import Link from 'next/link';
import Image from 'next/image';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Navigation */}
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container-fluid">
            <Link href="/" className="navbar-brand">
              <Image src="/logo.png" alt="MyPalessOffice" width={120} height={40} priority />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                  <IconButton
                    size="large"
                    onClick={handleMenu}
                    color="inherit"
                    className="nav-link"
                  >
                    <PersonIcon /> Admin
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem onClick={handleClose} component={Link} href="/profile">
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleClose} component={Link} href="/settings">
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                      </ListItemIcon>
                      Settings
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleClose} component={Link} href="/login">
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container-fluid">
          <div className="row">
            <Sidebar />
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
              {children}
            </main>
          </div>
        </div>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
} 