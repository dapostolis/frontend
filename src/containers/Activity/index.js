import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import MainBareWrapper from 'components/MainBareWrapper'
import {Link as MLink, Paper, Typography} from '@material-ui/core'
import useFetcherList from 'containers/ListHook'
import Loader from 'components/LoaderCircle'
import {format as dateFormat} from 'date-fns'
import {Link} from 'react-router-dom'
import HeadingsLine from 'components/HeadingSingleLine'
import MainHeaderWrapper from 'components/MainHeaderWrapper'


const style = theme => ({
  loader: {
    top: 30,
  },

  Paper: {
    position: 'relative',
    padding: theme.spacing.unit * 2,
    minHeight: 200,
  },

  acDate: {
    fontSize: 14,
  },
})

function Activity({classes}) {
  const {
    loading,
    list: {
      content,
      filter,
      isFilteringApplied,
    },
    fetchList,
    handleFilter,
    handleFilterReset,
  } = useFetcherList('activity', {
    content: [],
    page: {
      size: 80,
      totalPages: 0,
      number: 0,
    },
    sort: {
      field: 'dateCreated',
      direction: 'desc',
    },
    filter: {
      username: '',
    },
  });

  return (
    <MainBareWrapper>

      <MainHeaderWrapper>
        <HeadingsLine title="Activity" subtitle="View users' activity logs"/>
      </MainHeaderWrapper>

      <Paper className={classes.Paper}>

        <Loader className={classes.loader} start={loading}/>

        {!loading
          ?
          <div>
            {content.map((activity, key) =>
                <Typography key={key} variant="body1">
            <span
              className={classes.acDate}>{dateFormat(activity.dateCreated, 'DD/MM/YYYY - HH:mm')}</span> (<span>
              <MLink
                component={Link} to={'/user/' + activity.userID}
                color="secondary"
              >
                {activity.username}
              </MLink></span>)
                  - <span>{activity.action.replace(/_/g, ' ').toLowerCase()} action in category {activity.category.replace(/_/g, ' ').toLowerCase()} {activity.host === '-' ? '' : 'from host ' + activity.host}{activity.httpCode ? ' (response ' + activity.httpCode + ' in ' + activity.duration + ')' : ''}</span></Typography>
            )}
          </div>
          : ''}
      </Paper>

    </MainBareWrapper>
  )
}

export default withStyles(style)(Activity);
