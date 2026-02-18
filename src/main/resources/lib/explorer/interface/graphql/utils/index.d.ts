export type Branch<Leaf = string> = {
	[x :string]: Leaf|Branch
}

export type Fields = Record<string, unknown>;

export type GraphQLObjectType = unknown;
type GraphQLInterfaceType = unknown;
type GraphQLTypeReference = string;

export type FieldResolver<
	Env extends Record<string, unknown> = Record<string, unknown>,
	ResultGraph extends Record<string, unknown> = Record<string, unknown>
> = (env :Env) => ResultGraph
export type TypeResolver<Node extends Record<string, unknown> = Record<string, unknown>> = (node :Node) => GraphQLObjectType

export type Interfaces = Array<GraphQLInterfaceType|GraphQLTypeReference>
export type Types = Array<GraphQLObjectType|GraphQLTypeReference>
