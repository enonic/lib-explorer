import type {RepoConnection} from '/lib/explorer/types/index.d';


export interface WriteConnection extends RepoConnection {
	//create :<N>(node :N) => N
	//get :(idOrPath :string) => Node
	/*modify :<N>(paramObject :{
		key :string,
		editor :(node :N) => N
	}) => N*/
	//refresh :() => void
}
