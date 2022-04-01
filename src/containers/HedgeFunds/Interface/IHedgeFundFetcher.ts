import {IFactor, IKeyValue} from "./IHedgeFundInput";

export interface ILists {
  types: Array<string>;
  currency: Array<IKeyValue>;
  strategyType: Array<IKeyValue>;

  equities?: Array<IFactor>;
  fixedincome?: Array<IFactor>;
  macro?: Array<IFactor>;
}