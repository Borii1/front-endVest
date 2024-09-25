// src/styles.js
import styled from '@emotion/styled';
import { Box, Typography, Button, List } from '@mui/material';

const drawerWidth = 270;

export const Container = styled(Box)`
  display: flex;
  flex-grow: 1;
  padding: 50px 35px 5px ${drawerWidth}px;
  overflow-x: hidden;
  margin-bottom: 50px;
`;

export const HeaderBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatsBox = styled(Box)`
  background: linear-gradient(to bottom, #0093d0, #00779d, #005b6e);
  color: white;
  height: 70px; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export const TopInfoBox = styled(Box)`
  background: linear-gradient(135deg, #0093d0, #005b6e);
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  padding: 10px;
`;

export const TopInfoIcon = styled(Box)`
  position: absolute;
  top: 10px;
  right: 15px;
  width: 50px; 
  height: 50px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  z-index: 1;
  transition: transform 0.3s, box-shadow 0.3s;
  &:hover {
    box-shadow: 0 12px 24px rgba(240, 240, 240, 0.8);
    transform: scale(1.05); 
  }
`;

export const TopInfoText = styled(Typography)`
  color: #ffffff;
  text-align: center;
  font-size: 15px;
`;

export const TopInfoTitle = styled(Typography)`
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  font-size: 16px;
`;

export const CreateButton = styled(Button)`
  width: 180px; 
  background-color: #007490;
  color: #f2f2f2;
  border-radius: 5px;
  transition: background-color 0.3s, box-shadow 0.3s; 
  &:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    background-color: #007490;
  }
`;

export const RecentActivityBox = styled(Box)`
  background-color: white;
  height: 420px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border: 1px solid #e0e0e0;
`;

export const GraphTitle = styled(Typography)`
  font-weight: bold;
  padding: 15px 15px 15px 30px;
  color: #00779d;
  font-size: 18px;
`;

export const RecentActivityTitle = styled(Typography)`
  font-weight: bold;
  padding: 15px;
  color: #00779d;
  font-size: 18px;
  display: flex;
  align-items: center; 
`;

export const RecentActivityList = styled(List)`
  padding-left: 1px;
  overflow-y: auto;
`;