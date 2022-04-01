import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
  Checkbox
} from '@material-ui/core';
import classnames from 'classnames';
import HeadingSideLine from 'components/HeadingSideLine';
import Chip from '@material-ui/core/Chip';
import InfoBox from '../../components/InfoBox';
import ListItemText from '@material-ui/core/ListItemText';
import {Clear as ClearIcon} from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';
import Loader from 'components/LoaderCircle';


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
  form: {
    position: 'sticky',
    height: 'calc(100vh - 90px)',
    top: 64,
    overflowY: 'auto',
    paddingTop: 10,
  },

  alModeContainer: {
    textAlign: 'center',
    padding: theme.spacing.unit,
    borderTop: '1px solid ' + theme.palette.primary.main,
    borderBottom: '1px solid ' + theme.palette.primary.main,
  },
  alModeInfoBox: {
    fontSize: 13,
  },

  flat: {
    boxShadow: 'none',
  },
  smallFieldFab: {
    width: 21,
    height: 21,
    minHeight: 'auto',
  },
  smallFieldIcon: {
    width: 15,
    height: 15,
  },

  gapContainer: {
    position: 'relative',
    margin: `15px ${theme.spacing.unit * 2}px 0 ${theme.spacing.unit * 2}px`,
    '&.disabled': {
      cursor: 'no-drop',
      opacity: 0.5,
    },
  },

  inlineFieldWrap: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 2,
    padding: 8,
    paddingTop: 2,
    border: '1px dotted ' + theme.palette.primary.main,
  },

  titleSideLine: {
    fontSize: 14,
    margin: '20px 0 10px 0',
  },

  formControl: {
    // marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    // marginLeft: theme.spacing.unit * 2,
  },

  formControlLeft: {
    width: '100%',
    // margin: '0 ' + theme.spacing.unit * 2 + 'px',
    marginRight: theme.spacing.unit * 2,
  },
  formControlRight: {
    width: 70,
    // marginRight: 10,
    marginRight: theme.spacing.unit * 2,

    '& input': {
      textAlign: 'right',
    },
    '& input[disabled]': {
      cursor: 'no-drop',
    },
    '&.disabled': {
      opacity: 0.5,
    },
  },

  inputFullWidth: {
    width: '100%',
  },

  withoutLabel: {
    marginTop: theme.spacing.unit * 2,
  },

  // multiSelect: {
  //   backgroundColor: '#fafafa',
  //   paddingLeft: 3,
  // },

  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    height: 20,
    margin: theme.spacing.unit / 4,
  },

  checkboxControl: {
    display: 'flex',
    alignItems: 'center',
  },

  ButtonWrap: {
    // marginBottom: 30,
    marginTop: 20,
  },
  floatButtonWrap: {
    // position: 'fixed',
    position: 'sticky',
    // bottom: 15,
    bottom: 0,
    width: 350,
    padding: '20px 0',
    // borderTop: '1px solid ' + theme.palette.primary.light,
    backgroundColor: 'white',
  },
  Button: {
    marginLeft: theme.spacing.unit * 2,
  },

  loaderCircle: {
    top: 40,
    left: 0,
  },
});

function Form({
                classes,
                STATIC_LISTS,
                input,
                unlockWeight,
                fields,
                fetchLoading,
                loading,
                alchemistMode,
                handleChangeAlchemistMode,
                handleChange,
                handleChangeFields,
                handleChangeFieldWeight,
                handleChangeMultiple,
                handleChangeStocks,
                handleSubmit,
                handleReset,
                handleClickResetFields,
                handleChangeSelectAlchemist,
              }) {

  //RENDER
  let allMarketCapAreSelected = STATIC_LISTS.market_cap.length === input.market_cap.length;
  let allRegionsAreSelected = STATIC_LISTS.regions.length === input.regions.length;
  let allSectorsAreSelected = STATIC_LISTS.sectors.length === input.sectors.length;

  return (
    <form autoComplete="off" className={classes.form}>

      <div className={classes.alModeContainer}>
        <InputLabel htmlFor="alchemist-mode">alchemist mode</InputLabel>
        <Checkbox
          id="alchemist-mode"
          checked={alchemistMode}
          onChange={handleChangeAlchemistMode}
        />
        <InfoBox type="neutral" show={alchemistMode} className={classes.alModeInfoBox}>
          Click run and alchemist will find the optimal factor combinations for your inputs
        </InfoBox>
      </div>

      <div className={classes.gapContainer}>

        <HeadingSideLine title="User Inputs" className={classes.titleSideLine}/>

        <FormControl className={classnames(classes.formControl, classes.inputFullWidth)}>
          <InputLabel htmlFor="n">Stocks</InputLabel>
          <Input
            type="number"
            id="n"
            name="n"
            min="1"
            max="30"
            value={input.n}
            onChange={handleChangeStocks}
          />
          <FormHelperText>Maximum number 30</FormHelperText>
        </FormControl>


        <FormControl className={classnames(classes.formControl, classes.inputFullWidth)}>
          <InputLabel htmlFor="frequency">Rebalancing Frequency</InputLabel>
          <Select
            native
            id="frequency"
            name="frequency"
            value={input.frequency}
            onChange={handleChange}
          >
            <option value=""></option>
            {STATIC_LISTS.frequency.map((freq, key) => <option key={key} value={freq.value}>{freq.name}</option>)}
          </Select>
        </FormControl>


        <FormControl className={classnames(classes.formControl, classes.inputFullWidth)}>
          <InputLabel htmlFor="ref_currency">Reference Currency</InputLabel>
          <Select
            native
            id="ref_currency"
            name="ref_currency"
            value={input.ref_currency}
            onChange={handleChange}
          >
            <option value=""></option>
            {STATIC_LISTS.ref_currency.map((currency, key) => <option key={key}
                                                                      value={currency.value}>{currency.name}</option>)}
          </Select>
        </FormControl>

        <div style={{display: 'flex'}}>
          <div className={classes.checkboxControl}>
            <InputLabel htmlFor="esg" className={classes.label}>ESG</InputLabel>
            <Checkbox
              id="esg"
              checked={input.esg}
              onChange={handleChange}
            />
          </div>

          <div className={classes.checkboxControl}>
            <InputLabel htmlFor="hedged" className={classes.label}>Hedged</InputLabel>
            <Checkbox
              id="hedged"
              checked={input.hedged}
              onChange={handleChange}
            />
          </div>

          <div className={classes.checkboxControl}>
            <InputLabel htmlFor="shariah" className={classes.label}>Shariah</InputLabel>
            <Checkbox
              id="shariah"
              checked={input.shariah}
              onChange={handleChange}
            />
          </div>
        </div>

        <FormControl className={classnames(classes.formControl, classes.inputFullWidth)} disabled={input.esg || (input.shariah && alchemistMode)}>
          <InputLabel htmlFor="market_cap">Market Cap</InputLabel>
          {!alchemistMode && window.Array.isArray(input.market_cap) ?
            <Select
              multiple
              name="market_cap"
              value={input.market_cap}
              onChange={handleChangeMultiple}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map(marketCap => {
                    if (allMarketCapAreSelected && marketCap.value !== 'all') return '';

                    return (
                      <Chip key={marketCap.value} label={marketCap.name} className={classes.chip}/>
                    );
                  })}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {STATIC_LISTS.market_cap.map((mcap, key) => (
                <MenuItem key={key} value={mcap} disabled={input.esg || (input.shariah && alchemistMode)}>
                  <Checkbox checked={input.market_cap.map(inputMcap => inputMcap.name).indexOf(mcap.name) > -1}/>
                  {mcap.name}
                </MenuItem>
              ))}
            </Select>
            :
            <Select
              native
              id="market_cap"
              name="market_cap"
              value={input.market_cap}
              onChange={handleChangeSelectAlchemist}
            >
              <option value=""></option>
              {STATIC_LISTS.market_cap.map((mcap, key) => (
                <option key={key} value={mcap.value}>{mcap.name}</option>
              ))}
            </Select>
          }
        </FormControl>

        <FormControl className={classnames(classes.formControl, classes.inputFullWidth)} disabled={input.esg || (input.shariah && alchemistMode)}>
          <InputLabel htmlFor="regions">Regions</InputLabel>
          {!alchemistMode && window.Array.isArray(input.regions) ?
            <Select
              multiple
              name="regions"
              value={input.regions}
              onChange={handleChangeMultiple}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map(region => {
                    if (allRegionsAreSelected && region.value !== 'world') return '';

                    return (
                      <Chip key={region.value} label={region.name} className={classes.chip}/>
                    );
                  })}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {STATIC_LISTS.regions.map((region, key) => (
                <MenuItem key={key} value={region} disabled={input.esg || (input.shariah && alchemistMode)}>
                  <Checkbox checked={input.regions.map(inputRegion => inputRegion.name).indexOf(region.name) > -1}/>
                  <ListItemText primary={region.name}/>
                </MenuItem>
              ))}
            </Select>
            :
            <Select
              native
              id="regions"
              name="regions"
              value={input.regions}
              onChange={handleChangeSelectAlchemist}
            >
              <option value=""></option>
              {STATIC_LISTS.regions.map((region, key) => (
                <option key={key} value={region.value}>{region.name}</option>
              ))}
            </Select>
          }
        </FormControl>


        <FormControl className={classnames(classes.formControl, classes.inputFullWidth)} disabled={input.esg || (input.shariah && alchemistMode)}>
          <InputLabel disabled={input.esg || (input.shariah && alchemistMode)} htmlFor="sectors">Sectors</InputLabel>
          {!alchemistMode && window.Array.isArray(input.sectors) ?
            <Select
              multiple
              name="sectors"
              value={input.sectors}
              onChange={handleChangeMultiple}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map(sector => {
                    if (allSectorsAreSelected && sector.value !== 'all') return '';

                    return (
                      <Chip key={sector.value} label={sector.name} className={classes.chip}/>
                    );
                  })}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {STATIC_LISTS.sectors.map((sector, key) => (
                <MenuItem key={key} value={sector}>
                  <Checkbox checked={input.sectors.map(inputSector => inputSector.name).indexOf(sector.name) > -1}/>
                  {sector.name}
                </MenuItem>
              ))}
            </Select>
            :
            <Select
              native
              id="sectors"
              name="sectors"
              value={input.sectors}
              onChange={handleChangeSelectAlchemist}
            >
              <option value=""></option>
              {STATIC_LISTS.sectors.map((sector, key) => (
                <option key={key} value={sector.value}>{sector.name}</option>
              ))}
            </Select>
          }
        </FormControl>

      </div>


      <div className={classnames(classes.gapContainer, {'disabled': alchemistMode})} style={{minHeight: 100}}>

        <HeadingSideLine title="Factors & Fields" className={classes.titleSideLine}/>

        <Loader size="small" start={fetchLoading} className={classes.loaderCircle}/>

        {!fetchLoading && JSON.stringify(fields) !== '{}' && Object.keys(fields).map(cat => (
          <div key={cat} className={classes.inlineFieldWrap}>
            <FormControl className={classnames(classes.formControlLeft)} disabled={alchemistMode}>
              <InputLabel htmlFor={cat}>{fields[cat].friendlyName}</InputLabel>
              <Select
                multiple
                name={cat}
                value={input.factors[cat].fields}
                onChange={handleChangeFields}
                // className={classes.multiSelect}
                renderValue={selected => (
                  <div className={classes.chips}>
                    {selected.map(factor => {
                      if (factor) {
                        return (
                          <Chip key={factor.id} label={factor.name} className={classes.chip}/>
                        )
                      }
                    })}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {fields[cat].list.map(fd => (
                  <MenuItem key={fd.id} value={fd}>
                    {fd.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl disabled={input.factors[cat].fields.length === 0 || !unlockWeight}
                         className={classnames(classes.formControlRight, {disabled: input.factors[cat].fields.length === 0 || !unlockWeight})}
            >
              {/*<InputLabel id={cat + '-weight'}></InputLabel>*/}
              <Input
                name={cat + '-weight'}
                id={cat + '-weight'}
                value={input.factors[cat].weight}
                onChange={handleChangeFieldWeight}
                aria-describedby="weight-helper-text"
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                inputProps={{
                  'aria-label': 'Weight',
                  disabled: input.factors[cat].fields.length === 0 || !unlockWeight,
                }}
              />
              <FormHelperText id="weight-helper-text">Weight</FormHelperText>
            </FormControl>

            <div style={{marginTop: 6}}>
              <Fab size="small" aria-label="Reset" className={classnames(classes.smallFieldFab, classes.flat)}
                   disabled={input.factors[cat].fields.length === 0}
                   onClick={() => handleClickResetFields(cat)}
              >
                <ClearIcon className={classes.smallFieldIcon}/>
              </Fab>
            </div>
          </div>
        ))}
      </div>


      <div className={classnames(classes.ButtonWrap, classes.floatButtonWrap)}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.Button}
          disabled={loading}
          onClick={event => handleSubmit(event, alchemistMode)}
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
  )
}

export default withStyles(styles)(Form)
