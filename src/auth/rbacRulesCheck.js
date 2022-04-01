/**
 * RBAC rules check
 *
 * @param rules (rules are agnostic for RBAC checker so we need to provide it on call)
 * @param role (user's role that we want to check if has access to a specific resource)
 * @param resource (the resource that we want to check)
 * @param data (argument that passes to the dynamic callback)
 * @returns boolean
 */
const check = (rules, role, resource, dynamicArg) => {
  const permissions = rules[role];
  if (!permissions) {
    return false;
  }

  const staticPermissions = permissions.static;

  if (staticPermissions && (staticPermissions === 'ALL' || staticPermissions.includes(resource))) {
    return true;
  }

  const dynamicPermissions = permissions.dynamic;

  if (dynamicPermissions) {
    const permissionCondition = dynamicPermissions[resource];

    if (permissionCondition !== undefined && typeof permissionCondition !== 'function') {
      console.warn('Dynamic_rule: Maybe rbac rule is not a function');
      return false;
    }

    if (!permissionCondition) {
      return false;
    }

    return permissionCondition(dynamicArg);
  }
};

export default check;