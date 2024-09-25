import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Toolbar, CssBaseline, AppBar, Box, IconButton, Avatar, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';

import { StatsBox, TopInfoText, TopInfoTitle, } from '../styles/UserDashboard';


const AdminDashboard = () => {
  const [filter, setFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/all');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location = '/';
  };

  return (
    <div style={{ marginTop: '78px' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'rgba(0, 116, 144, 1)' }}>
        <Toolbar>
          <Avatar sx={{ ml: -3, width: 70, height: 70 }} src='images/logoonly.png'></Avatar>
          <Typography variant="h6" noWrap component="div" sx={{ ml: -1 }}>
            StartUp Vest
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="medium" aria-label="show 17 new notifications" color="inherit" sx={{ marginRight: 5 }} onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <Grid container spacing={2} sx={{ textAlign: 'center' }}>
            <Grid item xs={12} sm={3}>
              <StatsBox>
                  <TopInfoText>Total Users</TopInfoText>
                  <TopInfoTitle>{loading ? 'Loading...' : users.length}</TopInfoTitle>
              </StatsBox>
            </Grid>

            <Grid item xs={12} sm={3}>
              <StatsBox>
                <TopInfoText>Total Startups</TopInfoText>
                <TopInfoTitle>10</TopInfoTitle>
              </StatsBox>
            </Grid>

            <Grid item xs={12} sm={3}>
              <StatsBox>
                <TopInfoText>Total Investors</TopInfoText>
                <TopInfoTitle>30</TopInfoTitle>
              </StatsBox>
            </Grid>

            <Grid item xs={12} sm={3}>
              <StatsBox>
                <TopInfoText>Total Amount Funding</TopInfoText>
                <TopInfoTitle>P40,000</TopInfoTitle>
              </StatsBox>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
                <Typography variant="h5">User Growth Graph</Typography>
              </Paper>
            </Grid>

            {/* Latest User */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
                <Typography variant="h5">Latest User</Typography>
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#005b6e'}}>
                        <TableCell sx={{ color: 'white'}}>Name</TableCell>
                        <TableCell sx={{ color: 'white'}}>Photo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={2}>Loading...</TableCell>
                        </TableRow>
                      ) : (
                        users.slice(-1).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.firstName} {user.lastName}</TableCell>
                            <TableCell><Avatar src={user.photo} /></TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* User Information Table */}
            <Grid item xs={12}>
              <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h5">User Information</Typography>
                  <Select value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ minWidth: 150, mt: -1 }}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="startup">Startup</MenuItem>
                    <MenuItem value="investor">Investor</MenuItem>
                  </Select>
                </Box>
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#005b6e'}} >
                        <TableCell sx= {{ color: 'white' }}>Name</TableCell>
                        <TableCell sx= {{ color: 'white' }}>Gender</TableCell>
                        <TableCell sx= {{ color: 'white' }}>Email</TableCell>
                        <TableCell sx= {{ color: 'white' }}>Contact Number</TableCell>
                        <TableCell sx= {{ color: 'white' }}>Photo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5}>Loading...</TableCell>
                        </TableRow>
                      ) : (
                        users
                          .filter(user => filter === 'all' || user.type === filter)
                          .map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.firstName} {user.lastName}</TableCell>
                              <TableCell>{user.gender}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.contactNumber}</TableCell>
                              <TableCell><Avatar src={user.photo} /></TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
