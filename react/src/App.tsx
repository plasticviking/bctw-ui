import 'styles/AppLayout.scss';
import 'styles/Data.scss';

import { makeStyles, ThemeProvider } from '@material-ui/core';
import { SnackbarWrapper } from 'components/common';
import AppHeader from 'components/common/AppHeader';
import SideBar from 'components/sidebar/SideBar';
import { AlertContext, AlertStateContextProvider } from 'contexts/AlertContext';
import { ResponseProvider } from 'contexts/ApiResponseContext';
import { UserContext, UserStateContextProvider } from 'contexts/UserContext';
import DefaultLayout from 'pages/layouts/DefaultLayout';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter } from 'react-router-dom';
import appTheme from 'themes/appTheme';
import { AppRouter, AppRoutes } from './AppRouter';

// import AppFooter from 'components/common/AppFooter';
const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden'
  }
}));

const queryClient = new QueryClient();

export default function App(): JSX.Element {
  const classes = useStyles();
  const [sidebar, setSidebar] = useState<JSX.Element>();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={appTheme}>
        <UserStateContextProvider>
          <UserContext.Consumer>
            {(): React.ReactNode => {
              return (
                <HashRouter>
                  <AlertStateContextProvider>
                    <AlertContext.Consumer>
                      {(): React.ReactNode => {
                        return (
                          <div className={classes.root}>
                            <AppHeader />
                            <div className={'app-body'}>
                              <div className='app-body__inner'>
                                <SideBar routes={AppRoutes} sidebarContent={sidebar} />
                                <ResponseProvider>
                                  <SnackbarWrapper>
                                    <DefaultLayout>
                                      <AppRouter onContentChange={setSidebar} />
                                    </DefaultLayout>
                                  </SnackbarWrapper>
                                </ResponseProvider>
                              </div>
                            </div>
                            {/* <AppFooter/> */}
                          </div>
                        );
                      }}
                    </AlertContext.Consumer>
                  </AlertStateContextProvider>
                </HashRouter>
              );
            }}
          </UserContext.Consumer>
        </UserStateContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
