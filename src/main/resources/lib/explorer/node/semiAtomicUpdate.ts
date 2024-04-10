import {
	dirname,
	enonify,
	join,
	toStr
} from '@enonic/js-utils';
import deepEqual from 'fast-deep-equal';

// import HumanDiff from 'human-object-diff';
//import * as HumanDiff from 'human-object-diff'; // This fails when doing app-explorer development build

// @ts-ignore Import assignment cannot be used when targeting ECMAScript modules.
import HumanDiff = require('human-object-diff');

const { diff: diffNode } = new HumanDiff({
	objectName: 'node'
});


export function semiAtomicUpdate({
	data: {
		_id,
		_name,
		_parentPath,
		_path = _parentPath && _name ? join([_parentPath, _name]) : undefined,
		_versionKey,
		...properties
	},
	options: {
		writeConnection // Connecting many places leeds to loss of control over principals, so pass a connection around.
	}
}) {
	if (!_versionKey) {
		const msg = `Unable to do atomicUpdate without _versionKey! _id:${_id} _path:${_path}`;
		log.error(msg);
		throw new Error(msg);
	}

	const node =  writeConnection.get(_id ? _id : _path);
	if (!node) {
		const msg = `Could not get old node _id:${_id} _path:${_path} _parentPath:${_parentPath} _name:${_name} _versionKey:${_versionKey}`;
		log.error(msg);
		throw new Error(msg);
	}
	if (!_id) _id = node._id;

	const {
		_versionKey: activeVersionKey
	} = node;
	if (_versionKey !== activeVersionKey) {
		const msg = `Node has been changed, denying update! _id:${_id} _path:${_path} _versionKey:${_versionKey} activeVersionKey:${activeVersionKey}`;
		log.error(msg);
		throw new Error(msg);
	}

	//──────────────────────────────────────────────────────────────────────────
	// move/rename
	//
	// A rename can be achieved by sending in
	//  1. _id and a new _name (_path is undefined)
	//  2. _path and a new _name (SEEMS LIKE A FRINGE CASE, I THINK _ID should be required for move/rename)
	//
	// A move can be achieved by sending in
	//  1. _id and a new _parentPath? _name should stay the same (_name could be fetched from node)
	//  2. _id and a new _path
	//
	// A simultaneous move and rename can be achieved by sending in
	//  1. _id and new _path where _name inside is changed (_name not passed in)
	//  2. _id and new _path and _name
	//  3. _id and new _parentPath and _name
	//──────────────────────────────────────────────────────────────────────────
	if (!_parentPath) _parentPath = dirname(_path);
	log.debug(`
_id: ${_id}
_parentPath: ${_parentPath}
node._name:${node._name} -> _name: ${_name}
node._path:${node._path} -> _path: ${_path}
	`);
	// What if new folder don't exist? Lets only allow rename for now.
	if (_name && _name !== node._name) {
		const boolRenamed = writeConnection.move({

			// Path or id of the node to be moved or renamed
			source: _id,

			// New path or name for the node. If the target ends in slash '/',
			// it specifies the parent path where to be moved.
			// Otherwise it means the new desired path or name for the node.
			target: _name

		});
		if (boolRenamed) {
			log.debug(`Moved/renamed id:${_id} from node._name:${node._name} to name:${_name}`);
			writeConnection.refresh();
		} else {
			const msg = `Something went wrong when trying to rename id:${_id} from node._name:${node._name} to name:${_name}!`;
			log.error(msg);
			throw new Error(msg);
		}
	}

	//──────────────────────────────────────────────────────────────────────────
	// diff
	//──────────────────────────────────────────────────────────────────────────
	const enonified = enonify({
		_id,
		_name,
		_path,
		_versionKey,
		...properties
	});
	if (deepEqual(node, enonified)) {
		log.debug(`Diff empty, update avoided id:${_id} _path:${_path} _parentPath:${_parentPath} _name:${_name} _versionKey:${_versionKey}`);
		return node;
	}
	log.info(`diff:${toStr(diffNode(node, enonified))}`);

	//──────────────────────────────────────────────────────────────────────────
	// update (modify)
	//──────────────────────────────────────────────────────────────────────────
	const updatedNode = writeConnection.modify({
		key: _id,
		editor: (oldNode) => {
			oldNode.properties = properties;
			return oldNode;
		}
	});
	log.info(`updatedNode:${toStr(updatedNode)}`);
	writeConnection.refresh();
	return updatedNode;
} // atomicModify
