import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';


// Properties applied to the Menu element inside Multi Select field
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

const styles = () => ({
  formControlMulti: {
    width: '100%',
    marginRight: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 15,
    marginRight: 10,
  },
});

function FilterForm({classes, searchLoading, list, filters, onHandleChangeMultiSelect, onHandleReset, onHandleSearch}) {
  return (
    <form noValidate autoComplete="off" onSubmit={event => event.preventDefault()}>

      <div style={{display: 'flex'}}>
        <FormControl className={classes.formControlMulti}
                     disabled={!list.topicTags['ASSET_CLASS'] || list.topicTags['ASSET_CLASS'].length === 0}>
          <InputLabel htmlFor="asset-classes">Asset Classes</InputLabel>
          <Select
            multiple
            id="asset-classes"
            value={filters.ASSET_CLASS}
            onChange={event => onHandleChangeMultiSelect(event, 'ASSET_CLASS')}
            input={<Input style={{minWidth: 130}}/>}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
            classes={{disabled: classes.disabled}}
          >
            {list.topicTags['ASSET_CLASS'] && Array.isArray(list.topicTags['ASSET_CLASS']) && list.topicTags['ASSET_CLASS'].map(ac => (
              <MenuItem key={ac.id} value={ac.tag}>
                <Checkbox checked={filters.ASSET_CLASS.indexOf(ac.tag) > -1}/>
                <ListItemText primary={ac.tag}/>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classes.formControlMulti}
                     disabled={!list.topicTags['SECTOR'] || list.topicTags['SECTOR'].length === 0}>
          <InputLabel htmlFor="sectors">Sectors</InputLabel>
          <Select
            multiple
            id="sectors"
            value={filters.SECTOR}
            onChange={event => onHandleChangeMultiSelect(event, 'SECTOR')}
            input={<Input style={{minWidth: 80}}/>}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
            classes={{disabled: classes.disabled}}
          >
            {list.topicTags['SECTOR'] && Array.isArray(list.topicTags['SECTOR']) && list.topicTags['SECTOR'].map(s => (
              <MenuItem key={s.id} value={s.tag}>
                <Checkbox checked={filters.SECTOR.indexOf(s.tag) > -1}/>
                <ListItemText primary={s.tag}/>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classes.formControlMulti}
                     disabled={!list.topicTags['THEMATIC'] || list.topicTags['THEMATIC'].length === 0}>
          <InputLabel htmlFor="thematics">Thematics</InputLabel>
          <Select
            multiple
            value={filters.THEMATIC}
            onChange={event => onHandleChangeMultiSelect(event, 'THEMATIC')}
            input={<Input id="thematic" style={{minWidth: 100}}/>}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
            classes={{disabled: classes.disabled}}
          >
            {list.topicTags['THEMATIC'] && Array.isArray(list.topicTags['THEMATIC']) && list.topicTags['THEMATIC'].map(t => (
              <MenuItem key={t.id} value={t.tag}>
                <Checkbox checked={filters.THEMATIC.indexOf(t.tag) > -1}/>
                <ListItemText primary={t.tag}/>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classes.formControlMulti}
                     disabled={!list.topicTags['GLOBAL_MACRO_AND_POLITICS'] || list.topicTags['GLOBAL_MACRO_AND_POLITICS'].length === 0}>
          <InputLabel htmlFor="globalMacro">Global Macro and Politics</InputLabel>
          <Select
            multiple
            value={filters.GLOBAL_MACRO_AND_POLITICS}
            onChange={event => onHandleChangeMultiSelect(event, 'GLOBAL_MACRO_AND_POLITICS')}
            input={<Input id="globalMacro" style={{minWidth: 210}}/>}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
            classes={{disabled: classes.disabled}}
          >
            {list.topicTags['GLOBAL_MACRO_AND_POLITICS'] && Array.isArray(list.topicTags['GLOBAL_MACRO_AND_POLITICS'])
            && list.topicTags['GLOBAL_MACRO_AND_POLITICS'].map(globalMacro => (

              <MenuItem key={globalMacro.id} value={globalMacro.tag}>
                <Checkbox checked={filters.GLOBAL_MACRO_AND_POLITICS.indexOf(globalMacro.tag) > -1}/>
                <ListItemText primary={globalMacro.tag}/>
              </MenuItem>

            ))}
          </Select>
        </FormControl>
      </div>


      <Button variant="contained" color="secondary" className={classes.button}
              disabled={searchLoading}
              size="small"
              onClick={onHandleSearch}
      >
        Search Topics
      </Button>
      <Button variant="contained" color="secondary" className={classes.button}
              disabled={searchLoading}
              size="small"
              onClick={onHandleReset}
      >
        Reset
      </Button>

    </form>
  )
}

export default withStyles(styles)(FilterForm);