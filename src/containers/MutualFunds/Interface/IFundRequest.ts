/**
 * Mutual funds request interface
 */

export interface ItybVariableWeightTO {
  variable: string;
  pointsInMonths: number;
  weight: string;
}

export interface IFactorSelectedRequest {
  id: number;
  sign: boolean;
}

export interface IRequestFundsTO {
  number: number;

  country: number | null;

  assetClass: number | null;
  focus: Array<number>;
  style: Array<number>;

  currency: Array<number>;
  distributionStatus: Array<number>;
  trackRecordRange: number;
  excludeETF: boolean;

  tybVariableWeightTOs?: Array<ItybVariableWeightTO>;

  momentum?: boolean;
  meanReversion?: boolean;
  minimumVolatility?: boolean;
  sharpe?: boolean;
  alchemist?: boolean;

  selectedFactors?: Array<IFactorSelectedRequest>;
}