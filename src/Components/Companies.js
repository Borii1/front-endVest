import React, { useState, useMemo, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Toolbar, Typography, Paper, TextField, Avatar, Stack, Pagination } from '@mui/material';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';

const drawerWidth = 240;

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'startup', numeric: false, disablePadding: false, label: 'StartUp Name' },
  { id: 'industry', numeric: false, disablePadding: false, label: 'Industry' },
  { id: 'location', numeric: false, disablePadding: false, label: 'Location' },
  { id: 'founded', numeric: false, disablePadding: false, label: 'Founded Date' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Description', width: '38%' },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: headCell.width, fontWeight: 'bold', backgroundColor: '#007490', color: '#ffffff' }}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              style={{ color: '#ffffff' }}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTableToolbar({ onRequestSearch }) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    onRequestSearch(event.target.value);
  };

  return (
    <Toolbar sx={{ pt: 5, mb: 3 }}>
      <Typography sx={{ flex: '1 1 100%', color: 'rgba(0, 116, 144, 1)', fontWeight: 'bold' }} variant="h5">
        Search Companies
      </Typography>

      <TextField variant="standard" placeholder="Search…" onChange={handleSearch} value={searchText} sx={{ width: 350 }}
        InputProps={{ startAdornment: <SearchIcon /> }} />
    </Toolbar>
  );
}

export default function Companies() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('startup');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filteredRows, setFilteredRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [profilePictures, setProfilePictures] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3000/startups/all')
      .then((response) => {
        setRows(response.data);
        setFilteredRows(response.data);
        fetchAllProfilePictures(response.data); // Fetch profile pictures after data is loaded
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the startups data!", error);
        setLoading(false);
      });
  }, []);

  // Function to fetch all profile pictures for startups
  const fetchAllProfilePictures = async (startups) => {
    const pictures = {};
    await Promise.all(
      startups.map(async (startup) => {
        try {
          const response = await axios.get(`http://localhost:3000/profile-picture/startup/${startup.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            responseType: 'blob', // Important for getting the image as a blob
          });

          const imageUrl = URL.createObjectURL(response.data); // Convert blob to URL
          pictures[startup.id] = imageUrl; // Store image URL against startup ID
        } catch (error) {
          console.error(`Failed to fetch profile picture for startup ID ${startup.id}:`, error);
        }
      })
    );

    setProfilePictures(pictures); // Set state with all fetched profile pictures
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleSearch = (searchText) => {
    const filtered = rows.filter(row => {
      return Object.keys(row).some(key => {
        return row[key].toString().toLowerCase().includes(searchText.toLowerCase());
      });
    });
    setFilteredRows(filtered);
    setPage(0);
  };

  const handleRowClick = (startup) => {
    navigate(`/startupview`, { state: { startup: startup } });
  };

  const emptyRows = useMemo(
    () => page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0,
    [page, rowsPerPage, filteredRows.length]
  );

  const visibleRows = useMemo(
    () => stableSort(filteredRows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredRows, order, orderBy, page, rowsPerPage]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ width: '100%', paddingLeft: `${drawerWidth}px` }}>
      <Navbar />
      <Toolbar />

      <Paper sx={{ width: '100%', p: 3 }} elevation={0}>
        <EnhancedTableToolbar onRequestSearch={handleSearch} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort}/>
            <TableBody>
              {visibleRows.map((row, index) => (
                <TableRow hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', height: '75px' }}
                  onClick={() => handleRowClick(row)}>
                  <TableCell component="th" scope="row" padding="none">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        variant='rounded'
                        sx={{ width: 30, height: 30, mr: 2, ml: 2, border: '2px solid rgba(0, 116, 144, 1)' }}
                        src={profilePictures[row.id]} // Use the fetched profile picture URL
                        alt={row.companyName}>
                        {row.companyName.charAt(0)} {/* Default to the first letter if no picture */}
                      </Avatar>
                      {row.companyName}
                    </Box>
                  </TableCell>
                  <TableCell align="left">{row.industry}</TableCell>
                  <TableCell align="left">{row.streetAddress}</TableCell>
                  <TableCell align="left">{row.foundedDate}</TableCell>
                  <TableCell align="left" sx={{ textAlign: 'justify' }}>{row.companyDescription.split(' ').slice(0, 20).join(' ')}...</TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={headCells.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination controls */}
        <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
          <Pagination count={Math.ceil(filteredRows.length / rowsPerPage)} page={page + 1} onChange={handleChangePage} size="large"/>
        </Stack>
      </Paper>
    </Box>
  );
}