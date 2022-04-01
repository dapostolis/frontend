import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Button, FormControl, InputLabel, Paper, Select, TextField} from '@material-ui/core';
import HeadingSideLine from 'components/HeadingSideLine';


const styles = theme => ({
  filtersWrap: {
    // width: 280,
    marginBottom: 3,
    padding: 20,
    border: '2px solid ' + theme.palette.primary.dark,
  },

  fieldsContainer: {
    display: 'flex',
  },

  formControl: {
    marginTop: '16px',
    width: '100%',
  },

  textField: {
    // width: '100%',
    marginRight: 10,
  },

  button: {
    marginTop: 40,
    marginRight: 7,
  },
});

function Filters({classes, fields, onHandleFilter, onHandleFilterReset, isFilteringApplied}) {

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    username: '',
  });


  function handleChange(event) {
    const target = event.target,
      id = target.id,
      value = target.value;

    setValues({
      ...values,
      [id]: value,
    });
  }

  function handleReset() {
    setValues({
      username: '',
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

      <form noValidate autoComplete="off" className={classes.inline} onSubmit={event => event.preventDefault()}>

        <div className={classes.fieldsContainer}>

          <TextField
            id="username"
            label="Email"
            className={classes.textField}
            value={values.username}
            onChange={handleChange}
            margin="normal"
          />

        </div>


        <div>
          <Button variant="contained" color="secondary" size="small" className={classes.button}
                  disabled={loading}
                  onClick={handleSubmit}
          >
            Filter
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
