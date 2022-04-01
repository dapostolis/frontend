import rules from 'constants/rbacRules';
import check from 'auth/rbacRulesCheck';

/**
 * Component wrapper of rbacRulesCheck to avoid passing rules on every call.
 * Also set default yes/no methods to null to avoid any call if there is no usage on them.
 *
 * @param props
 * @returns <Component/> or null
 */
const HasAccess = props =>
  check(rules, props.role, props.resource, props.data)
    ? props.yes()
    : props.no();

HasAccess.defaultProps = {
  yes: () => null,
  no: () => null
};

export default HasAccess;
