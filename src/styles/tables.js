export const tableStyles = {
    container: {
      borderRadius: 2,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    head: {
      backgroundColor: '#007490',
    },
    headerCell: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#F2F2F2',
    },
    cell: {
      textAlign: 'center',
    },
    row: (type) => ({
      backgroundColor: type === 'Investor' ? 'rgba(0, 116, 144, .1)' : 'inherit',
    }),
    actionButton: {
      background: 'rgba(0, 116, 144, 1)',
      '&:hover': {
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        backgroundColor: 'rgba(0, 116, 144, 1)',
      },
    },
    deleteButton: {
      marginLeft: '20px',
      color: 'rgba(0, 116, 144, 1)',
      borderColor: 'rgba(0, 116, 144, 1)',
    },
    typography: {
      variant: 'subtitle1',
      fontWeight: 'bold',
      color: '#F2F2F2',
    },
  };
  