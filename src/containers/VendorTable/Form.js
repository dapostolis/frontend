import React from 'react';
import {Button, FormControl, InputLabel, Select, TextField,} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const style = theme => ({
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

class VendorForm extends React.Component {

  state = this.getInitState();

  _isMounted = true;

  getInitState() {
    const {fields} = this.props;

    return fields
      ? fields
      : {
        id: '',
        companyName: '',
        contactName: '',
        vendorType: '',
        description: '',
        email: '',
        address: '',
        telephone: ''
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

  handleChangeObjectId = event => {
    let target = event.target,
      {id, value} = target;

    this.setState({
      [id]: {
        id: value
      }
    })
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
      companyName,
      contactName,
      vendorType,
      description,
      email,
      address,
      telephone
    } = this.state;

    const {classes, loading, lists} = this.props;

    return (
      <form noValidate autoComplete="off" onSubmit={event => event.preventDefault()}>

        <TextField
          id="companyName"
          label="Company Name"
          className={classes.textField}
          value={companyName}
          onChange={this.handleChange}
          margin="normal"
        />

        <TextField
          id="contactName"
          label="Contact Name"
          className={classes.textField}
          value={contactName}
          onChange={this.handleChange}
          margin="normal"
        />

        <TextField
          id="vendorType"
          label="Type"
          className={classes.textField}
          value={vendorType}
          onChange={this.handleChange}
          margin="normal"
        />

        <TextField
          id="description"
          label="Small Description"
          className={classes.textField}
          type="text"
          value={description}
          onChange={this.handleChange}
          margin="normal"
        />

        <TextField
          id="email"
          label="Email"
          className={classes.textField}
          type="email"
          value={email}
          onChange={this.handleChange}
          margin="normal"
        />

        <TextField
          id="address"
          label="Address"
          className={classes.textField}
          value={address}
          onChange={this.handleChange}
          margin="normal"
        />

        <TextField
          id="telephone"
          label="Telephone"
          className={classes.textField}
          value={telephone}
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

export default withStyles(style)(VendorForm);
