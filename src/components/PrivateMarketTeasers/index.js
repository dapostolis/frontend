import React from 'react';
import {format as dateFormat} from 'date-fns';
import {Button, Card, CardContent, Grid, IconButton, Link, Paper, Tooltip, Typography} from '@material-ui/core';
import {
  BusinessCenter as BusinessCenterIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  FavoriteBorder as FavIcon,
  FavoriteOutlined as FavOutlinedIcon,
  Label as LabelIcon,
  StarRate as StarRateIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Web as WebIcon,
} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';
import Authorized from '../Auth/Authorized';
import {API} from '../../constants/config';
import {convertNumberToCommas} from 'utils/generic';
import classnames from 'classnames';


const styles = theme => ({

  priceField: {
    whiteSpace: 'nowrap',
    letterSpacing: -0.3,
  },
  inlineField: {
    // display: 'flex',
    marginBottom: 10,
  },
  inlineFieldRight: {
    // marginLeft: 8,
    // marginTop: 3,
  },
  grid: {
    padding: '20px 20px 0 20px !important', // todo - need fix. remove !important (https://next.material-ui.com/pt/api/grid/)
  },
  card: {
    display: 'flex',
    position: 'relative',
    // boxShadow: '3px 5px 10px 0px rgba(0,0,0,0.12)',
    boxShadow: '0 5px 4px 0px rgba(0,0,0,0.30)',
    // border: '1px solid ' + theme.palette.primary.light,

    '&.unpublished': {
      opacity: 0.4,
    },
  },
  cardDetails: {
    width: 'calc(100% - 300px)',
  },

  // cardMedia: {
  //   width: '35%',
  //   backgroundColor: theme.palette.primary.light,
  //   backgroundSize: 'auto',
  // },
  body1: {
    marginTop: '5px',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.2,
    fontSize: 14,
  },
  infoWrap: {
    // marginBottom: '20px',
    // padding: '10px',
    // borderRadius: '5px',
    // backgroundColor: theme.palette.primary.light,
    overflow: 'hidden',
  },
  pmInfoColumns: {
    flexFlow: 'row wrap',
    placeContent: 'stretch flex-start',
    alignItems: 'baseline',
    display: 'flex',
  },
  /*inlineInfoWrap: {
    fontSize: 14,
    marginRight: 20,
    // color: theme.palette.primary.light,
    // backgroundColor: theme.palette.secondary.main,
    // padding: '3px 10px',
    borderRadius: 3,
    marginBottom: 5,
    flexGrow: 1,
  },*/
  inlineInfo: {
    width: '31.3%',
    marginRight: '2%',
    marginBottom: 10,
    borderBottom: '1px solid ' + theme.palette.secondary.main,

    '& > .label': {
      fontWeight: 'bold',
    },
  },

  // Vendor
  vdWrap: {
    position: 'relative',
    width: 300,
    display: 'block',
    borderLeft: '2px solid ' + theme.palette.primary.light,
    padding: theme.spacing.unit * 2,
    paddingBottom: 70, // todo get height from button
  },
  vdTitleWrap: {
    marginBottom: 15,
  },
  vdTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  vdSubtitle: {
    fontStyle: 'italic',
    fontSize: 13,
  },
  vdFlWrap: {
    // display: 'flex',
  },
  vdLink: {
    color: theme.palette.primary.light
  },

  vdButtonWrap: {
    position: 'absolute',
    bottom: 15,
    left: theme.spacing.unit * 2,
  },
  vdContact: {
    fontWeight: 'bold',
    fontSize: 12,
    color: theme.palette.secondary.main,
    height: 30,
    marginRight: 10,
    backgroundColor: theme.palette.primary.light,

    /*'&:hover': {
      color: theme.palette.primary.light,
      backgroundColor: theme.palette.secondary.main,
    },*/
  },
  vdDeal: {
    fontWeight: 'bold',
    fontSize: 12,
    display: 'inline-block',
    height: 30,
    color: theme.palette.primary.light,
    backgroundColor: theme.palette.secondary.main,
    opacity: '0.9',
    transition: 'all 0.3s',

    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      opacity: '1',
      textDecoration: 'none',
    },
  },

  actionsWrapper: {
    zIndex: 1,
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '10px',
    border: '1px solid ' + theme.palette.primary.dark,
    borderRadius: '3px',
    backgroundColor: theme.palette.primary.light,
    opacity: 0.5,

    '&:hover': {
      opacity: 1
    }
  },
  ActionBtn: {
    marginRight: '10px',
    padding: 0,
    '&:last-child': {
      marginRight: 0
    }
  },

  headWrap: {
    display: 'flex',
  },

  pmTitle: {
    fontSize: 18,
    fontWeight: 'normal',
    color: theme.palette.textPrimary.main,
    letterSpacing: '0.1em',
  },

  favWrap: {
    marginRight: 3,
    marginTop: -10,
    // marginLeft: -10,
    cursor: 'pointer',
  },
  favGen: {
    fontSize: 23,
  },
  favorite: {
    color: '#d80000',
  },
  pmSubtitle: {
    fontSize: 13,
    textTransform: 'uppercase',
    marginBottom: 25,
    color: '#818181',
  },

  pmInnerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  }
});

function PrivateMarketTeasers({
                                classes,
                                content,
                                onHandleChangeFavourite,
                                onHandleClickContactVendor,
                                handleClickOpenFormEdit,
                                handleClickSetPublished,
                                onHandleDeleteDialog
                              }) {
  return (
    <Grid container spacing={40} className={classes.cardGrid}>
      {content.map(pm => (
        <Grid item key={pm.id} xs={12} md={12} className={classes.grid}>
          <Card className={classnames(classes.card, {'unpublished': !pm.published})}>
            <div className={classes.cardDetails}>
              <CardContent>

                <div className={classes.headWrap}>
                  <Typography component="h2" variant="h5" className={classes.pmTitle}>
                    {pm.title}
                  </Typography>

                  <div className={classes.favWrap}>
                    <IconButton aria-label="Add to favorites" onClick={() => onHandleChangeFavourite(pm.id)}>
                      {!pm.favourite
                        ? <FavIcon className={classes.favGen}/>
                        : <FavOutlinedIcon classes={{root: classes.favorite}} className={classes.favGen}/>}
                    </IconButton>
                  </div>
                </div>

                <Typography component="h3" className={classes.pmSubtitle}>
                  {pm.module.name}
                </Typography>


                <div>
                  <Typography component="h5" className={classes.pmInnerTitle}>Description</Typography>
                  <Typography variant="body1" color="textPrimary" paragraph classes={{body1: classes.body1}}>
                    {pm.description}
                  </Typography>
                </div>


                <div className={classes.infoWrap}>

                  <Typography component="h5" className={classes.pmInnerTitle}
                              style={{marginBottom: 15}}>Details</Typography>

                  <div className={classes.pmInfoColumns}>

                    {/*<div className={classes.inlineInfoWrap}>*/}
                    {pm.subType ? <Typography component="div" className={classes.inlineInfo}>
                      <div className="label">Sub Type</div>
                      <div>{pm.subType}</div>
                    </Typography> : ''}

                    {pm.sector ? <Typography component="div" className={classes.inlineInfo}>
                      <div className="label">Sector</div>
                      <div>{pm.sector}</div>
                    </Typography> : ''}

                    {pm.region ? <Typography component="div" className={classes.inlineInfo}>
                      <div className="label">Region</div>
                      <div>{pm.region}</div>
                    </Typography> : ''}
                    {/*</div>*/}

                    {/*<div className={classes.inlineInfoWrap}>*/}
                    {pm.country && pm.country.name ? <Typography component="div" className={classes.inlineInfo}>
                      <div className="label">Country</div>
                      <div>{pm.country.name}</div>
                    </Typography> : ''}

                    {pm.price ? <Typography component="div" className={classes.inlineInfo}>
                      <div className="label">Investment</div>
                      <div
                        className={classes.priceField}>{(pm.priceInfo ? pm.priceInfo + ' ' : '') + convertNumberToCommas(pm.price)}</div>
                    </Typography> : ''}

                    {pm.minimumTicket ? <Typography component="div" className={classes.inlineInfo}>
                      <div className="label">Minimum Ticket</div>
                      <div
                        className={classes.priceField}>{(pm.minimumTicketInfo ? pm.minimumTicketInfo + ' ' : '') + convertNumberToCommas(pm.minimumTicket)}</div>
                    </Typography> : ''}
                    {/*</div>*/}

                    {/*<div className={classes.inlineInfoWrap}>*/}
                    {pm.round ? <Typography component="div" className={classes.inlineInfo}>
                      <div className="label">Round</div>
                      <div>{pm.round}</div>
                    </Typography> : ''}

                    {pm.pmYield ? <Typography component="div" className={classes.inlineInfo}>
                      <div className="label">Yield</div>
                      <div>{pm.pmYield}</div>
                    </Typography> : ''}

                    {pm.deadline ? <Typography component="div" className={classes.inlineInfo}>
                      <div className="label">Deadline</div>
                      <div>{dateFormat(pm.deadline, 'DD/MM/YYYY')}</div>
                    </Typography> : ''}
                    {/*</div>*/}

                  </div>

                </div>

                <Authorized
                  resource="pm:adminActions"
                  yes={() =>
                    <Paper square={true} elevation={0} className={classes.actionsWrapper}>

                      <Tooltip title={pm.published ? 'Unpublish' : 'Publish'} aria-label="published">
                        <IconButton classes={{root: classes.ActionBtn}} aria-haspopup="true"
                                    color="inherit"
                                    onClick={() => handleClickSetPublished(pm)}
                        >
                          {!pm.published
                            ? <VisibilityIcon/>
                            : <VisibilityOffIcon/>
                          }
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit" aria-label="edit">
                        <IconButton classes={{root: classes.ActionBtn}} aria-haspopup="true"
                                    color="inherit"
                                    onClick={() => handleClickOpenFormEdit(pm)}
                        >
                          <EditIcon/>
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete" aria-label="delete">
                        <IconButton classes={{root: classes.ActionBtn}} aria-haspopup="true"
                                    color="inherit"
                                    onClick={() => onHandleDeleteDialog(pm.id)}
                        >
                          <DeleteIcon/>
                        </IconButton>
                      </Tooltip>

                    </Paper>
                  }
                />

              </CardContent>
            </div>

            {/*Vendor details*/}
            <div className={classes.vdWrap}>

              <div className={classes.vdTitleWrap}>
                <Typography component="h5" variant="subtitle1" color="textPrimary" className={classes.vdTitle}>
                  VENDOR INFORMATION
                </Typography>
                {/*{pm.endorsedBy ?
                  <Typography component="h6" variant="subtitle2" color="textPrimary" className={classes.vdSubtitle}>
                    Endorsed By: {pm.endorsedBy}
                  </Typography> : ''}*/}
              </div>

              <div className={classes.vdFlWrap}>
                {pm.vendor.companyName ? <Typography component="div" className={classes.inlineField}>
                  {/*<BusinessCenterIcon/>*/}
                  <div><strong>Company Name</strong></div>
                  <div className={classes.inlineFieldRight}>{pm.vendor.companyName}</div>
                </Typography> : ''}

                {pm.vendor.vendorType ? <Typography component="div" className={classes.inlineField}>
                  {/*<LabelIcon/>*/}
                  <div><strong>Type</strong></div>
                  <div className={classes.inlineFieldRight}>{pm.vendor.vendorType}</div>
                </Typography> : ''}

                {pm.vendor.description ? <Typography component="div" className={classes.inlineField}>
                  {/*<DescriptionIcon/>*/}
                  <div><strong>Description</strong></div>
                  <div className={classes.inlineFieldRight}>{pm.vendor.description}</div>
                </Typography> : ''}

                {pm.vendor.url ? <Typography component="div" className={classes.inlineField}>
                  {/*<WebIcon/>*/}
                  <div><strong>URL</strong></div>
                  <div className={classes.inlineFieldRight}>{pm.vendor.url}</div>
                </Typography> : ''}

                {pm.vendor.trackRecord ? <Typography component="div" className={classes.inlineField}>
                  {/*<StarRateIcon/>*/}
                  <div><strong>Track Record</strong></div>
                  <div className={classes.inlineFieldRight}>{pm.vendor.trackRecord}</div>
                </Typography> : ''}

                {pm.endorsedBy ? <Typography component="div" className={classes.inlineField}>
                  {/*<PersonIcon/>*/}
                  <div><strong>Endorsed by</strong></div>
                  <div className={classes.inlineFieldRight}>{pm.endorsedBy}</div>
                </Typography> : ''}
              </div>

              <div className={classes.vdButtonWrap}>

                <Button className={classes.vdContact} size="small"
                        onClick={() => onHandleClickContactVendor(pm)}>CONTACT VENDOR</Button>

                {pm.filename ?
                  <Link component={Button} className={classes.vdDeal} href={`${API}download/todo/${pm.id}.pdf`}
                        target="_blank">DEAL PREVIEW</Link> : ''}

              </div>

            </div>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default withStyles(styles)(PrivateMarketTeasers);
