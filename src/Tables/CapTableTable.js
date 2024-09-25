import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, FormControl, Select, MenuItem, Stack, Pagination } from '@mui/material';
import { tableStyles } from '../styles/tables';

function CapTable({
  filteredCapTables = [],
  capRowsPerPage = 5,
  capPage = 0,
  businessProfiles = [],
  selectedStartupCapTable,
  handleStartupChangeCapTable,
  // fundingRounds = []
}) {
  // Local state for pagination
  const [localCapPage, setLocalCapPage] = useState(capPage);
  const [localCapRowsPerPage, setLocalCapRowsPerPage] = useState(capRowsPerPage);

  // State to manage local filter value
  const [filterValue, setFilterValue] = useState(selectedStartupCapTable);

  useEffect(() => {
    setFilterValue(selectedStartupCapTable);
  }, [selectedStartupCapTable]);

  // Handler for filter change
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
    handleStartupChangeCapTable(event);
  };

  // Handle page change
  const handleCapPageChange = (event, newPage) => {
    setLocalCapPage(newPage - 1);
  };

  // Calculate the index of the first and last row to display
  const startIndex = localCapPage * localCapRowsPerPage;
  const endIndex = startIndex + localCapRowsPerPage;

  // Slice the filtered data to display only the rows for the current page
  const paginatedCapTables = filteredCapTables.slice(startIndex, endIndex);

  // Calculate total pages for pagination
  const totalPageCount = Math.ceil(filteredCapTables.length / localCapRowsPerPage);

  // Calculate totals
  const totalShares = paginatedCapTables.reduce((sum, table) => sum + (table.totalShares || 0), 0);
  const totalPercentage = paginatedCapTables.reduce((sum, table) => sum + (table.percentage || 0), 0);
  const averagePercentage = paginatedCapTables.length > 0 ? (totalPercentage / paginatedCapTables.length).toFixed(2) : 'N/A';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ pr: 1 }}>By Company:</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <Select
            value={filterValue}
            onChange={handleFilterChange}
            variant="outlined"
            sx={{ minWidth: 150, height: '45px' }}>
            <MenuItem value="Select Company" disabled>Select Company</MenuItem>
            {businessProfiles.filter(profile => profile.type === 'Startup').map((startup) => (
              <MenuItem key={startup.id} value={startup.id}>{startup.companyName}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer sx={tableStyles.container}>
        <Table>
          <TableHead sx={tableStyles.head}>
            <TableRow>
              <TableCell sx={tableStyles.cell}>
                <Typography sx={tableStyles.typography}>Shareholder's Name</Typography>
              </TableCell>
              <TableCell sx={tableStyles.cell}>
                <Typography sx={tableStyles.typography}>Title</Typography>
              </TableCell>
              <TableCell sx={tableStyles.cell}>
              <Typography sx={tableStyles.typography}>Total Share</Typography>
              </TableCell>
              <TableCell sx={tableStyles.cell}>
                <Typography sx={tableStyles.typography}>Percentage</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedCapTables.length > 0 ? (
              paginatedCapTables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell sx={tableStyles.cell}>{table.name}</TableCell>
                  <TableCell sx={tableStyles.cell}>{table.title}</TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {/* {fundingCurrency}  */}
                    {Number(table.totalShares).toLocaleString()}
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>
                   {table.percentage !== undefined ? table.percentage.toFixed(2) : 'N/A'}%
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={tableStyles.cell}>
                  <Typography variant="body2" color="textSecondary">No investors found in this company.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {/* Total Row */}
          {paginatedCapTables.length > 0 && (
            <TableBody>
              <TableRow>
                <TableCell sx={tableStyles.cell}></TableCell>
                <TableCell sx={tableStyles.cell}><Typography sx={{ fontWeight: 'bold' }}>Total</Typography></TableCell>
                <TableCell sx={{...tableStyles.cell, fontWeight: 'bold'}}>{Number(totalShares).toLocaleString()}</TableCell>
                <TableCell sx={tableStyles.cell}></TableCell>

              </TableRow>
            </TableBody>
          )}
        </Table>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
          <Pagination count={totalPageCount} page={localCapPage + 1} onChange={handleCapPageChange} size="medium"/>
        </Box>
      </TableContainer>
    </Box>
  );
}

export default CapTable;