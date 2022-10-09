import { browser } from '$app/environment';
import type { Router } from '$lib/server/trpc';
import * as trpc from '@trpc/client';
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import trpcTransformer from 'trpc-transformer';

const url = browser ? '/trpc' : 'http://localhost:5174/trpc';

export default (loadFetch?: typeof fetch) =>
	trpc.createTRPCClient<Router>({
		url: loadFetch ? '/trpc' : url,
		transformer: trpcTransformer,
		...(loadFetch && { fetch: loadFetch })
	});

type Query = keyof Router['_def']['queries'];
type Mutation = keyof Router['_def']['mutations'];

export type InferQueryOutput<RouteKey extends Query> = inferProcedureOutput<
	Router['_def']['queries'][RouteKey]
>;
export type InferQueryInput<RouteKey extends Query> = inferProcedureInput<
	Router['_def']['queries'][RouteKey]
>;
export type InferMutationOutput<RouteKey extends Mutation> = inferProcedureOutput<
	Router['_def']['mutations'][RouteKey]
>;
export type InferMutationInput<RouteKey extends Mutation> = inferProcedureInput<
	Router['_def']['mutations'][RouteKey]
>;
