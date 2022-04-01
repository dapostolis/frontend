import React from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import ButtonDanger from '../../components/ButtonDanger';
import ButtonSafe from '../../components/ButtonSafe';


const style = theme => ({
  formControl: {
    width: '100%',
    marginTop: '16px',
  },

  formControlMulti: {
    margin: theme.spacing.unit,
    // minWidth: 120,
    // maxWidth: 300,
    display: 'block',
    width: '100%',
    marginTop: 15,
  },

  textField: {
    width: '100%',
  },

  button: {
    marginTop: 20,
    marginRight: 10,
  },

  LinearProgressRoot: {
    position: 'absolute',
    width: '100%',
    height: 5,
  },

  uploadImg: {
    width: 220,
    marginTop: 10,
    padding: 5,
    border: '1px solid ' + theme.palette.primary.main,
  },

  topicText: {
    '& textarea': {
      fontSize: 14,
      width: 370,
      height: 210,
    }
  },
});

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

class TopicForm extends React.Component {

  fileInput = React.createRef();

  state = this.getInitState();

  getInitState() {
    const {fields} = this.props;

    return fields
      ? fields
      : {
        id: '',
        title: '',
        text: '',
        assetClass: [],
        sector: [],
        thematic: [],
        globalMacroAndPolitics: [],
        contentURL: '',
        status: '',
      };
  }

  componentDidUpdate() {
    if (!this.props.fields || this.props.fields.id === this.state.id) return;

    this.setState({
      ...this.props.fields
    });
  }

  // regular handleChange
  handleChange = event => {
    const target = event.target,
      {id, value} = target;

    this.setState({[id]: value});
  }

  handleChangeMultiSelect = ({target: {value}}, key) => this.setState({[key]: value});

  handleSubmit = revision => {
    let payload = Object.assign({}, this.state);
    /*let payload = Object.assign({}, this.state);
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'string') {
        payload[key] = payload[key].trim();
      }
    });*/


    this.props.onHandleSubmit(revision, payload, this.fileInput.current);
  }

  handleClickChangeStatus = async (id) => {
    this.props.onHandleClickChangeStatus(id);
  }

  render() {
    const {
      id,
      title,
      text,
      assetClass,
      sector,
      thematic,
      globalMacroAndPolitics,
      contentURL,
      status,
    } = this.state;

    const {classes, loading, lists} = this.props;

    return (
      <form noValidate autoComplete="off" onSubmit={event => event.preventDefault()}>

        <TextField
          id="title"
          fullWidth
          label="Title"
          value={title}
          onChange={this.handleChange}
          margin="normal"
        />

        <TextField
          id="text"
          multiline
          rows="4"
          fullWidth
          label="Text"
          value={text}
          onChange={this.handleChange}
          margin="normal"
          className={classes.topicText}
        />

        {/*File upload*/}
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="file-upload" shrink={true}>Upload topic file</InputLabel>
          <Input
            inputRef={this.fileInput}
            id="file-upload"
            type="file"
          />
          <FormHelperText>Please use file 370x235 and size up to 1Mb.</FormHelperText>

          {contentURL
            ? <div className={classes.uploadImg}>
              <img src={contentURL} width="200" alt="topic-image"/>
            </div>
            : ''}
        </FormControl>

        {/*Multi autocomplete fields*/}
        <FormControl className={classes.formControlMulti} disabled={!lists.topicTags['ASSET_CLASS'] || lists.topicTags['ASSET_CLASS'].length === 0}>
          <InputLabel htmlFor="asset-classes">Asset Classes</InputLabel>
          <Select
            multiple
            id="asset-classes"
            value={assetClass}
            onChange={event => this.handleChangeMultiSelect(event, 'assetClass')}
            input={<Input style={{minWidth: 130}}/>}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {lists.topicTags['ASSET_CLASS'] && Array.isArray(lists.topicTags['ASSET_CLASS']) && lists.topicTags['ASSET_CLASS'].map(ac => (
              <MenuItem key={ac.id} value={ac.tag}>
                <Checkbox checked={ac.tag && assetClass.indexOf(ac.tag) > -1} />
                <ListItemText primary={ac.tag}/>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classes.formControlMulti} disabled={!lists.topicTags['SECTOR'] || lists.topicTags['SECTOR'].length === 0}>
          <InputLabel htmlFor="sectors">Sectors</InputLabel>
          <Select
            multiple
            id="sectors"
            value={sector}
            onChange={event => this.handleChangeMultiSelect(event, 'sector')}
            input={<Input style={{minWidth: 80}}/>}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {lists.topicTags['SECTOR'] && Array.isArray(lists.topicTags['SECTOR']) && lists.topicTags['SECTOR'].map(s => {
              // console.log(s);
              return (
                <MenuItem key={s.id} value={s.tag}>
                  <Checkbox checked={s.tag && sector.indexOf(s.tag) > -1} />
                  <ListItemText primary={s.tag}/>
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <FormControl className={classes.formControlMulti} disabled={!lists.topicTags['THEMATIC'] || lists.topicTags['THEMATIC'].length === 0}>
          <InputLabel htmlFor="thematics">Thematics</InputLabel>
          <Select
            multiple
            value={thematic}
            onChange={event => this.handleChangeMultiSelect(event, 'thematic')}
            input={<Input id="thematic" style={{minWidth: 100}}/>}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {lists.topicTags['THEMATIC'] && Array.isArray(lists.topicTags['THEMATIC']) && lists.topicTags['THEMATIC'].map(t => (
              <MenuItem key={t.id} value={t.tag}>
                <Checkbox checked={t.tag && thematic.indexOf(t.tag) > -1}/>
                <ListItemText primary={t.tag}/> {/*label*/}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classes.formControlMulti} disabled={!lists.topicTags['GLOBAL_MACRO_AND_POLITICS'] || lists.topicTags['GLOBAL_MACRO_AND_POLITICS'].length === 0}>
          <InputLabel htmlFor="globalMacro">Global Macro and Politics</InputLabel>
          <Select
            multiple
            value={globalMacroAndPolitics}
            onChange={event => this.handleChangeMultiSelect(event, 'globalMacroAndPolitics')}
            input={<Input id="globalMacro" style={{minWidth: 210}}/>}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {lists.topicTags['GLOBAL_MACRO_AND_POLITICS'] && Array.isArray(lists.topicTags['GLOBAL_MACRO_AND_POLITICS'])
              && lists.topicTags['GLOBAL_MACRO_AND_POLITICS'].map(globalMacro => (
                <MenuItem key={globalMacro.id} value={globalMacro.tag}>
                  <Checkbox checked={globalMacroAndPolitics && globalMacroAndPolitics.indexOf(globalMacro.tag) > -1}/>
                  <ListItemText primary={globalMacro.tag}/>
                </MenuItem>

              ))}
          </Select>
        </FormControl>


        <Button variant="contained" color="secondary" className={classes.button}
                disabled={loading}
                onClick={() => this.handleSubmit(false)}
        >
          Save
        </Button>

        <Button variant="contained" color="secondary" className={classes.button}
                disabled={loading}
                onClick={() => this.handleSubmit(true)}
        >
          Save as Revision
        </Button>

        {/*<Button variant="contained" className={classNames(classes.button, classes.danger)}
                disabled={loading}
                onClick={() => alert(1)}
        >
          Deactivate
        </Button>*/}

        {id ?
          [(status === 'ACTIVE'
            ? <ButtonDanger key={'btn-1'} className={classes.button} onClick={() => this.handleClickChangeStatus(id)}>DEACTIVATE</ButtonDanger>
            : <ButtonSafe key={'btn-2'} className={classes.button} onClick={() => this.handleClickChangeStatus(id)}>ACTIVATE</ButtonSafe>)]
          : ''}


      </form>
    )
  }

}

export default withStyles(style)(TopicForm);
