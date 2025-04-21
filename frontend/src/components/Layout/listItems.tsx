// src/components/Layout/listItems.tsx
import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Link from 'next/link'; // **Sử dụng Link của Next.js**

export const mainListItems = (
  <React.Fragment>
    {/* Ví dụ: Link đến trang chủ (nếu có) */}
    <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </Link>
    {/* Link đến trang Products */}
    <Link href="/products" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
      <ListItemButton>
        <ListItemIcon>
          <ShoppingCartIcon /> {/* Thay icon nếu muốn */}
        </ListItemIcon>
        <ListItemText primary="Sản phẩm" />
      </ListItemButton>
    </Link>
    {/* Thêm các link khác nếu cần */}
    {/* <Link href="/customers" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
      </ListItemButton>
    </Link> */}
  </React.Fragment>
);

// Giữ lại hoặc xóa secondaryListItems tùy nhu cầu
export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    {/* ... các mục menu phụ ... */}
  </React.Fragment>
);