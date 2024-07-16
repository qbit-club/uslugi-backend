import { Injectable } from '@nestjs/common';
import {Role} from './interfaces/role.interface'
import mongoose, { ObjectId } from 'mongoose';

@Injectable()
export class RolesService {
  getTypeFromRole(role: Role): string {
    return role.type
  }
  getRestIdsFromRoles(role: Role): mongoose.Types.ObjectId[] {
    return role.rest_ids
  }

  isAdminOfRest(role: Role, rest_id: string): boolean {
    return this.getRestIdsFromRoles(role).includes(new mongoose.Types.ObjectId(rest_id))
  }

  // getRolesWithRest(roles: Role, org_id: string): string[] {
  //   roles.push(`manager-${org_id}`)
  //   return roles
  // }

  // getRolesWithoutRest(roles: Role, org_id: string): string[] {
  //   return roles.filter(role => !role.includes(`manager-${org_id}`))
  // }

  //is some admin

  isAdmin(roles: Role) {
    return roles.type == 'admin'
  }
  isManager(roles: Role) {
    return roles.type = 'manager'
  }

  // getType(roles: string[]): string {
  //   if (this.isGlobalAdmin(roles))
  //     return 'глобальный админ'

  //   if (this.isSomeAdmin(roles))
  //     return 'админ'

  //   return 'пользователь'
  // }
}
