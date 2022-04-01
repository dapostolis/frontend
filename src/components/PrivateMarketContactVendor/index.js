import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Button} from '@material-ui/core';
import LoaderLine from 'components/LoaderLine';


const styles = () => ({
  textField: {
    width: '100%',
  },

  button: {
    marginTop: 20,
  },
});

function PrivateMarketContactVendor({classes, vendor, onToggleVendor, onHandleSubmitContactVendor}) {

  const [message, setMessage] = useState('');
  // const [isOpened, setIsOpened] = useState(false);

  // function toggleForm() {
  //   setIsOpened(!isOpened);
  // }

  function handleChange(event) {
    const target = event.target;
    setMessage(target.value);
  }

  function handleSubmit() {
    onHandleSubmitContactVendor(message);
  }

  return (

    <Dialog fullWidth maxWidth="sm" open={vendor.isFormOpened} onClose={onToggleVendor}>
      <LoaderLine start={vendor.loading}/>

      <DialogTitle>
        Contact Vendor
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Submit this form to contact <strong>{vendor.privateMarket.vendor && vendor.privateMarket.vendor.companyName}</strong>
        </DialogContentText>

        <form noValidate autoComplete="off" onSubmit={event => event.preventDefault()}>

          <TextField
            id="message"
            multiline
            rows="4"
            fullWidth
            label="Message"
            value={message}
            onChange={handleChange}
            margin="normal"
          />


          <Button variant="contained" color="secondary" className={classes.button}
            disabled={vendor.loading}
            onClick={handleSubmit}
          >
            Submit
          </Button>

        </form>

      </DialogContent>
    </Dialog>


  )
}

export default withStyles(styles)(PrivateMarketContactVendor);