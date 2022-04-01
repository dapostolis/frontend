import React from 'react';
import {createStyles, Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {ITacticalAccordion} from "./Interface/IFundOutput";
import Loader from "components/LoaderCircle";
import HeadingSideLine from "components/HeadingSideLine";
import FundsTable from "./FundsTable";
import AccordionWrapper from "components/AccordionWrapper";
import AccordionItem from "components/AccordionItem";

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
  loading: { [key: string]: any };
  tacticalAccordion: Array<ITacticalAccordion>;
}

function TacticalAccordionTables({classes, loading, tacticalAccordion}: IProps) {

  return (
    <>
      <Loader className={loading.className} size="small" start={loading.state}/>

      <HeadingSideLine title="Results" className={classes.title}/>

      {!loading.state ?
        <AccordionWrapper>
          {tacticalAccordion.map((accordionItem: ITacticalAccordion, key: number) => {
            let isCombined = false;
            if (accordionItem.assetClass === 'Combined') {
              isCombined = true;
            }

            if (accordionItem.funds.length > 0) {
              return (
                <AccordionItem key={accordionItem.assetClass + '-' + key} id={accordionItem.assetClass + '-' + key} title={accordionItem.assetClass} defaultExpanded={tacticalAccordion.length === 1}>
                  <FundsTable showHighlightRow={isCombined} funds={accordionItem.funds} isMethodsTabEnabled={false} isCombined={accordionItem.assetClass.toLowerCase() === 'combined'}/>
                </AccordionItem>
              )
            }
          })}
        </AccordionWrapper>
        : ''}

      {!loading.state && tacticalAccordion.filter((accordionItem: ITacticalAccordion) => accordionItem.funds.length > 0).length === 0 ?
        <Typography className={classes.noresults}>No results.</Typography>
        : ''}
    </>
  )
}

export default withStyles(style)(TacticalAccordionTables);