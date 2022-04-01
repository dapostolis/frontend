import React from 'react';
import {Button, FormControl, InputLabel, Select, TextField,} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const categories = [
  {
    label: 'Asset Class',
    value: 'ASSET_CLASS'
  },
  {
    label: 'Sector',
    value: 'SECTOR'
  },
  {
    label: 'Thematic',
    value: 'THEMATIC',
  },
  {
    label: 'Global Macro and Politics',
    value: 'GLOBAL_MACRO_AND_POLITICS',
  },
];

const style = () => ({
  formControl: {
    width: '100%',
    marginTop: '16px',
  },

  textField: {
    width: '100%',
  },

  button: {
    marginTop: 20,
  },

  LinearProgressRoot: {
    position: 'absolute',
    width: '100%',
    height: 5,
  },

});

class TopicTagForm extends React.Component {

  state = this.getInitState();

  _isMounted = true;

  getInitState() {
    const {fields} = this.props;

    return fields
      ? fields
      : {
        id: '',
        tag: '',
        category: '',
      };
  }

  componentDidUpdate() {
    if (!this.props.fields || this.props.fields.id === this.state.id) return;

    this.setState({
      ...this.props.fields
    });
  }

  handleChange = event => {
    const target = event.target,
      {id, type, value, checked} = target;

    // todo - enhance this conditional statement
    let fieldValue = type === 'checkbox' ? checked : value;

    this.setState({[id]: fieldValue});
  }

  handleSubmit = () => {
    // todo - validation

    let payload = Object.assign({}, this.state);
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'string') {
        payload[key] = payload[key].trim();
      }
    });

    this.props.onHandleSubmit(payload);
  }

  render() {
    const {
      tag,
      category,
    } = this.state;

    const {classes, loading} = this.props;

    return (
      <form noValidate autoComplete="off" onSubmit={event => event.preventDefault()}>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="category">Category</InputLabel>
          <Select
            native
            id="category"
            name="category"
            value={category}
            onChange={this.handleChange}
          >
            <option value=""/>
            {categories.map((category, i) => <option key={i} value={category.value}>{category.label}</option>)}
          </Select>
        </FormControl>

        <TextField
          id="tag"
          label="Tag Name"
          className={classes.textField}
          value={tag}
          onChange={this.handleChange}
          margin="normal"
        />



        <Button variant="contained" color="secondary" className={classes.button}
                disabled={loading}
                onClick={this.handleSubmit}
        >
          Save
        </Button>
      </form>
    )
  }

}

export default withStyles(style)(TopicTagForm);
