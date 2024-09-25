import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';

export const StyledCard = styled(Card)(({ theme, selected, color }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '500px',
  height: '120px',
  cursor: 'pointer',
  border: selected ? `3px solid ${color}` : '2px solid grey',
  backgroundColor: selected ? '#e0f7fa' : '#ffffff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    transform: 'scale(1.02)',
  },
}));
