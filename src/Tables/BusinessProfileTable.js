import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Pagination } from '@mui/material';
import ViewStartupProfileDialog from '../Dialogs/ViewStartupProfileDialog';
import ViewInvestorProfileDialog from '../Dialogs/ViewInvestorProfileDialog';
import ConfirmDeleteDialog from '../Dialogs/ConfirmDeleteProfileDialog';
import { tableStyles } from '../styles/tables';

function BusinessProfileTable({
  businessProfiles,
  handleOpenStartUp,
  handleOpenInvestor,
  handleOpenDeleteDialog,
  selectedBusinessProfile,
  openViewStartup,
  openViewInvestor,
  openDeleteDialog,
  handleCloseStartUp,
  handleCloseInvestor,
  handleCloseDeleteDialog,
  handleSoftDelete,
  profileToDelete
}) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const totalPageCount = Math.ceil(businessProfiles.length / rowsPerPage);

  return (
    <Box component="main" sx={{ display: 'flex', flexDirection: 'column' }}>
      <TableContainer sx={tableStyles.container}>
        <Table>
          <TableHead sx={tableStyles.head}>
            <TableRow>
              <TableCell sx={tableStyles.cell}>
                <Typography sx={tableStyles.typography}>Type</Typography>
              </TableCell>
              <TableCell sx={tableStyles.cell}>
                <Typography sx={tableStyles.typography}>Company/Investor Name</Typography>
              </TableCell>
              <TableCell sx={tableStyles.cell}>
                <Typography sx={tableStyles.typography}>Industry</Typography>
              </TableCell>
              <TableCell sx={tableStyles.cell}>
                <Typography sx={tableStyles.typography}>Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {businessProfiles
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((profile) => (
                <TableRow
                  key={`${profile.type}-${profile.id}`}
                  sx={tableStyles.row(profile.type)}>
                  <TableCell sx={tableStyles.cell}>{profile.type}</TableCell>
                  <TableCell sx={tableStyles.cell}>
                  {profile.type === 'Investor' 
                    ? `${profile.firstName} ${profile.lastName}` || '---' 
                    : profile.companyName || '---'}
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {profile.industry || '---'}</TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {profile.type === 'Investor' ? (
                      <Button
                        variant="contained"
                        sx={{ width: 'calc(50% - 25px)', ...tableStyles.actionButton }}
                        onClick={() => handleOpenInvestor(profile)}>
                        View
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          sx={tableStyles.actionButton}
                          onClick={() => handleOpenStartUp(profile)}>
                          View
                        </Button>
                        <Button
                          variant="text"
                          sx={tableStyles.deleteButton}
                          onClick={() => handleOpenDeleteDialog(profile)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
          <Pagination count={totalPageCount} page={page} onChange={handleChangePage} size="medium"/>
        </Box>
      </TableContainer>

      <ViewStartupProfileDialog open={openViewStartup} profile={selectedBusinessProfile} onClose={handleCloseStartUp} />
      <ViewInvestorProfileDialog open={openViewInvestor} profile={selectedBusinessProfile} onClose={handleCloseInvestor} />
      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleSoftDelete}
        companyName={profileToDelete ? profileToDelete.companyName : null} />
    </Box>
  );
}

export default BusinessProfileTable;