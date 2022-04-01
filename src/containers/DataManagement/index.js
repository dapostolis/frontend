import React, {useState, useRef} from 'react';
import {withStyles} from '@material-ui/core/styles';
import MainBareWrapper from 'components/MainBareWrapper';
import HeadingsLine from '../../components/HeadingSingleLine';
import {Button, FormControl, Paper, Input, InputLabel, Select} from '@material-ui/core';
import {Base64} from 'js-base64';
import {request} from '../../constants/alias';
import {API} from '../../constants/config';
import {useSnackbar} from 'notistack';
import HeadingSideLine from '../../components/HeadingSideLine';
import IndexSignalObjectives from './IndexSignalObjectives';


const STATIC_LIST = {
  dataTypes: [
    {value: 'Factors', name: 'Factors'},
    {value: 'Libor', name: 'Libor'},
    {value: 'Commodities', name: 'Commodities'},
  ],

  dataProviders: [
    {value: 'BLOOMBERG', name: 'BLOOMBERG'},
    {value: 'CUSTOM', name: 'CUSTOM'},
    {value: 'INVESTING', name: 'INVESTING'},
    {value: 'EUREKA', name: 'EUREKA'},
  ],
};

const styles = theme => ({
  container: {
    display: 'flex',
  },

  Paper: {
    // maxWidth: 400,
    width: '50%',
    position: 'relative',
    minHeight: 120,
    marginTop: 15,
    padding: theme.spacing.unit * 2,
  },

  form: {
    marginTop: 20,
  },

  formControl: {
    width: '100%',
    maxWidth: 300,
    display: 'block',
    marginBottom: theme.spacing.unit * 2,
  },

  button: {
    marginTop: 20,
  },
});

function DataManagement({classes}) {
  const {enqueueSnackbar} = useSnackbar();
  const fileInput = useRef(null);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    dataType: '',
    dataProvider: '',
    ticker: '',
  });

  function handleChange(event) {
    const target = event.target,
      {id, value} = target;

    setState({
      ...state,
      [id]: value,
    });
  }

  async function handleSubmit() {
    let encodedData = Base64.encode(JSON.stringify(state));

    let i;
    let formData = new FormData();
    formData.append('fieldsData', encodedData);
    for (i = 0; i < fileInput.current.files.length; i++) {
      formData.append('fileToBeUploaded', fileInput.current.files[i]);
    }


    setLoading(true);

    try {
      await request.post(`${API}alchemistuploader`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      enqueueSnackbar('File uploaded successfully', {variant: 'success'});
    } catch (ex) {
      console.log(ex);
      enqueueSnackbar('Something went wrong. Please contact the system administrator', {variant: 'error'});
    }

    setLoading(false);

  }

  return (
    <div className={classes.container}>

      <MainBareWrapper>

        <HeadingsLine title="Data Management" subtitle="Upload data"/>

        <Paper className={classes.Paper}>

          <HeadingSideLine title="Upload data"/>

          <form autoComplete="off" className={classes.form}>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="dataType">Date Type</InputLabel>
              <Select
                native
                id="dataType"
                value={state.dataType}
                onChange={handleChange}
              >
                <option value=""></option>
                {STATIC_LIST.dataTypes.map(({value, name}, key) => <option key={key} value={value}>{name}</option>)}
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="dataProvider">Date Provider</InputLabel>
              <Select
                native
                id="dataProvider"
                value={state.dataProvider}
                onChange={handleChange}
              >
                <option value=""></option>
                {STATIC_LIST.dataProviders.map(({value, name}, key) => <option key={key} value={value}>{name}</option>)}
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="ticker">Ticker</InputLabel>
              <Input
                  id="ticker"
                  value={state.ticker}
                  placeholder="Ticker"
                  // inputProps={{
                  //   'aria-label': 'search',
                  //   'tabIndex': '1',
                  // }}
                  onChange={handleChange}
              />
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="file-upload" shrink={true}>Upload file</InputLabel>
              <Input
                inputRef={fileInput}
                id="file-upload"
                type="file"
              />
            </FormControl>


            <Button variant="contained" color="secondary" className={classes.button}
                    disabled={loading}
                    onClick={handleSubmit}
            >
              Save
            </Button>

          </form>

        </Paper>


        <Paper className={classes.Paper}>
          <IndexSignalObjectives/>
        </Paper>

      </MainBareWrapper>

    </div>
  );
}

export default withStyles(styles)(DataManagement);
