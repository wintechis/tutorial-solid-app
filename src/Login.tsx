import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { login } from '@inrupt/solid-client-authn-browser'
import { toast } from 'react-toastify';
import { Button, Typography, TextField } from '@mui/material';

export default function Login() {
  const [oidcIssuer, setOidcIssuer] = useState('https://solidcommunity.net/');

  return (
    <Grid
      container
      spacing={4}
      sx={{ mx: 0, my: 0 }}
      justifyContent="center"
    >
      <Grid
        xs={12}
        md={6}
        pl={{ xs: 0, md: 3 }}
        pr={0}
        py={{ xs: 0, md: 3 }}
          sx={{ maxWidth: 600 }}
        >
          <Paper sx={{ mx: 2, my: 2, px: 2, py: 2, minWidth: 600, minHeight: 300}}>
            <Grid container>
              <Grid xs={12} textAlign='center'>
                <Typography variant="h4" mb={3} mt={2}>
                  Login with Solid
                </Typography>
              </Grid>
              <Grid xs={12} textAlign='center'>
                <TextField
                  id='oidcIssuer'
                  label='Identity Provider'
                  value={oidcIssuer}
                  onChange={e => setOidcIssuer(e.target.value)}
                  sx={{
                    mb: 3,
                  }}
                />
              </Grid>
              <Grid xs={12} textAlign='center'>
                <Button
                  variant='contained'
                  size='large'
                  onClick={() => login({
                    oidcIssuer: oidcIssuer,
                    clientName: 'Solid GTD',
                  }).catch(e => toast.error(e.toString()))}
                  sx={{
                    mb: 1
                  }}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
  );
}
