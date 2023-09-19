import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import LoginMenu from './LoginMenu';
import AppBar from '@mui/material/AppBar';


export default function Navigation(props: React.PropsWithChildren & { loggedIn: boolean }) {
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <LoginMenu />
        </Toolbar>
      </AppBar>
      <main style={{'margin': 100, 'marginTop': 150}}>
        { props.children }
      </main>
    </Box>
  );

}
