import {
	Log,
	LibNode,
	Server,
} from '@enonic/mock-xp';
import { REPO_ID_EXPLORER } from '../main/resources/lib/explorer/constants';

const server = new Server({
	loglevel: 'debug'
});

server.createRepo({
	id: REPO_ID_EXPLORER,
});

const libNode = new LibNode({
	server
});

declare global {
	interface GlobalThis {
		log: Log;
		libNode: LibNode;
	}
}

(globalThis as unknown as GlobalThis).libNode = libNode;
(globalThis as unknown as GlobalThis).log = server.log;

export {};
