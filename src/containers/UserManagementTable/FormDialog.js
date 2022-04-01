import React from 'react';
import {Button, FormControl, InputLabel, Select, Switch, TextField} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';


const currencies = [
  {value: '€', label: '€'},
  {value: '$', label: '$'},
  {value: '£', label: '£'},
  {value: 'CHF', label: 'CHF'},
];

const style = theme => ({
  formControl: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
  },
  formControlLabel: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
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

  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
});

class UserManagementForm extends React.Component {

  state = this.getInitState();

  getInitState() {
    const {fields} = this.props;

    return fields
      ? fields
      : {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        currency: '',
        country: '',
        organization: '',
        twoFactor: false,
        skipTwoFactor: false,
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
  };

  handleSubmit = () => {
    // todo - validation

    let payload = Object.assign({}, this.state);
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'string') {
        payload[key] = payload[key].trim();
      }
    });

    this.props.onHandleSubmit(payload);
  };

  render() {
    const {
      id,
      email,
      firstName,
      lastName,
      phone,
      currency,
      country,
      organization,
      twoFactor,
      skipTwoFactor,
    } = this.state;

    const {classes, loading, lists} = this.props;

    return (
      <form noValidate autoComplete="off" onSubmit={event => event.preventDefault()}>

        <TextField
          id="email"
          label="Email"
          className={classes.textField}
          type="email"
          value={email}
          disabled={id && email ? true : false}
          onChange={this.handleChange}
          margin="normal"
        />

        <TextField
          id="firstName"
          label="First Name"
          className={classes.textField}
          value={firstName}
          onChange={this.handleChange}
          margin="normal"
        />

        <TextField
          id="lastName"
          label="Last Name"
          className={classes.textField}
          value={lastName}
          onChange={this.handleChange}
          margin="normal"
        />

        <TextField
          id="phone"
          label="Phone"
          className={classes.textField}
          value={phone}
          onChange={this.handleChange}
          margin="normal"
        />

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="country">Country</InputLabel>
          <Select
            native
            id="country"
            name="country"
            value={country}
            onChange={this.handleChange}
          >
            <option value=""/>
            {lists.countries.map((country, i) => <option key={i} value={country.id}>{country.name}</option>)}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="organization">Organization</InputLabel>
          <Select
            native
            id="organization"
            name="organization"
            value={organization}
            onChange={this.handleChange}
          >
            <option value=""/>
            {lists.organizations.map((org, i) => <option key={i} value={org.id}>{org.name}</option>)}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="currency">Currency</InputLabel>
          <Select
            native
            id="currency"
            name="currency"
            value={currency}
            onChange={this.handleChange}
          >
            <option value=""/>
            {currencies.map((currency, i) => <option key={i} value={currency.value}>{currency.label}</option>)}
          </Select>
        </FormControl>


        <FormControlLabel
          className={classes.formControlLabel}
          control={
            <Switch
              id="twoFactor"
              checked={twoFactor}
              onChange={this.handleChange}
              value="true"
              color="secondary"
              disabled={!twoFactor}
            />
          }
          label="Two Factor Authentication"
        />

        {!this.props.isSuperAdmin ?
          <FormControlLabel
            className={classes.formControlLabel}
            control={
              <Switch
                id="skipTwoFactor"
                checked={skipTwoFactor}
                onChange={this.handleChange}
                value="true"
                color="secondary"
              />
            }
            label="Force Login"
          />
          : ''}


        <Button variant="contained" color="secondary" className={classes.button}
                disabled={loading}
                onClick={this.handleSubmit}
        >
          Save
        </Button>

      </form>
    );
  }

}

export default withStyles(style)(UserManagementForm);
