import { BrowserRouter as Router } from 'react-router-dom';
import { CircularProgress, makeStyles, ThemeProvider } from '@material-ui/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { AppRouter, AppRoutes } from './AppRouter';
import DefaultLayout from 'pages/layouts/DefaultLayout';
import SideBar from 'components/sidebar/SideBar';
import appTheme from 'themes/appTheme';
import { DatabaseContext, DatabaseContextProvider, IDatabaseContext } from './contexts/DatabaseContext';
import { DatabaseChangesContextProvider } from 'contexts/DatabaseChangesContext';
import { ResponseProvider } from 'contexts/ApiResponseContext';
import Keycloak, { KeycloakConfig, KeycloakInitOptions, KeycloakInstance } from 'keycloak-js';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden'
  }
}));
const keycloakConfig: KeycloakConfig = {
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  url: process.env.REACT_APP_KEYCLOAK_URL,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID
};

const initConfig: KeycloakInitOptions = {
  onLoad: 'login-required',
  checkLoginIframe: false,
  // added http://localhost:1111/* to keycloak -> clients -> settings -> valid redirect ursl
};

//@ts-ignore
const keycloak: KeycloakInstance = new Keycloak(keycloakConfig);

const layoutProps = {
  keycloak,
  initConfig
};

const queryClient = new QueryClient();

export default function App(): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={appTheme}>
          <DatabaseContextProvider>
            <DatabaseContext.Consumer>
              {(databaseContext: IDatabaseContext): React.ReactNode => {
                if (!databaseContext.database) {
                  return <CircularProgress />;
                }
                return (
                  <DatabaseChangesContextProvider>
                    <Router>
                      <SideBar routes={AppRoutes} />
                      <DefaultLayout {...layoutProps}>
                        <ResponseProvider>
                          <AppRouter />
                        </ResponseProvider>
                      </DefaultLayout>
                    </Router>
                  </DatabaseChangesContextProvider>
                );
              }}
            </DatabaseContext.Consumer>
          </DatabaseContextProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </div>
  );
}
