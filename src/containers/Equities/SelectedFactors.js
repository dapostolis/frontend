import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import HeadingSideLine from '../../components/HeadingSideLine'
import {List, ListItem, ListItemText, Typography} from '@material-ui/core'
import classnames from 'classnames'


const styles = theme => ({
  colWrap: {
    display: 'flex',
    marginTop: 10,
  },
  col: {
    width: '100%',
    padding: 10,
    borderRight: '1px solid ' + theme.palette.primary.light,
    '&:last-child': {
      border: 'medium none',
    },
    '& h5': {
      fontSize: 14,
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
    },
  },
  listItem: {
    padding: 5,
  },
  listItemText: {
    '& > span': {
      fontSize: 13,
    },
  },
  listItemTextDis: {
    '& > span': {
      color: theme.palette.primary.main,
    },
  }
});

function SelectedFactors({classes, fields, input, unlockWeight}) {
  return (
    <>

      <HeadingSideLine title="Selected Fields"/>

      <div className={classes.colWrap}>

        {Object.keys(fields).map(cat =>
          <div key={cat} className={classes.col}>
            <Typography variant="h5">{fields[cat].friendlyName} {Boolean(input.factors[cat].weight) ? `(${input.factors[cat].weight}%)` : ''}</Typography>

            <List>
              {input.factors[cat].fields.length === 0 ? <ListItem className={classes.listItem}><ListItemText className={classnames(classes.listItemText, classes.listItemTextDis)}>-</ListItemText></ListItem> : ''}
              {input.factors[cat].fields.map(fd => <ListItem key={fd.id} className={classes.listItem}><ListItemText className={classes.listItemText}>{fd.name}</ListItemText></ListItem>)}
            </List>
          </div>
        )}

      </div>

    </>
  )
}

export default withStyles(styles)(SelectedFactors)
