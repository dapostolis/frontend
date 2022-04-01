import check from './rbacRulesCheck';
import rules from 'constants/rbacRules';

/**
 * Wrapper of rbacRulesCheck to avoid passing rules on every call
 *
 * @param role
 * @param resource
 * @param dynamicArg
 * @returns {boolean}
 */
export function isAuthorized(role, resource, dynamicArg) {
  return check(rules, role, resource, dynamicArg);
}