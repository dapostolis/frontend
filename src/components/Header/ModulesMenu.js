import React from 'react';
import {Typography} from '@material-ui/core'
import classnames from 'classnames'
import {Link} from 'react-router-dom'


function ModuleItem({classes, isEnabled, path, moduleName}) {
  return (
    <Typography component="div"
                className={classnames(classes.mdLinkWrap, {disabled: !isEnabled})}
    >
      {isEnabled ? <Link to={path} className={classes.mdLink}>{moduleName}</Link> : moduleName}
    </Typography>
  )
}

function ModulesMenu({classes, user}) {
  return (
    <div className={classes.mdColWrap}>

      <div className={classes.mdCol}>

        <Typography component="div" className={classes.mdColTitle}>Single Securities</Typography>

        <ModuleItem
          classes={classes}
          path="/equities"
          moduleName="Equities"
          isEnabled={user.categories.singleSecurities.modules.equities.enabled}
        />

        <ModuleItem
          classes={classes}
          path="/bonds"
          moduleName="Bonds"
          isEnabled={user.categories.singleSecurities.modules.bonds.enabled}
        />

        <ModuleItem
          classes={classes}
          path="/currencies"
          moduleName="Currencies"
          isEnabled={user.categories.singleSecurities.modules.currencies.enabled}
        />

        <ModuleItem
          classes={classes}
          path="/commodities"
          moduleName="Commodities"
          isEnabled={user.categories.singleSecurities.modules.commodities.enabled}
        />

      </div>

      <div className={classes.mdCol}>

        <Typography component="div" className={classes.mdColTitle}>Collectives</Typography>

        <ModuleItem
          classes={classes}
          path="/mutual-funds"
          moduleName="Mutual Funds"
          isEnabled={user.categories.collectives.modules.mutualFunds.enabled}
        />

        <ModuleItem
          classes={classes}
          path="/hedge-funds"
          moduleName="Hedge Funds"
          isEnabled={user.categories.collectives.modules.hedgeFunds.enabled}
        />

      </div>

      <div className={classes.mdCol}>

        <Typography component="div" className={classes.mdColTitle}>Private Markets</Typography>

        <ModuleItem
          classes={classes}
          path="/private-market"
          moduleName="Real Estate"
          isEnabled={user.categories.privateMarkets.modules.realEstate.enabled}
        />

        <ModuleItem
          classes={classes}
          path="/private-market"
          moduleName="Private Equity"
          isEnabled={user.categories.privateMarkets.modules.realEstate.enabled}
        />

        <ModuleItem
          classes={classes}
          path="/private-market"
          moduleName="Private Debt"
          isEnabled={user.categories.privateMarkets.modules.realEstate.enabled}
        />

        <ModuleItem
          classes={classes}
          path="/private-market"
          moduleName="Venture Capital"
          isEnabled={user.categories.privateMarkets.modules.realEstate.enabled}
        />

      </div>

      <div className={classes.mdCol}>

        <Typography component="div" className={classes.mdColTitle}>Auxiliary</Typography>

        {/*<ModuleItem
          classes={classes}
          path="/asset-allocation"
          moduleName="Asset Allocation"
          isEnabled={user.categories.auxiliary.modules.assetAllocation.enabled}
        />*/}

        {/*<ModuleItem
          classes={classes}
          path="/risk-analysis"
          moduleName="Risk Analysis"
          isEnabled={user.categories.auxiliary.modules.riskAnalysis.enabled}
        />*/}

        <ModuleItem
          classes={classes}
          path="/quant-strategist"
          moduleName="Quant Strategist"
          isEnabled={user.categories.auxiliary.modules.tacticalAllocation.enabled}
        />

        <ModuleItem
          classes={classes}
          path="/testyourbanker"
          moduleName="testyourbanker"
          isEnabled={user.categories.auxiliary.modules.testyourbanker.enabled}
        />

        <ModuleItem
          classes={classes}
          path="/dyreport"
          moduleName="DYReport"
          isEnabled={user.categories.auxiliary.modules.dyReport.enabled}
        />

        <ModuleItem
          classes={classes}
          path="/cioinabox"
          moduleName="cioinabox"
          isEnabled={user.categories.auxiliary.modules.cioinabox.enabled}
        />

      </div>

    </div>
  )
}

export default ModulesMenu;