import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
     
        <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        </Toolbar> 
    </Box>
  );
}