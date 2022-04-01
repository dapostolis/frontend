import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';
import {Grade as CheckCircleIcon} from '@material-ui/icons';


const styles = theme => ({
  checkCircleIcon: {
    fontSize: 19,
    position: 'absolute',
    top: 2,
    left: 2,
    color: 'white',
    padding: 2,
    backgroundColor: '#343434',
    borderRadius: 10,
  },

  coloredBtn: {
    textAlign: 'center',
    whiteSpace: 'nowrap',
    color: theme.palette.getContrastText(theme.palette.primary.main),
    position: 'relative',
    cursor: 'pointer',
    height: 45,
    padding: '15px 10px 0px 10px',
    backgroundColor: theme.palette.primary.main,
    opacity: 0.85,
    borderRadius: 6,
    transition: 'opacity 0.4s',

    '&:hover': {
      opacity: 1,
    },

    '&.selected': {
      border: '3px solid ' + theme.palette.secondary.main,
      paddingTop: 12,
    },

    '&.dangerL': {
      color: theme.palette.getContrastText(theme.palette.danger.light),
      backgroundColor: theme.palette.danger.light,
    },
    '&.dangerM': {
      color: theme.palette.getContrastText(theme.palette.danger.semi),
      backgroundColor: theme.palette.danger.semi,
    },
    '&.dangerH': {
      color: theme.palette.getContrastText(theme.palette.danger.main),
      backgroundColor: theme.palette.danger.main,
    },
    '&.dangerVH': {
      color: theme.palette.getContrastText(theme.palette.danger.dark),
      backgroundColor: theme.palette.danger.dark,
    },

    '&.successL': {
      color: theme.palette.getContrastText(theme.palette.safe.light),
      backgroundColor: theme.palette.safe.light,
    },
    '&.successM': {
      color: theme.palette.getContrastText(theme.palette.safe.semi),
      backgroundColor: theme.palette.safe.semi,
    },
    '&.successH': {
      color: theme.palette.getContrastText(theme.palette.safe.main),
      backgroundColor: theme.palette.safe.main,
    },
    '&.successVH': {
      color: theme.palette.getContrastText(theme.palette.safe.dark),
      backgroundColor: theme.palette.safe.dark,
    },
  },
});

function calculateColor(value) {
  // ranges
  // '0-0.2499, 0.25-0.499, 0.50-0.7499,0.75-1';

  let classColor = '';

  if (value >= -1 && value < -0.75) {
    classColor = 'dangerVH';
  } else if (value >= -0.75 && value < -0.50) {
    classColor = 'dangerH';
  } else if (value >= -0.50 && value < -0.25) {
    classColor = 'dangerM';
  } else if (value >= -0.25 && value < 0) {
    classColor = 'dangerL';

  } else if (value === 0) {
    classColor = '';
  } else if (value > 0 && value <= 0.25) {
    classColor = 'successL';
  } else if (value > 0.25 && value <= 0.5) {
    classColor = 'successM';
  } else if (value > 0.5 && value <= 0.75) {
    classColor = 'successH';
  } else if (value > 0.75 && value <= 1) {
    classColor = 'successVH';
  }

  return classColor;
}

function ColoredButton({classes, rowKey, value, selectedValue, label, isHighlighted = false}) {
  return (
    <div className={classnames(classes.coloredBtn, calculateColor(value), {'selected': selectedValue.column === label && selectedValue.row === rowKey})}>
      {isHighlighted ? <CheckCircleIcon className={classes.checkCircleIcon}/> : ''}
      <div>{(value > 0 ? '+' : '') + value}</div>
    </div>
  )
}

export default withStyles(styles)(ColoredButton);