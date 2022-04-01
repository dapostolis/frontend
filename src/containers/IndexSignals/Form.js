import React, {useEffect, useState} from 'react';
import {Button, FormControl} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import HeadingSideLine from 'components/HeadingSideLine';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import {useSnackbar} from 'notistack';
import classnames from 'classnames';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import {convertArrayToDictionaryBySelectedKey} from 'utils/generic';
import Loader from 'components/LoaderCircle';
import PoweredBy from './PoweredBy';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const styles = theme => ({
  formContainer: {
    height: '100%',
  },

  form: {
    height: 'calc(100% - 145px)',
    overflow: 'auto',
  },

  assetsContainer: {
    minHeight: 100,
  },

  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },

  kvContainer: {
    display: 'flex',
    marginBottom: 12,
  },

  // autocomplete
  autoRoot: {
    flexGrow: 1,
    height: 250,
  },
  autoContainer: {
    flexGrow: 1,
    position: 'relative',
  },
  autoPaper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  autoInputRoot: {
    flexWrap: 'wrap',
  },
  autoInputInput: {
    width: 'auto',
    flexGrow: 1,
  },


  titleSideLine: {
    margin: '30px 0 10px 15px',
  },

  formControl: {
    marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
  },

  // Inline fields
  formControlAdd: {
    width: 30,
    marginLeft: 10,
    marginTop: 8,
  },
  addFieldFab: {
    width: 21,
    height: 21,
    minHeight: 'auto',
  },
  addFieldIcon: {
    width: 15,
    height: 15,
  },
  removeFieldFab: {
    width: 21,
    height: 21,
    minHeight: 'auto',
    backgroundColor: theme.palette.danger.main,
  },

  formControlLeft: {
    width: '100%',
    margin: '0 ' + theme.spacing.unit * 2 + 'px',
  },
  formControlRight: {
    width: 70,
    marginRight: 10,

    '& input': {
      textAlign: 'right',
    },
  },


  inputFullWidth: {
    width: 'calc(100% - ' + (theme.spacing.unit * 4) + 'px)',
  },

  withoutLabel: {
    marginTop: theme.spacing.unit * 2,
  },

  ButtonWrap: {
    marginBottom: 30,
    marginTop: 20,
  },

  Button: {
    marginLeft: theme.spacing.unit * 2,
  },
});


function Form({classes, loading, onHandleSubmit}) {
  const {enqueueSnackbar} = useSnackbar();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [objectives, setObjectives] = useState([]);
  const [state, setState] = useState({
    assetClasses: {
      /*category1: [{
        id: 0,
        asset_class: '',
        fundamental_value: '',
        relative_value: '',
        mean_reversion: '',
        momentum: ''
      }],
      category2: [...]*/
    },
    objective: '',
  });
  const [fetchedData, setFetchedData] = useState({
    assetClasses: {},
  });

  useEffect(() => {
    fetchInit();
  }, []);


  async function fetchInit() {

    function compareStrings(next, current) {
      let nameA = next.asset_class.toUpperCase();
      let nameB = current.asset_class.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    }

    setFetchLoading(true);

    try {
      const {data:objectives} = await request.get(`${API}enum/IndexSignalObjective/Objective/values`);
      const {data: {returnobject: {asset_classes}}} = await request.get(`${API}alchemistfetcher/indexsignals/assetclasses`);

      const assetClassObj = convertArrayToDictionaryBySelectedKey(asset_classes, 'category');

      assetClassObj.sectors.list.sort(compareStrings);

      setObjectives(objectives);
      setFetchedData({assetClasses: assetClassObj});

      // Define asset class keys as arrays for our state object
      const assetClassesState = {};
      Object.keys(assetClassObj).forEach(assetClassKey => {
        assetClassesState[assetClassKey] = [];
      });
      setState({
        assetClasses: assetClassesState
      });

    } catch (e) {
      console.log(e);
      enqueueSnackbar('Something went wrong, please contact your system administrator', {variant: 'error'});
    }

    setFetchLoading(false);
  }

  function handleChange(event) {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    })
  }

  function handleChangeMultiple(event, category) {
    setState({
      ...state,
      assetClasses: {
        ...state.assetClasses,
        [category]: event.target.value,
      }
    });
  }

  function handleSubmit() {
    // Preparation for backend: Create one single array for asset classes.
    const data = {
      assetClasses: [],
      objective: state.objective,
    };

    Object.keys(state.assetClasses).forEach(assetClassKey => {
      data.assetClasses = data.assetClasses.concat(state.assetClasses[assetClassKey]);
    });

    onHandleSubmit(data);
  }

  function handleReset() {
    const assetClassesState = {};
    Object.keys(fetchedData.assetClasses).forEach(assetClassKey => {
      assetClassesState[assetClassKey] = [];
    });
    setState({
      assetClasses: assetClassesState,
      objective: '',
    });
  }

  //RENDER
  const {assetClasses} = fetchedData;

  return (
    <div className={classes.formContainer}>
      <form autoComplete="off" className={classes.form}>

        <HeadingSideLine title="Select Asset Classes" className={classes.titleSideLine}/>

        <Loader size="small" start={fetchLoading}/>

        <div className={classes.assetsContainer}>
          {Object.keys(state.assetClasses).length > 0 && Object.keys(assetClasses).length > 0
          && Object.keys(assetClasses).map((assetClassKey, key) => (
            <FormControl key={key} className={classnames(classes.formControl, classes.inputFullWidth)}>
              <InputLabel htmlFor="assetClasses">{assetClasses[assetClassKey].name}</InputLabel>
              <Select
                multiple
                name="assetClasses"
                value={state.assetClasses[assetClassKey]}
                onChange={event => handleChangeMultiple(event, assetClassKey)}
                renderValue={selected => (
                  <div className={classes.chips}>
                    {selected.map(value => (
                      <Chip key={value.id} label={value.asset_class} className={classes.chip}/>
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {assetClasses[assetClassKey].list && assetClasses[assetClassKey].list.map((assetClass, key) => (
                  <MenuItem key={'id-' + assetClass.id} value={assetClass}>
                    {assetClass.asset_class}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </div>

        {objectives.length > 0 ?
          <FormControl className={classnames(classes.formControl, classes.inputFullWidth)}>
            <InputLabel>Select the Objective (★)</InputLabel>

            <Select
              native
              name="objective"
              onChange={handleChange}
            >
              <option value=""></option>
              {objectives.map(objective => <option value={objective.name}>{objective.friendlyName}</option>)}
            </Select>
          </FormControl>
          : ''}

        <div className={classes.ButtonWrap}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.Button}
            disabled={loading}
            onClick={handleSubmit}
          >RUN</Button>

          <Button
            variant="contained"
            color="primary"
            className={classes.Button}
            disabled={loading}
            onClick={handleReset}
          >RESET</Button>
        </div>

      </form>

      <PoweredBy/>

    </div>
  );
}

export default withStyles(styles)(Form);