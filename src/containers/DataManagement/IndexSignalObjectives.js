import React, {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import HeadingSideLine from 'components/HeadingSideLine';
import {Button, FormControl, Select, Typography} from '@material-ui/core';
import {List} from 'immutable';
import ButtonSafe from 'components/ButtonSafe';
import {useSnackbar} from 'notistack';


const styles = theme => ({
  objectiveContainer: {
    border: '1px dotted ' + theme.palette.secondary.main,
    marginBottom: 10,
    padding: theme.spacing.unit,
  },
  objectiveHead: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  objectiveItem: {
    display: 'flex',
    width: '100%',
    padding: 10,
  },
  itemRow: {
    width: '50%',
    marginRight: 10,
    padding: 2,
  },
  btn: {
    margin: '10px 0',
  },
});

function IndexSignalObjectives({classes}) {
  const {enqueueSnackbar} = useSnackbar();
  const [enums, setEnums] = useState({
    objectives: [],
    strategies: [],
  });
  const [savedObjectives, setSavedObjectives] = useState({});

  useEffect(() => {
    fetchInit();
  }, []);

  async function fetchInit() {
    try {

      const {data:objectives} = await request.get(`${API}enum/IndexSignalObjective/Objective/values`);
      const {data:strategies} = await request.get(`${API}enum/IndexSignalObjective/Strategy/values`);
      // objectiveEnum.forEach(value => {
      //   dictionaryObjectiveEnum.current[value.name] = value.friendlyName;
      // });
      setEnums({
        objectives: objectives,
        strategies: strategies,
      });

      const {data: {returnobject: savedObjectives}} = await request.get(`${API}indexsignal/objective`);
      setSavedObjectives(savedObjectives);

    } catch (exception) {
      console.log(exception);
    }
  }

  function handleChange(event, objectiveName, rowNumber) {
    const iObjectiveList = List(savedObjectives[objectiveName]).toArray();
    iObjectiveList[rowNumber].strategy = event.target.value;

    setSavedObjectives({
      ...savedObjectives,
      [objectiveName]: iObjectiveList,
    });
  }

  async function handleSubmit() {
    try {
      await request.put(`${API}indexsignal/objective`, savedObjectives);
      enqueueSnackbar('Index Signal objectives successfully saved', {variant: 'success'});
    } catch (exception) {
      console.log(exception);
      enqueueSnackbar('Something went wrong. Please contact your system administrator', {variant: 'error'});
    }
  }

  return (
    <>

      <HeadingSideLine title="Index Signals Objectives"/>

      <Button variant="contained" color="secondary" className={classes.btn} onClick={handleSubmit}>Save</Button>

      {enums.objectives && enums.objectives.map((v, k) => (
        <div key={k} className={classes.objectiveContainer}>
          <Typography variant="h4" className={classes.objectiveHead}>{v.friendlyName}</Typography>

          <div>
            {savedObjectives[v.name] && savedObjectives[v.name].map((objective, key) => (
              <div key={key} className={classes.objectiveItem}>
                <Typography variant="body1" className={classes.itemRow}>{objective.assetClass}</Typography>

                <FormControl className={classes.itemRow}>
                  <Select
                    native
                    value={objective.strategy}
                    onChange={event => handleChange(event, v.name, key)}
                  >
                    <option value=""></option>
                    {enums.strategies.map((strategy, oKey) => <option key={oKey} value={strategy.name}>{strategy.name}</option>)}
                  </Select>
                </FormControl>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button variant="contained" color="secondary" className={classes.btn} onClick={handleSubmit}>Save</Button>

    </>
  )
}

export default withStyles(styles)(IndexSignalObjectives);