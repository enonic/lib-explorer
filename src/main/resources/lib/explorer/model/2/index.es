export {ROLES} from '/lib/explorer/model/2/roles/index';
export {USERS} from '/lib/explorer/model/2/users/index';
export {REPOSITORIES} from '/lib/explorer/model/2/repositories/index';
export {collection} from '/lib/explorer/model/2/nodeTypes/collection';
export {Document} from '/lib/explorer/model/2/nodeTypes/document';
export {field} from '/lib/explorer/model/2/nodeTypes/field';
export {fieldValue} from '/lib/explorer/model/2/nodeTypes/fieldValue';
export {interfaceModel} from '/lib/explorer/model/2/nodeTypes/interface';
export {journal} from '/lib/explorer/model/2/nodeTypes/journal';
export {stopwords} from '/lib/explorer/model/2/nodeTypes/stopwords';
export {synonym} from '/lib/explorer/model/2/nodeTypes/synonym';
export {thesaurus} from '/lib/explorer/model/2/nodeTypes/thesaurus';

export {DEFAULT_INTERFACE} from '/lib/explorer/model/2/interfaces/default';

/*

Everything are stored as nodes.
Each node has a unique field called _id.
A node can reference other nodes by using their _id.

An Interface can have:
* Many Collections
* Many Stopwordlists
* Many Fields (Filter, Result Mapping, Facet)
* Many FieldValues (Filter, Facet)


A Field can have:
* Many FieldValues (currently only referenced by path)

A FieldValue has (no references in UI, but).
* References Field (by fieldReference, and path)

*/
