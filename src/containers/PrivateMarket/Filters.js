import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Paper, Typography, FormControl, InputLabel, Select, Button, TextField} from '@material-ui/core';
import HeadingSideLine from 'components/HeadingSideLine';


const styles = theme => ({
  filtersWrap: {
    // width: 280,
    padding: 20,
  },

  formControl: {
    marginTop: '16px',
    width: '100%'
  },

  textField: {
    width: '100%',
  },

  button: {
    marginTop: 40,
    marginRight: 7
  },
});

function Filters({classes, lists: {modules, countries}, fields, onHandleFilter, onHandleFilterReset, isFilteringApplied}) {

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    module: '',
    region: '',
    sector: '',
    country: '',
    favourite: '',
  });


  function handleChange(event) {
    const target = event.target,
          id = target.id,
          value = target.value;

    setValues({
      ...values,
      [id]: value
    });
  }

  function handleReset() {
    setValues({
      module: '',
      region: '',
      country: '',
      sector: '',
      favourite: '',
    });
    onHandleFilterReset();
  }

  function handleSubmit() {
    setLoading(true);
    onHandleFilter(values, function () {
      setLoading(false);
    });
  }

  return (
    <Paper square={false} elevation={0} className={classes.filtersWrap}>
      <HeadingSideLine title="Filters"/>

      <form noValidate autoComplete="off" onSubmit={event => event.preventDefault()}>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="module">Type</InputLabel>
          <Select
            native
            id="module"
            name="module"
            value={values.module}
            onChange={handleChange}
          >
            <option value=""/>
            {modules.map((module, i) => <option key={i} value={module.id}>{module.name}</option>)}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="favourite">Favourites</InputLabel>
          <Select
              native
              id="favourite"
              name="favourite"
              value={values.favourite}
              onChange={handleChange}
          >
            <option value=""/>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        </FormControl>

        <TextField
          id="region"
          label="Region"
          className={classes.textField}
          value={values.region}
          onChange={handleChange}
          margin="normal"
        />

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="country">Country</InputLabel>
          <Select
            native
            id="country"
            name="country"
            value={values.country}
            onChange={handleChange}
          >
            <option value=""/>
            {countries.map((country, i) => <option key={i} value={country.id}>{country.name}</option>)}
          </Select>
        </FormControl>

        <TextField
            id="sector"
            label="Sector"
            className={classes.textField}
            value={values.sector}
            onChange={handleChange}
            margin="normal"
        />

        <div>
          <Button variant="contained" color="secondary" size="small" className={classes.button}
                  disabled={loading}
                  onClick={handleSubmit}
          >
            Run
          </Button>

          <Button variant="contained" color="secondary" size="small" className={classes.button}
                  disabled={loading || !isFilteringApplied}
                  onClick={handleReset}
          >
            Reset
          </Button>
        </div>

      </form>
    </Paper>
  )

}

export default withStyles(styles)(Filters);
