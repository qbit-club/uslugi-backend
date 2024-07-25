import { Injectable } from '@nestjs/common';
import { Role } from './interfaces/role.interface'
import mongoose from 'mongoose';

@Injectable()
export class RolesService {
  getTypeFromRole(role: Role): string {
    return role.type
  }
  getRestIdsFromRole(role: Role): mongoose.Types.ObjectId[] {
    return role.rest_ids
  }
  HaveKeyOfRest(role: Role, rest_id: string): boolean {
    return this.getRestIdsFromRole(role).includes(new mongoose.Types.ObjectId(rest_id))
  }
  isAdmin(role: Role) {
    return role.type == 'admin'
  }
  isManager(role: Role) {
    return role.type = 'manager'
  }

  // getRolesWithRest(roles: Role, org_id: string): string[] {
  //   roles.push(`manager-${org_id}`)
  //   return roles
  // }

  // getRolesWithoutRest(roles: Role, org_id: string): string[] {
  //   return roles.filter(role => !role.includes(`manager-${org_id}`))
  // }

  //is some admin


  // getType(roles: string[]): string {
  //   if (this.isGlobalAdmin(roles))
  //     return 'глобальный админ'

  //   if (this.isSomeAdmin(roles))
  //     return 'админ'

  //   return 'пользователь'
  // }
}
