import React from 'react';
import {createStyles, Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import AccordionWrapper from "components/AccordionWrapper";
import AccordionItem from "components/AccordionItem";
import {IFundsMethod} from "./Interface/IFundOutput";
import Loader from "components/LoaderCircle";
import HeadingSideLine from "components/HeadingSideLine";
import FundsTable from "./FundsTable";


const style = () => createStyles({
  title: {
    marginBottom: 10,
  },
  noresults: {
    marginTop: 10,
  },
});


interface IProps {
  classes: any;
  loading: {[key: string]: any};
  fundsMethods: {[key: string]: IFundsMethod};
}

function AccordionStyles({classes, loading, fundsMethods}: IProps) {
  let numberOfMethods = Object.keys(fundsMethods).filter(fundKey => fundsMethods[fundKey].list.length > 0).length;

  return (
    <>
      <Loader className={loading.className} size="small" start={loading.state}/>

      <HeadingSideLine title="Results" className={classes.title}/>

      {!loading.state && numberOfMethods > 0 ?
        <AccordionWrapper>
          {fundsMethods && Object.keys(fundsMethods).map(fundKey => {
            if (fundsMethods[fundKey].list.length > 0) {
              return (
                <AccordionItem key={fundKey} id={fundKey} title={fundsMethods[fundKey].title + ' Portfolio'} defaultExpanded={numberOfMethods === 1}>
                  <FundsTable funds={fundsMethods[fundKey].list} isMethodsTabEnabled={true}/>
                </AccordionItem>
              )
            }
          })}
        </AccordionWrapper>
        : ''}

      {!loading.state && numberOfMethods === 0 ? <Typography className={classes.noresults}>No results.</Typography> : ''}
    </>
  )
}

export default withStyles(style)(AccordionStyles);