import React, { useEffect, useState } from 'react';
import { getDefaultSession, logout } from '@inrupt/solid-client-authn-browser'
import { Parser, DataFactory } from 'n3';
import { toast } from 'react-toastify';
import { Avatar, IconButton, Typography, List, ListItem, Menu, MenuItem, Divider } from '@mui/material';
import { LoggedInContext } from './App';

const { namedNode } = DataFactory;

type Profile = {
  name: string | undefined,
  image: string | undefined,
  oidcIssuer: string | undefined,
  preferencesFile: string | undefined,
  storage: string | undefined,
  privateTypeIndex: string | undefined,
  publicTypeIndex: string | undefined
}

export default function LoginMenu() {
  const session = getDefaultSession();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [profile, setProfile] = useState<Profile | undefined>();

  useEffect(() => {
    //here
  });

  return (
    <LoggedInContext.Consumer>
      {([loggedIn, setLoggedIn]) => (
        <>
          {loggedIn &&
            <>
              <IconButton
                onClick={handleMenu}
              >
                <Avatar>
                  <img src={profile?.image} width={32} alt='Avatar' />
                </Avatar>
              </IconButton>
              <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                onClick={handleClose}
              >
                <MenuItem
                  onClick={() => window.open(session.info.webId, '_blank')}
                >
                  <Avatar
                    sx={{
                      mr: 2
                    }}
                  >
                    <img src={profile?.image} width={32} alt='Avatar' />
                  </Avatar>
                  <List sx={{ py: 0, pl: 0 }}>
                    <ListItem sx={{ py: 0, pl: 0 }}>
                      {profile?.name}
                      {profile?.image}
                    </ListItem>
                    <ListItem sx={{ py: 0, pl: 0 }}>
                      <Typography variant='caption'>
                        {session.info.webId}
                      </Typography>
                    </ListItem>
                  </List>
                </MenuItem>
                <Divider />
                <MenuItem>
                  Settings
                </MenuItem>
                <MenuItem
                  //here
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          }
        </>
      )}
    </LoggedInContext.Consumer>
  );
}