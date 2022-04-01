/**
 * Interfaces for fetcher
 */

import {IAssetClass, IFactor, IKeyValue} from './IFundInput';

export interface ILists {
  country: Array<IKeyValue>;
  assetClass: {[key: string]: IAssetClass};
  currency: Array<IKeyValue>;
  distributionStatus: Array<IKeyValue>;

  equities: Array<IFactor>;
  fixedincome: Array<IFactor>;
  macro: Array<IFactor>;
}