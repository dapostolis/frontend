import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import EditInput from 'components/FlatField/EditInput';
import HeadingTwoLines from 'components/HeadingTwoLines';
import classnames from 'classnames';


const styles = theme => ({
  dyTitle: {
    fontSize: 27,
    // color: theme.palette.getContrastText('#000'), //todo get the user's selected color
    margin: '27px 10px 20px 15px',
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
      <EditInput
        css={{
          result: classes.result,
          control: classes.input,
        }}
        {...props}
      />
    </HeadingTwoLines>
  )
}

export default withStyles(styles)(DYTitle);