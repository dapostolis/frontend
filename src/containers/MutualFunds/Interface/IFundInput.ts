/**
 * Interfaces for input React component
 */

export interface IKeyValue {
  id: number;
  label: string;
}

export interface IGlobalStateFields {
  number: number | string;
  country: string;

  assetClass: string;
  focus: Array<IKeyValue>;
  style: Array<IKeyValue>;

  currency: Array<IKeyValue>;
  distributionStatus: Array<IKeyValue>;
  trackRecordRange: string;
  excludeETF: boolean;
}

export interface IFundsSpecificStateFields {
  tybVariableWeightTOs?: Array<ItybVariableWeightField>;

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

export interface IAvailableFunds {
  number: number | string;
  loading: boolean;
}

export interface IAssetClass {
  id: number;
  label: string;
  focus?: Array<IKeyValue>;
  style?: Array<IKeyValue>;
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

export interface IFactorSelected {
  id: number;
  category: string;
  friendly_name: string;
  sign: string;
}

export type TSelectedFactors = {
  [id: string]: IFactorSelected
};

export interface ItybVariableWeightField {
  name: string;
  assetClass: string;
  variable: string;
  pointsInMonths: number;
  pointsInYears: number;
  weight: string;
}

export interface ISearchISIN {
  loading: boolean;
  isin: string;
  assetClass: string;
  isinData: any;
}