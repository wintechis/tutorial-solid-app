import React, { createContext, useEffect, useState } from 'react';
import { getDefaultSession, handleIncomingRedirect } from '@inrupt/solid-client-authn-browser'
import Navigation from './Navigation';
import Login from './Login';
import Content from './Content';

export const LoggedInContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([getDefaultSession().info.isLoggedIn, () => {}]);

function App() {
  const [loggedIn, setLoggedIn] = useState(getDefaultSession().info.isLoggedIn);

  useEffect(() => {
    if(!loggedIn) {
      handleIncomingRedirect({
        restorePreviousSession: true
      }).then(info => setLoggedIn(info?.isLoggedIn || false));
    }
  });

  return (
    <LoggedInContext.Provider value={[loggedIn, setLoggedIn]}>
      <LoggedInContext.Consumer>
        {([loggedIn, setLoggedIn]) => (
          <Navigation loggedIn={loggedIn}>
            { loggedIn ? 
              <Content />
              :
              <Login />
            }
          </Navigation>
        )}
      </LoggedInContext.Consumer>
    </LoggedInContext.Provider>
  );
}

export default App;
