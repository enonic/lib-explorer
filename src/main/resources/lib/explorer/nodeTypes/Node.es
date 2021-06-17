//import {toStr} from '/lib/util';
import {isSet} from '/lib/util/value';

import {ucFirst} from '/lib/explorer/ucFirst';
import {create as createNode} from '/lib/explorer/node/create';
import {modify as modifyNode} from '/lib/explorer/node/modify';


export class Node {
	constructor({
		__connection,
		_parentPath = '/',
		_name = '', //throw new Error('_name is a required parameter'),
		_indexConfig = {
			//analyzer: 'document_index_default',
			default: 'byType'
		},
		displayName = ucFirst(_name),
		...rest
	}, {
		connection = __connection
	} = {}) {
		//log.info(toStr({_parentPath, _name, _indexConfig, displayName, rest}));
		if (isSet(__connection)) {
			log.warning(`Deprecation: Function signature changed. Added second argument for options.
				Old: new Node({__connection, ...})
				New: new Node({...}, {connection})`);
		}
		if (!_name) {
			throw new Error('_name is a required parameter');
		}
		this.connection = connection;
		/*if (!_indexConfig.analyzer) {
			_indexConfig.analyzer = 'document_index_default';
		}*/
		this.node = {
			_parentPath,
			_name,
			_indexConfig,
			displayName,
			...rest
		};
		//log.info(toStr({node: this.node}));
	} // constructor


	create({
		connection = this.connection // eslint-disable-line no-underscore-dangle
	} = {}) {
		//log.info(toStr({node: this.node}));
		return createNode(this.node, {connection});
	} // create


	modify({
		connection = this.connection // eslint-disable-line no-underscore-dangle
	} = {}) {
		//log.info(toStr({node: this.node}));
		return modifyNode(this.node, {connection});
	} // modify
} // class Node
