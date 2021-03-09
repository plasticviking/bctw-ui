import { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
// import Link from '@material-ui/core/Link';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';

// Icons
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiAccountRemove, mdiProgressClock, mdiBell } from '@mdi/js';

// Assets
import 'styles/AppHeader.scss';
import headerImage from 'assets/images/gov3_bc_logo.png';
import { UserContext } from 'contexts/UserContext';
import { User } from 'types/user';
import { IconButton } from '@material-ui/core';
import { AlertContext } from 'contexts/AlertContext';

const AppHeader = (): JSX.Element => {
  const useUser = useContext(UserContext);
  const useAlert = useContext(AlertContext);
  const [user, setUser] = useState<User>(null);
  const [alertCount, setAlertCount] = useState<number>(0);
  // const preventDefault = (event) => event.preventDefault();

  useEffect(() => {
    if (useUser.ready) {
      setUser(useUser.user);
    }
  }, [useUser]);

  useEffect(() => {
    if (useAlert?.alerts?.length) {
      setAlertCount(useAlert.alerts.length);
    }
  }, [useAlert]);

  return (
    <header className={'app-header'}>
      <div className={'container'}>
        <MuiLink href='/home' className={'brand'} color={'inherit'}>
          <img src={headerImage} width={155} height={52} alt={'Government of British Columbia'} />
          BCTW
        </MuiLink>
        <nav className='profile-nav'>
          <ul>
            <li>
              <div className={'alerts'}>
                <IconButton component={Link} to='/alert' disabled={!alertCount}>
                  <Icon
                    path={mdiBell}
                    color={alertCount ? 'red' : 'grey'}
                    className={'icon'}
                    title='User Alerts'
                    size={1}
                  />
                </IconButton>
                {alertCount ? <span>{alertCount}</span> : null}
              </div>
            </li>
            <li>
              <div className={'username'}>
                <IconButton component={Link} to='/profile'>
                  <Icon
                    path={useUser.ready ? mdiAccountCircle : useUser.error ? mdiAccountRemove : mdiProgressClock}
                    className={'icon'}
                    title='User Profile'
                    size={1}
                  />
                </IconButton>
                <span>{user?.idir ?? 'user name'}</span>
              </div>
            </li>
            <li>
              <Button className={'logout'} color='primary'>
                Log out
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
