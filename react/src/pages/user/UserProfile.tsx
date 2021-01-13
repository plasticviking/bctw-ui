// import { useState } from 'react';
import Button from 'components/form/Button';
import TextField from 'components/form/Input';
import Modal from 'components/modal/Modal';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { KeycloakInstance } from 'keycloak-js';
import FormGroup from '@material-ui/core/FormGroup';

import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { useTelemetryApi } from 'hooks/useTelemetryApi';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: '10px'
    },
  })
);

type IUserProfileProps = {
  show: boolean;
  onClose: () => void;
  keycloak: KeycloakInstance;
};

export default function UserProfile(props: IUserProfileProps): JSX.Element {
  const classes = useStyles();
  const { show, onClose, keycloak } = props;
  const useKC = useKeycloakWrapper();
  const bctwApi = useTelemetryApi();

  //@ts-ignore
  const { data, error, isFetching, isError, isLoading } = (bctwApi.useUserRole)();
  const logout = (): void => {
    keycloak.logout();
  }

  const onchange = () => {
    // do nothing
  }
  return (
    <Modal open={show} handleClose={onClose} title='User Profile'>
      <div className={classes.container}>
        <FormGroup >
          {/* <TextField changeHandler={onchange} propName='userName' disabled={true} defaultValue={useKC.username} label='Username'></TextField> */}
          <TextField changeHandler={onchange} propName='firstName' disabled={true} defaultValue={useKC.firstName} label='First Name'></TextField>
          <TextField changeHandler={onchange} propName='lastName' disabled={true} defaultValue={useKC.lastName} label='Last Name'></TextField>
          <TextField type='email' changeHandler={onchange} propName='email' disabled={true} defaultValue={useKC.email} label='Email'></TextField>
          {data && !isError ? <p>user role: {data} </p> : null}
        </FormGroup>
        <Button onClick={logout} >logout</Button>
      </div>
    </Modal>
  );
}
