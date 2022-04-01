/**
 * interfaces for hedge funds input
 */

export interface IAvailableFunds {
  number: number | string;
  loading: boolean;
}

export interface IKeyValue {
  id: number;
  label: string;
}

export interface IFactor {
  id: number;
  category: string;//"Equities"
  description: string;//"S&P 500"
  friendly_name: string;//"S&P 500"
  points_in_months: number;//248
  sub_category: string;//"USA"
  ticker: string;//"US78462F1030"
}

export type TSelectedFactors = {
  [id: string]: IFactorSelected
};

export interface IGlobalStateFields {
  number: number | string;
  type: Array<string>;
  trackRecordRange: string;
  currency: Array<IKeyValue>;
  strategyType: Array<IKeyValue>;
}

export interface IFundsSpecificStateFields {
  method?: {
    momentum: boolean;
    meanReversion: boolean;
    minimumVolatility: boolean;
    sharpe: boolean;
    alchemist: boolean;
  }

  factors?: {[key: string]: Array<IFactor>};
  selectedFactors?: TSelectedFactors;
}

export interface IFactorSelected {
  id: number;
  category: string;
  friendly_name: string;
  sign: string;
}

