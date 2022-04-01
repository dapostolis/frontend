import React, {useEffect, useState} from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import LoaderLine from 'components/LoaderLine';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {useSnackbar} from 'notistack';
import InfoBox from '../../components/InfoBox';


const style = () => ({
  tCellSmall: {
    padding: 0,
  },
  textField: {
    width: 100,
  },
  button: {
    marginTop: 20,
  },

  infoBox: {
    margin: '10px 0',
  },
});

function ModulesDialog({classes, modules, onHandleCloseFormModules, onHandleSubmitModulesForm}) {
  const {enqueueSnackbar} = useSnackbar();
  const [values, setValues] = useState({});

  useEffect(() => {
    let values = {}; //dict used for
    modules.list.forEach(module => {
      values[module.id] = {
        price: module.price === null ? '' : module.price,
        name: module.name,
        enabled: module.enabled,
        error: '', // if empty no errors
      }
    });

    setValues(values);
  }, [modules.user.id])

  function handleChange(event, mid) {
    const target = event.target,
      {id, type, value, checked} = target;

    let fieldValue = type === 'checkbox' ? checked : value;

    let fieldId = id.split('-')[1];

    setValues({
      ...values,
      [mid]: {
        ...values[mid],
        [fieldId]: fieldValue,
        error: '',
      },
    })
  }

  function handleSubmit(userId) {
    try {
      let data = Object.keys(values).filter(mid => values[mid].enabled).map(mid => {
        if (values[mid].price === '' || values[mid].price < 0) {

          let message = 'Price is required to enable "' + values[mid].name + '" module.';

          setValues({
            ...values,
            [mid]: {
              ...values[mid],
              error: message,
            },
          });

          throw {message: message}
        }

        return ({
          moduleID: mid,
          price: values[mid].price,
        })
      });

      onHandleSubmitModulesForm(userId, data);
    } catch (e) {
      // show error
      enqueueSnackbar(e.message, {variant: 'error'});
      console.log(e);
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={modules.isOpened} onClose={onHandleCloseFormModules}>
      <LoaderLine start={modules.loading}/>

      <DialogTitle>Modules</DialogTitle>

      <DialogContent>
        <DialogContentText component="div">
          Setup modules for user <strong>{modules.user.email}</strong><br/>

          <InfoBox className={classes.infoBox} type="info" show={window.Boolean(modules.user.currency)}>
            Set prices in <strong>{modules.user.currency}</strong> currency.
          </InfoBox>

          <InfoBox className={classes.infoBox} type="warning" show={window.Boolean(!modules.user.currency)}>
            No currency has been set. It is recommended to set user's currency and then continue setting module's prices.
          </InfoBox>
        </DialogContentText>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tCellSmall}></TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {modules.list && modules.list.map(module => (
              <TableRow key={module.id} hover>

                <TableCell className={classes.tCellSmall}>
                  <Checkbox
                    checked={values[module.id] && values[module.id].enabled}
                    id="module-enabled"
                    onChange={event => handleChange(event, module.id)}
                  />
                </TableCell>
                <TableCell>{module.name}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    id="module-price"
                    className={classes.textField}
                    label="Price"
                    margin="dense"
                    variant="outlined"
                    value={values[module.id] && values[module.id].price}
                    onChange={event => handleChange(event, module.id)}
                    disabled={!values[module.id] || !values[module.id].enabled}
                    error={values[module.id] && values[module.id].error !== ''}
                  />
                </TableCell>{/*module-price*/}

              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={() => handleSubmit(modules.user.id)}
        >Save</Button>

      </DialogContent>
    </Dialog>
  )
}

export default withStyles(style)(ModulesDialog)