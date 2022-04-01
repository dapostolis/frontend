import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {FormControl, InputLabel, OutlinedInput, Select} from '@material-ui/core';


const styles = () => ({
  formControl: {
    height: 35,
    margin: 0,
  },
  outlinedInput: {
    height: 'inherit',
  }
});

function ChangeGridRows({classes, rowsPerPage, onHandleChangeRows}) {

  const [row, setRow] = useState(rowsPerPage);

  function handleChange(event) {
    setRow(event.target.value);
    onHandleChangeRows(event);
  }

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel htmlFor="rowsPerPage">Rows</InputLabel>

      <Select
        native
        id="rowsPerPage"
        value={row}
        onChange={handleChange}
        input={
          <OutlinedInput
            name="rowsPerPage"
            labelWidth={40}
            className={classes.outlinedInput}
            // id="rowsPerPage"
          />
        }
      >
        <option value=""/>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
      </Select>
    </FormControl>
  )
}

export default withStyles(styles)(ChangeGridRows);