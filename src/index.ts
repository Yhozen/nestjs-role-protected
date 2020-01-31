import 'reflect-metadata'
import { RoleProtected } from './decorators/role-protected.guard'
import { CanDoAny } from './decorators/can-do-any.decorator'
import { RolesBuilder, AccessControlModule } from 'nest-access-control'
export { CanDoAny, RoleProtected, RolesBuilder, AccessControlModule }
