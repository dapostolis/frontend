export interface IFactorSelectedRequest {
  id: number;
  sign: boolean;
}

export interface IRequestFundsTO {
  number: number;
  type: Array<string>;
  trackRecordRange: number;
  currency: Array<number>;
  strategyType: Array<string>;

  momentum?: boolean;
  meanReversion?: boolean;
  minimumVolatility?: boolean;
  sharpe?: boolean;
  alchemist?: boolean;

  selectedFactors?: Array<IFactorSelectedRequest>;
}