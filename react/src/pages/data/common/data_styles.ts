import { makeStyles } from "@material-ui/core";

const useDataStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  editButtonRow: {
    '& > button': {
      marginRight: '20px'
    }
  },
  editSaveButton: {
    float: 'right'
  },
  mainButtonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0 5px'
  }
});

export {
  useDataStyles
}