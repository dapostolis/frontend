/**
 * Generic utilization methods
 */

import {List} from 'immutable';

/**
 * Parse alchemist modules in a nice formatted array with object items {id, name, enabled}
 *
 * Custom business logic:
 * 1) filter out third party modules
 * 2) treat private markets as a single module
 *
 * @param categories
 * @returns {Array}
 */
export const modulesParser = (categories) => {
  let parsedModules = [];

  for (let cat in categories) {
    let modules = categories[cat].modules;

    if (cat === 'privateMarkets') {

      parsedModules.push({
        id: categories['privateMarkets'].modules.realEstate.id,
        name: 'Private Markets',
        price: categories['privateMarkets'].modules.realEstate.price,
        enabled: categories['privateMarkets'].modules.realEstate.enabled,
      });

    } else if (cat !== 'thirdPartyApps') {

      for (let mod in modules) {
        /*let module = modules[mod];
        parsedModules.push({
          id: module.id,
          name: module.name,
          enabled: module.enabled,
        });*/
        parsedModules.push(modules[mod]);
      }

    }
  }

  return parsedModules;
};

/**
 * prepare a string to be used as a machine name (e.g. key for dict object etc)
 *
 * @param str
 * @returns {string}
 */
export function convertStringToMachineName(str) {
  // todo enhancements on replacement regex
  return str.toLowerCase().replace(/ /g, '');
}

/**
 * Convert number to comma separated numbers
 *
 * @param x
 * @returns {string}
 */
export function convertNumberToCommas(x) {
  // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  let parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.');
}

/**
 * Convert an Array to dictionary object depending on an object's key.
 *
 * E.g. if we have an array [{category: 'my category', b: 2}, {category: 'my category', b: 4}], converter with key='category' will create an object
 *      {
 *        my_category: {
 *          name: 'my category',
 *          list: [
 *            {
 *              b: 2
 *            },
 *            {
 *              b: 4,
 *            }
 *          ]
 *        }
 *      }
 *
 * @param list
 * @param key
 * @returns {*}
 */
export function convertArrayToDictionaryBySelectedKey(list, key) {
  const immutableList = List(list).toArray();

  const object = {};
  immutableList.forEach(item => {
    const machineKey = convertStringToMachineName(item[key]);

    if (!object[machineKey]) {
      object[machineKey] = {
        name: item[key],
        list: [],
      };
    }

    delete item[key];

    object[machineKey].list.push(item);
  });

  return object;
}

/**
 * Convert an Array to dictionary object depending on an object's key.
 *
 * E.g. if we have an array [{category: 'my category 1', name: 'my name 1'}, {category: 'my category 2', name: 'my name 2'}], converter with key='category' and value='name' will create an object
 *      {
 *        my_category_1: 'my name 1',
 *        my_category_2: 'my name 2'
 *      }
 *
 * @param list
 * @param key
 * @param value
 * @returns {*}
 */
export function convertArrayToDictionaryBySelectedKeyValue(list, key, value) {
  const immutableList = List(list).toArray();

  const object = {};
  immutableList.forEach(item => {
    let parsedKey = convertStringToMachineName(item[key]);
    object[parsedKey] = item[value];
  });

  return object;
}

/**
 *
 * Convert a number to percentage
 *
 * @param num
 * @param fixed - Optional value
 * @returns {string}
 */
export function convertNumberToPercentage(num, fixed = 2) {
  let percentage = (Number(num) * 100).toFixed(fixed);
  let hasMinusOperator = percentage[0] === '-';
  if (percentage == 0 && hasMinusOperator) {
    percentage = Number(percentage).toFixed(fixed);
  }
  return percentage;
}

/**
 * Get object value. Works great with nested objects.
 *
 * @param fn
 * @param defaultValue
 * @returns {*}
 */
export function getSafeObjectValue(fn, defaultValue = null) {
  try {
    return fn();
  } catch (exception) {
    return defaultValue;
  }
}
