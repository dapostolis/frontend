import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import EditInput from 'components/FlatField/EditInput';
import HeadingTwoLines from 'components/HeadingTwoLines';
import classnames from 'classnames';


const styles = () => ({
  dyTitle: {
    fontSize: 27,
    margin: '27px 10px 30px 15px',
  },

  // edit custom styles
  result: {
    minWidth: 50,
    minHeight: 31,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    // textOverflow: 'ellipsis',
    maxWidth: 690,
  },

  input: {
    padding: 0,
    height: 31,
    width: 690,
  },
});

function DYTitle({classes, className, ...props}) {
  return (
    <HeadingTwoLines variant="h3" className={classnames(classes.dyTitle, className)}>
      <div className={classes.result}>{props.fieldValue}</div>
    </HeadingTwoLines>
  )
}

export default withStyles(styles)(DYTitle);