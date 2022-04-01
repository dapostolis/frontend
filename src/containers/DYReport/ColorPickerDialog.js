import React, {useEffect, useState} from 'react';
import {SketchPicker} from 'react-color';
import {withStyles} from '@material-ui/core/styles';
import {Button, Dialog, DialogContent, DialogTitle} from '@material-ui/core';

const styles = () => ({
  buttonWrap: {
    // position: 'absolute',
    // bottom: 0,
    // width: 'calc(100% - 45px)',
    // backgroundColor: 'white',
    // paddingBottom: 20,
  },
  button: {
    marginTop: 20,
    marginRight: 15,
  },
});

function ColorPickerDialog({classes, isOpened, bgColorState, bgColorSaved, onToggleColorPickerDialog, onHandleChangeBgColor, onHandleSaveBgColor}) {
  const [bgColor, setBgColor] = useState(bgColorState);

  useEffect(() => {
    setBgColor(bgColorState);
  }, [bgColorState]);

  function handleClose() {
    onToggleColorPickerDialog();
    onHandleChangeBgColor(bgColorSaved);
  }

  function handleChangeColor(color) {
    setBgColor(color.hex);
    onHandleChangeBgColor(color.hex);
  }

  return (
    <Dialog classes={{paperScrollPaper: classes.paperScrollPaper}} open={isOpened} onClose={handleClose}>
      <DialogTitle>Change Background Color</DialogTitle>

      <DialogContent>

        <SketchPicker
          width={250}
          color={bgColor}
          onChangeComplete={handleChangeColor}
        />

        <div className={classes.buttonWrap}>
          <Button variant="contained" color="secondary" className={classes.button}
                  onClick={onHandleSaveBgColor}>
            Change Color
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  )
}

export default withStyles(styles)(ColorPickerDialog);