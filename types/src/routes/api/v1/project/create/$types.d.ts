import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
type RouteParams = {  }
type RouteId = '/api/v1/project/create';

export type RequestHandler = Kit.RequestHandler<RouteParams, RouteId>;
export type RequestEvent = Kit.RequestEvent<RouteParams, RouteId>;