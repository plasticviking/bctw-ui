import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from 'components/form/Button';
import { KeycloakInitOptions, KeycloakInstance } from 'keycloak-js';
import { KeycloakProvider } from '@react-keycloak/web';
import { CircularProgress } from '@material-ui/core';
import keyCloakEventHandler from 'utils/keycloakEventHandler';
import { AuthStateContextProvider, AuthStateContext } from 'contexts/AuthStateContext';
import UserProfile from 'pages/user/UserProfile';

const useStyles = makeStyles({
  wrapper: {
    padding: '20px 15px',
    // background: 'linear-gradient(to bottom, #ffc5c5, #ff4949)'
    display: 'flex',
    flexDirection: 'column'
  },
  authRow: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    height: '5vh',
    padding: '5px 0'
  }
});

type IDefaultLayoutProps = {
  keycloak: KeycloakInstance;
  initConfig: KeycloakInitOptions;
  children: React.ReactNode;
};

export default function DefaultLayout({ children, keycloak, initConfig }: IDefaultLayoutProps): JSX.Element {
  const classes = useStyles();
  const [showUser, setShowUser] = useState<boolean>(false);
  const handleit = (): void => setShowUser((o) => !o);
  return (
    <KeycloakProvider
      keycloak={keycloak}
      initConfig={initConfig}
      LoadingComponent={<CircularProgress />}
      onEvent={keyCloakEventHandler(keycloak)}>
      <AuthStateContextProvider>
        <AuthStateContext.Consumer>
          {(context): JSX.Element => {
            if (!context.ready) {
              return <CircularProgress />;
            }
            return (
              <div className={classes.authRow}>
                <Button onClick={handleit}>Profile</Button>
                <UserProfile onClose={handleit} show={showUser} keycloak={keycloak} />
                <div className={classes.wrapper}>{children}</div>
              </div>
            );
          }}
        </AuthStateContext.Consumer>
      </AuthStateContextProvider>
    </KeycloakProvider>
  );
}
