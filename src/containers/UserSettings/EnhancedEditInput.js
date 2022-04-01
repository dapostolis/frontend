import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import EditInput from 'components/FlatField/EditInput';


const styles = theme => ({
  formControl: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid ' + theme.palette.primary.main,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  editResult: {
    display: 'flex',
    alignItems: 'center',
    height: 29,
    position: 'relative',
    paddingLeft: 15,

    '&::before': {
      content: '"✎"',
      position: 'absolute',
      left: 0,
    }
  },
  editResultDisabled: {
    display: 'flex',
    alignItems: 'center',
    height: 29,
    position: 'relative',
  },
  editControl: {
    // border: '1px solid red',
  },
});

function EnhancedEditInput({classes, label, disabled, ...other}) {
  return (
    <div className={classes.formControl}>
      <Typography component="div" className={classes.label}>{label}:</Typography>
      <Typography component="div">
        {!disabled ?
          <EditInput
            css={{
              control: classes.editControl,
              result: classes.editResult,
            }}
            {...other}
          />
          : <div className={classes.editResultDisabled}>{other.fieldValue}</div>}
      </Typography>
    </div>
  )
}

export default withStyles(styles)(EnhancedEditInput);