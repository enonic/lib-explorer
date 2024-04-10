import type {RepoConnection} from '@enonic-types/lib-explorer';


export type WriteConnection = RepoConnection & {
	//create :<N>(node :N) => N
	//get :(idOrPath :string) => Node
	/*modify :<N>(paramObject :{
		key :string,
		editor :(node :N) => N
	}) => N*/
	//refresh :() => void
}
