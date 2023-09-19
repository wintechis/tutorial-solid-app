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
    if(!profile && session.info.webId) {
      let newProfile: Profile = {
        name: undefined,
        image: undefined,
        oidcIssuer: undefined,
        preferencesFile: undefined,
        storage: undefined,
        privateTypeIndex: undefined,
        publicTypeIndex: undefined
      };
      const parser = new Parser({
        baseIRI: session.info.webId
      });
      session.fetch(session.info.webId)
        .then(res => res.text())
        .then(text => parser.parse(text, (error, quad) => {
            if(error) {
              toast.error(error.message);
            } else if(quad) {
              if(quad.subject.equals(namedNode(session.info.webId!))) {
                switch (quad.predicate.value) {
                  case 'http://xmlns.com/foaf/0.1/name':
                    newProfile.name = quad.object.value;
                    break;
                  case 'http://www.w3.org/2006/vcard/ns#hasPhoto':
                    newProfile.image = quad.object.value;
                    break;
                }
              }
            } else {
              setProfile(newProfile);
            }
        }))
        .catch(error => toast.error(error));
    }
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
                <MenuItem onClick={() => {
                  logout();
                  setLoggedIn(false);
                  window.location.reload();
                }}>
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