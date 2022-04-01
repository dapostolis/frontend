import React from 'react';
import {Link} from 'react-router-dom';
import {Grid, List, ListItem, ListItemText, Paper, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import olisticLogo from './olistic.png';
import reportbrain from './reportbrain.png';
import investglass from './investglass.png';
import axidia from './axidia.png';
import idad from './idad.png';
import apricity from './apricity.png';
import {AuthConsumer} from 'context/AuthContext';


const styles = theme => ({
  disabled: {
    cursor: 'no-drop !important',
    opacity: '0.4',
    borderBottom: '1px solid #d2d2d2',
    // '&:last-child': {
    //   border: 'medium none',
    // }
  },

  container: {
    position: 'relative',
    width: 'calc(100% - 40px)',
    minHeight: 300,
    margin: 20,
    marginTop: theme.mixins.toolbar.minHeight + 29,
    padding: theme.spacing.unit * 2,
  },

  columnBoxes: {
    // display: 'flex',
    maxWidth: 750,
    textAlign: 'center',
    margin: '0 auto',
    // '& > div': {
    //   marginRight: theme.spacing.unit * 4,
    // },
    // '& > div:last-child': {
    //   marginRight: 0,
    // },
  },
  boxes: {
    // position: 'relative',
    // height: '100%',
    // flexGrow: 1,
    // marginBottom: theme.spacing.unit * 4,
    maxWidth: '48%',
    marginRight: '4%',
    marginBottom: '4%',
    '&:nth-child(2n)': {
      marginRight: 0,
    }
  },
  boxPaper: {
    height: '100%',
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    padding: theme.spacing.unit * 2,
    // backgroundColor: 'rgba(38, 117, 206, 0.5)',
    // backgroundColor: 'rgb(56, 108, 167)',
    backgroundColor: theme.palette.secondary.main,
  },

  button: {
    top: 9,
    right: 15,
    color: '#fff',
    border: '1px solid #fff',
    position: 'absolute',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    height: 31,
    lineHeight: '16px',

    '&:hover': {
      // color: 'rgb(56, 108, 167)',
      color: theme.palette.secondary.main,
      backgroundColor: '#fff',
    }
  },
  lineBulletWrap: {
    display: 'flex',
    padding: theme.spacing.unit * 2,
  },
  lineBullet: {
    flexGrow: 1,
    fontSize: 15,
    height: 20,
    lineHeight: '20px',
    paddingLeft: 8,
    borderLeft: '2px solid #2675CE',
  },

  list: {
    padding: '10px 0',
  },
  listItem: {
    borderBottom: '1px solid #ededed',
    // '&:last-child': {
    //   border: 'medium none',
    // }
  },
  listItemText: {
    textAlign: 'center',//test
    '&:first-child': {
      paddingLeft: theme.spacing.unit * 2,
    },
    '& > *': {
      fontSize: 16,
    },

    '& span.label': {
      display: 'inline-block',
      verticalAlign: 'middle',
    },
    '& span.coming': {
      fontSize: 12,
      display: 'inline-block',
      verticalAlign: 'middle',
      color: theme.palette.secondary.main,
    },
  },

  logoContainer: {
    display: 'flex',
    padding: 10,
    textAlign: 'center',
  },
  logo: {
    flexGrow: 1,
  },
  logoImg: {
    filter: 'grayscale(1)',
    opacity: '0.7',
    transition: 'all 0.4s ease 0s',
    '&:hover': {
      cursor: 'pointer',
      filter: 'grayscale(0)',
      opacity: '1',
    },
  },
});

function ModulesPage({classes}) {

  return (
    <AuthConsumer>
      {({user: {categories}}) => (
        <div className={classes.container}>

          <Grid container xs={12} className={classes.columnBoxes} alignContent="space-around">

            {/*Single Securities*/}
            <Grid item xs={6} className={classes.boxes}>

              <Paper className={classes.boxPaper}>

                <Typography variant="h3" className={classes.title}>Single Securities</Typography>

                <List component="nav" className={classes.list}>

                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="Equities"
                    className={classes.listItem}
                    classes={{disabled: classes.disabled}}
                    disabled={!categories.singleSecurities.modules.equities.enabled}
                    component={categories.singleSecurities.modules.equities.enabled ? Link : null}
                    to={categories.singleSecurities.modules.equities.enabled ? "/equities" : null}
                  >
                    <ListItemText className={classes.listItemText} primary="Equities"/>
                  </ListItem>

                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="Bonds"
                    className={classes.listItem}
                    classes={{disabled: classes.disabled}}
                    disabled={!categories.singleSecurities.modules.bonds.enabled}
                    component={categories.singleSecurities.modules.bonds.enabled ? Link : null}
                    to={categories.singleSecurities.modules.bonds.enabled ? "/bonds" : null}
                  >
                    <ListItemText className={classes.listItemText}>
                      <span className="label">Bonds</span> <span className="coming">(Coming soon)</span>
                    </ListItemText>
                  </ListItem>

                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="Currencies"
                    classes={{disabled: classes.disabled}}
                    className={classes.listItem}
                    disabled={!categories.singleSecurities.modules.currencies.enabled}
                    component={categories.singleSecurities.modules.currencies.enabled ? Link : null}
                    to={categories.singleSecurities.modules.currencies.enabled ? "/currencies" : null}
                  >
                    <ListItemText className={classes.listItemText} primary="Currencies"/>
                  </ListItem>

                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="Commodities"
                    classes={{disabled: classes.disabled}}
                    className={classes.listItem}
                    disabled={!categories.singleSecurities.modules.commodities.enabled}
                    component={categories.singleSecurities.modules.commodities.enabled ? Link : null}
                    to={categories.singleSecurities.modules.commodities.enabled ? "/commodities" : null}
                  >
                    <ListItemText className={classes.listItemText} primary="Commodities"/>
                  </ListItem>

                </List>

              </Paper>

            </Grid>


            {/*Collectives*/}
            <Grid item xs={6} className={classes.boxes}>

              <Paper className={classes.boxPaper}>

                <Typography variant="h3" className={classes.title}>
                  Collectives
                </Typography>

                <List className={classes.list}>
                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="Mutual funds"
                    classes={{disabled: classes.disabled}}
                    className={classes.listItem}
                    disabled={!categories.collectives.modules.mutualFunds.enabled}
                    component={categories.collectives.modules.mutualFunds.enabled ? Link : null}
                    to={categories.collectives.modules.mutualFunds.enabled ? "/mutual-funds" : null}
                  >
                    <ListItemText className={classes.listItemText}>
                      <span className="label">Mutual Funds</span>
                    </ListItemText>
                  </ListItem>

                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="Hedge funds"
                    classes={{disabled: classes.disabled}}
                    className={classes.listItem}
                    disabled={!categories.collectives.modules.hedgeFunds.enabled}
                    component={categories.collectives.modules.hedgeFunds.enabled ? Link : null}
                    to={categories.collectives.modules.hedgeFunds.enabled ? "/hedge-funds" : null}
                  >
                    <ListItemText className={classes.listItemText}>
                      <span className="label">Hedge Funds</span>
                    </ListItemText>
                  </ListItem>

                </List>

              </Paper>

            </Grid>


            {/*Private Markets version 2*/}
            <Grid item xs={6} className={classes.boxes}>

              <Paper className={classes.boxPaper}>

                <Typography variant="h3" className={classes.title}>Private Markets</Typography>

                <List component="nav" className={classes.list}>

                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="private-markets"
                    className={classes.listItem}
                    classes={{disabled: classes.disabled}}
                    disabled={!categories.privateMarkets.modules.realEstate.enabled}
                    component={categories.privateMarkets.modules.realEstate.enabled ? Link : null}
                    to={categories.privateMarkets.modules.realEstate.enabled ? "/private-market" : null}
                  >
                    <ListItemText className={classes.listItemText} primary="Real Estate"/>
                  </ListItem>

                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="private-markets"
                    className={classes.listItem}
                    classes={{disabled: classes.disabled}}
                    disabled={!categories.privateMarkets.modules.realEstate.enabled}
                    component={categories.privateMarkets.modules.realEstate.enabled ? Link : null}
                    to={categories.privateMarkets.modules.realEstate.enabled ? "/private-market" : null}
                  >
                    <ListItemText className={classes.listItemText} primary="Private Equity"/>
                  </ListItem>

                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="private-markets"
                    className={classes.listItem}
                    classes={{disabled: classes.disabled}}
                    disabled={!categories.privateMarkets.modules.realEstate.enabled}
                    component={categories.privateMarkets.modules.realEstate.enabled ? Link : null}
                    to={categories.privateMarkets.modules.realEstate.enabled ? "/private-market" : null}
                  >
                    <ListItemText className={classes.listItemText} primary="Private Debt"/>
                  </ListItem>

                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="private-markets"
                    className={classes.listItem}
                    classes={{disabled: classes.disabled}}
                    disabled={!categories.privateMarkets.modules.realEstate.enabled}
                    component={categories.privateMarkets.modules.realEstate.enabled ? Link : null}
                    to={categories.privateMarkets.modules.realEstate.enabled ? "/private-market" : null}
                  >
                    <ListItemText className={classes.listItemText} primary="Venture Capital"/>
                  </ListItem>

                </List>

              </Paper>

            </Grid>


            {/*Auxiliary*/}
            <Grid item xs={6} className={classes.boxes}>

              <Paper className={classes.boxPaper}>

                <Typography variant="h3" className={classes.title}>Auxiliary</Typography>

                <List className={classes.list}>
                  {/*<ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="Asset allocation"
                    classes={{disabled: classes.disabled}}
                    className={classes.listItem}
                    disabled={!categories.auxiliary.modules.assetAllocation.enabled}
                    component={categories.auxiliary.modules.assetAllocation.enabled ? Link : null}
                    to={categories.auxiliary.modules.assetAllocation.enabled ? "/asset-allocation" : null}
                  >
                    <ListItemText className={classes.listItemText}>
                      <span className="label">Asset allocation</span> <span className="coming">(Coming soon)</span>
                    </ListItemText>
                  </ListItem>*/}

                  {/*<ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="Risk analysis"
                    classes={{disabled: classes.disabled}}
                    className={classes.listItem}
                    disabled={!categories.auxiliary.modules.riskAnalysis.enabled}
                    component={categories.auxiliary.modules.riskAnalysis.enabled ? Link : null}
                    to={categories.auxiliary.modules.riskAnalysis.enabled ? "/risk-analysis" : null}
                  >
                    <ListItemText className={classes.listItemText} primary="Risk analysis"/>
                  </ListItem>*/}

                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="Quant Strategist"
                    classes={{disabled: classes.disabled}}
                    className={classes.listItem}
                    disabled={!categories.auxiliary.modules.tacticalAllocation.enabled}
                    component={categories.auxiliary.modules.tacticalAllocation.enabled ? Link : null}
                    to={categories.auxiliary.modules.tacticalAllocation.enabled ? "/quant-strategist" : null}
                  >
                    <ListItemText className={classes.listItemText} primary="Quant Strategist"/>
                  </ListItem>

                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="testyourbanker"
                    classes={{disabled: classes.disabled}}
                    className={classes.listItem}
                    disabled={!categories.auxiliary.modules.testyourbanker.enabled}
                    component={categories.auxiliary.modules.testyourbanker.enabled ? Link : null}
                    to={categories.auxiliary.modules.testyourbanker.enabled ? "/testyourbanker" : null}
                  >
                    <ListItemText className={classes.listItemText} primary="testyourbanker"/>
                  </ListItem>

                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="DYReport"
                    classes={{disabled: classes.disabled}}
                    className={classes.listItem}
                    disabled={!categories.auxiliary.modules.dyReport.enabled}
                    component={categories.auxiliary.modules.dyReport.enabled ? Link : null}
                    to={categories.auxiliary.modules.dyReport.enabled ? "/dyreport" : null}
                  >
                    <ListItemText className={classes.listItemText} primary="DYReport"/>
                  </ListItem>

                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="cioinabox"
                    classes={{disabled: classes.disabled}}
                    className={classes.listItem}
                    disabled={!categories.auxiliary.modules.cioinabox.enabled}
                    component={categories.auxiliary.modules.cioinabox.enabled ? Link : null}
                    to={categories.auxiliary.modules.cioinabox.enabled ? "/cioinabox" : null}
                  >
                    <ListItemText className={classes.listItemText}>
                      <span className="label">cioinabox</span> <span className="coming">(Coming soon)</span>
                    </ListItemText>
                  </ListItem>

                </List>

              </Paper>

            </Grid>

          </Grid>


          {/*Third Parties*/}
          <Paper>

            <Typography variant="h3" className={classes.title}>
              Third Party Applications
            </Typography>

            <div className={classes.logoContainer}>

              <div className={classes.logo} style={{paddingTop: 16}}>
                {/*<img src={vesselsvalue} className={classes.logoImg} width="205"/>*/}
              </div>

              <div className={classes.logo} style={{paddingTop: '9px'}}>
                {/*<Link to="/olistic"><img src={olisticLogo} className={classes.logoImg} width="166"/></Link>*/}
                <Link to={'/api/v1/3rdpartyapp/' + categories.thirdPartyApps.modules.olistic.id + '?redirect=https://www.olistic.io'} target="_blank" rel="noopener noreferrer"><img src={olisticLogo} className={classes.logoImg} width="166"/></Link>
              </div>

              {/*<div className={classes.logo}>
                <a href="https://www.reportbrain.com" target="_blank" rel="noopener noreferrer">
                  <img src={reportbrain} className={classes.logoImg} width="187"/>
                </a>
                <Link to={'/api/v1/3rdpartyapp/' + categories.thirdPartyApps.modules.reportbrain.id + '?redirect=https://www.reportbrain.com'} target="_blank" rel="noopener noreferrer"><img src={reportbrain} className={classes.logoImg} width="187"/></Link>
              </div>*/}

              <div className={classes.logo} style={{paddingTop: 11}}>
                <Link to={'/api/v1/3rdpartyapp/' + categories.thirdPartyApps.modules.investglass.id + '?redirect=https://www.investglass.com'} target="_blank" rel="noopener noreferrer"><img src={investglass} className={classes.logoImg} width="200"/></Link>
              </div>

              {/*<div className={classes.logo} style={{paddingTop: 5}}>
                <Link to="/axidia"><img src={axidia} className={classes.logoImg} width="57"/></Link>
              </div>*/}

              <div className={classes.logo} style={{paddingTop: 12}}>
                <Link to={"/api/v1/3rdpartyapp/" + categories.thirdPartyApps.modules.idad.id + "?redirect=https://www.idad.biz/uk-products/"} target="_blank" rel="noopener noreferrer"><img src={idad} className={classes.logoImg} width="75"/></Link>
              </div>

              {/*<div className={classes.logo} style={{paddingTop: 11}}>
                <Link to={'/api/v1/3rdpartyapp/' + categories.thirdPartyApps.modules.tellimer.id + '?redirect=https://tellimer.com'} target="_blank" rel="noopener noreferrer"><img src={tellimer} className={classes.logoImg} width="182"/></Link>
              </div>*/}

              <div className={classes.logo} style={{paddingTop: 11}}>
                <Link to={'/api/v1/3rdpartyapp/' + categories.thirdPartyApps.modules.apricity.id + '?redirect=https://apricitycompliance.co.uk'} target="_blank" rel="noopener noreferrer"><img src={apricity} className={classes.logoImg} width="182"/></Link>
              </div>

              <div className={classes.logo} style={{paddingTop: 8}}>
                {/*<img src={calastone} className={classes.logoImg} width="194"/>*/}
              </div>

            </div>

          </Paper>


        </div>
      )}
    </AuthConsumer>

  )
}

export default withStyles(styles)(ModulesPage);
