import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'graphql': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'graphql': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'graphql': { paramsTuple?: []; params?: {} }
  }
  OPTIONS: {
    'graphql': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'graphql': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'graphql': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'graphql': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'graphql': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}