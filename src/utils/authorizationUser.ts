import { ROLE } from './type';

export const adminAuthorization = (roleId: number) => {
  if (roleId === ROLE.ROOT || roleId === ROLE.ADMIN) {
    return true;
  }
  return false;
};

export const superAdminAuthorization = async (roleId: number) => {
  if (roleId === ROLE.ADMIN) {
    return true;
  }
  return false;
};
