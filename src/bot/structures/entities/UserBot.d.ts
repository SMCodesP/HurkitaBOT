import { RoleBot } from './RoleBot'

export interface UserBot {
  id: number
  roles: Array<RoleBot>
}
