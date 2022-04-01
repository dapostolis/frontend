/**
 * Interfaces for funds output
 */

export interface IFund {
  name: string;//"Investec GSF EM Lcl Ccy Dbt I Acc EUR"
  annualisedReturn: number;//%
  annualisedVolatility: number;//%
  aum: number;
  ccy: string;//"Euro"
  strategyType: string; //"Accumulation"
  type: string;//"EM & Asia"
  instrumentType: string;//"Open-End Fund"
  isin: string;//"LU0438164971"
  legalStructure: string;//"SICAV"
  style: string;//"HY & EM"
  ter: number;//
  yield: number;//%
  ytd: number;//%
  beta?: number;
  r2?: number;
}

export interface IChartProps {
  className: any;
  state: boolean;
}

export interface IFundsMethod {
  title: string;
  list: Array<IFund>;
}

export interface ITacticalAccordion {
  assetClass: string;
  funds: Array<IFund>;
}

// Strategy
export interface IStrategyParam {
  annualisedReturn: number;
  annualisedVolatility: number;
  sharpe: number;
  ytd: number;
}

export interface IStrategyType {
  bt: IStrategyParam;
  sg: IStrategyParam;
}

export interface IStrategyMethods {
  mom: IStrategyType;
  meanRev: IStrategyType;
  minVol: IStrategyType;
  sharpe: IStrategyType;
  al: IStrategyType;
  bench: IStrategyType;
}