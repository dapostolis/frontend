import React, {ReactNode} from 'react';
import {Theme} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';

const styles = (theme: Theme) => ({
  mainHeaderWrapper: {
    display: 'flex',
    marginBottom: theme.spacing.unit * 2,
    alignItems: 'center',
  },
});

interface IProps {
  children?: ReactNode;
  classes: any;
  id?: string;
  className?: object;
}

let MainHeaderWrapper = ({children, classes, id, className}: IProps) => (
  <div id={id} className={classnames(classes.mainHeaderWrapper, className)}>
    {children}
  </div>
);

export default withStyles(styles)(MainHeaderWrapper);