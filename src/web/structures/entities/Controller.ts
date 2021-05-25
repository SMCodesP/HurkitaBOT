import { cyan } from 'colors/safe'
import { Request, Response, Router } from 'express'
import { web } from '../../..'

export abstract class Controller {
  get?(req: Request, res: Response): void
  post?(req: Request, res: Response): void
  delete?(req: Request, res: Response): void
  put?(req: Request, res: Response): void

  constructor(
    register: any,
    route: string,
    routeSpecify?: {
      post?: string
      get?: string
      delete?: string
      put?: string
    }
  ) {
    if (this.get) {
      register('get', routeSpecify.get || route, this.get)
      console.log(
        `${cyan('[Rota]')} Método GET registrado na rota ${
          routeSpecify.get || route
        }`
      )
    }
    if (this.post) {
      register('post', routeSpecify.post || route, this.post)
      console.log(
        `${cyan('[Rota]')} Método POST registrado na rota ${
          routeSpecify.post || route
        }`
      )
    }
    if (this.delete) {
      register('delete', routeSpecify.delete || route, this.delete)
      console.log(
        `${cyan('[Rota]')} Método DELETE registrado na rota ${
          routeSpecify.delete || route
        }`
      )
    }
    if (this.put) {
      register('put', routeSpecify.put || route, this.put)
      console.log(
        `${cyan('[Rota]')} Método PUT registrado na rota ${
          routeSpecify.put || route
        }`
      )
    }
  }
}
