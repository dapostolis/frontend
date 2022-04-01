import React from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';


const style = theme => ({
  fieldgroup: {
    border: '2px solid ' + theme.palette.primary.light,
    marginTop: 16,
    padding: '0 15px 15px 15px',
  },

  formControl: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
  },

  checkboxControl: {
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

});

function NumberFormatCustom(props) {
  const {inputRef, onChange, ...other} = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        console.log(values);
        onChange({
          target: {
            value: values,
          },
        });
      }}
      thousandSeparator
    />
  );
}


class PrivateMarketForm extends React.Component {

  fileInput = React.createRef();

  state = this.getInitState();

  // _isMounted = true;

  getInitState() {
    const {fields} = this.props;

    return fields
      ? fields
      : {
        id: '',
        title: '',
        description: '',
        module: {
          id: '',
        },
        subType: '',
        region: '',
        country: {
          id: '',
        },
        sector: '',
        price: '',
        priceInfo: '',
        minimumTicket: '',
        minimumTicketInfo: '',
        deadline: '',
        round: '',
        pmYield: '',
        vendor: {
          id: '',
        },
        endorsedBy: '',
        published: false,
      };
  }

  componentDidUpdate() {
    if (!this.props.fields || this.props.fields.id === this.state.id) return;

    this.setState({
      ...this.props.fields,
    });
  }

  handleChange = event => {
    const target = event.target,
      {id, type, value, checked} = target;

    // todo - enhance this conditional statement
    let fieldValue = type === 'checkbox' ? checked : value;

    this.setState({[id]: fieldValue});
  };

  handleChangeFormatted = name => event => {
    console.log(event);
    this.setState({
      [name]: event.target.value.floatValue,
    });
  };

  handleChangeObjectId = event => {
    let target = event.target;

    this.setState({
      [target.id]: {
        id: target.value,
      },
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    let payload = Object.assign({}, this.state);
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'string') {
        payload[key] = payload[key].trim();
      }
    });

    this.props.onHandleSubmit(payload, this.fileInput.current);
  };

  render() {
    const {
      id,
      title,
      description,
      module,
      subType,
      region,
      country,
      sector,
      price,
      priceInfo,
      minimumTicket,
      minimumTicketInfo,
      deadline,
      round,
      pmYield,
      vendor,
      endorsedBy,
      published,
    } = this.state;

    const {classes, loading, lists} = this.props;

    return (
      <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>

        <TextField
          id="title"
          label="Title"
          className={classes.textField}
          value={title}
          onChange={this.handleChange}
          margin="normal"
        />

        <TextField
          id="description"
          multiline
          rows="4"
          fullWidth
          label="Description"
          value={description}
          onChange={this.handleChange}
          margin="normal"
        />

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="type">Module</InputLabel>
          <Select
            native
            id="module"
            name="module"
            value={module.id}
            onChange={this.handleChangeObjectId}
          >
            <option value=""/>
            {lists.modules.map((module, i) => <option key={i} value={module.id}>{module.name}</option>)}
          </Select>
        </FormControl>

        <TextField
          id="subType"
          label="SubType"
          className={classes.textField}
          value={subType}
          onChange={this.handleChange}
          margin="normal"
        />

        <TextField
          id="region"
          label="Region"
          className={classes.textField}
          value={region}
          onChange={this.handleChange}
          margin="normal"
        />

        <TextField
          id="sector"
          label="Sector"
          className={classes.textField}
          value={sector}
          onChange={this.handleChange}
          margin="normal"
        />

        <fieldset className={classes.fieldgroup}>
          <legend><Typography component="div">Investment</Typography></legend>

          <TextField
            id="price"
            label="Value"
            className={classes.textField}
            value={price}
            onChange={this.handleChangeFormatted('price')}
            margin="normal"
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
          />

          <TextField
            id="priceInfo"
            label="Currency"
            className={classes.textField}
            value={priceInfo}
            onChange={this.handleChange}
            margin="normal"
            helperText="Example: €"
          />
        </fieldset>

        <fieldset className={classes.fieldgroup}>
          <legend><Typography component="div">Minimum Ticket</Typography></legend>
          <TextField
            id="minimumTicket"
            label="Value"
            className={classes.textField}
            value={minimumTicket}
            onChange={this.handleChangeFormatted('minimumTicket')}
            margin="normal"
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
          />

          <TextField
            id="minimumTicketInfo"
            label="Currency"
            className={classes.textField}
            value={minimumTicketInfo}
            onChange={this.handleChange}
            margin="normal"
            helperText="Example: €"
          />
        </fieldset>

        <TextField
          id="deadline"
          label="Deadline"
          className={classes.textField}
          type="date"
          value={deadline}
          onChange={this.handleChange}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          id="round"
          label="Round"
          className={classes.textField}
          value={round}
          onChange={this.handleChange}
          margin="normal"
        />

        <TextField
          id="pmYield"
          label="Yield"
          className={classes.textField}
          value={pmYield}
          onChange={this.handleChange}
          margin="normal"
        />

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="country">Country</InputLabel>
          <Select
            native
            id="country"
            name="country"
            value={country.id}
            onChange={this.handleChangeObjectId}
          >
            <option value=""/>
            {lists.countries.map((country, i) => <option key={i} value={country.id}>{country.name}</option>)}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="vendor">Vendor</InputLabel>
          <Select
            native
            id="vendor"
            name="vendor"
            value={vendor.id}
            onChange={this.handleChangeObjectId}
          >
            <option value=""/>
            {lists.vendors.map((vendor, i) => <option key={i} value={vendor.id}>{vendor.companyName}</option>)}
          </Select>
        </FormControl>

        <TextField
          id="endorsedBy"
          label="Endorsed By"
          className={classes.textField}
          value={endorsedBy}
          onChange={this.handleChange}
          margin="normal"
        />

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="file-upload"
                      shrink={true}>{id ? 'Upload new Deal file' : 'Upload Deal file'}</InputLabel>
          <Input
            inputRef={this.fileInput}
            id="file-upload"
            type="file"
          />
          {/*<FormHelperText>Please use file 200x200 and size up to 2Mb.</FormHelperText>*/}

          {/*{logoUrl
            ? <div className={classes.logoWrap}>
              <img src={logoUrl} width="200"/>
            </div>
            : ''}*/}
        </FormControl>

        <div className={classes.checkboxControl}>
          <InputLabel htmlFor="combo" className={classes.label}>Publish Content</InputLabel>
          <Checkbox
            id="published"
            checked={published}
            onChange={this.handleChange}
            className={classes.checkbox}
          />
        </div>

        <Button type="submit"
                variant="contained"
                color="secondary"
                className={classes.button}
                disabled={loading}
        >
          Save
        </Button>

      </form>
    );
  }

}

export default withStyles(style)(PrivateMarketForm);
