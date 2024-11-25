import React from 'react';
import { Menu } from 'antd';
import GridViewIcon from '@mui/icons-material/GridView';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import CellTowerIcon from '@mui/icons-material/CellTower';
import GroupIcon from '@mui/icons-material/Group';
import InsertChartIcon from '@mui/icons-material/InsertChart';

function SideBar({ onMenuClick }) {
  return (
      <Menu
        onClick={(item) => {
          onMenuClick(item.key);
        }}
        items={[
          {
            label: "Dashboard",
            icon: <GridViewIcon />,
            key: '/dashboard'
          },
          {
            label: "KPIs",
            icon: <InsertChartIcon />,
            key: '/kpis'
          },
          {
            label: "Sites",
            key: '/sites',
            icon: <CellTowerIcon />
          },
          {
            label: "Files",
            icon: <DriveFolderUploadIcon />,
            key: '/files'
          },
          {
            label: "Members",
            icon: <GroupIcon />,
            key: '/members'
          }
        ]}
      />
  );
}

export default SideBar;