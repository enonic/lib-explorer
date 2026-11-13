# Types for Explorer library

Type definitions for the [Enonic Explorer library](https://github.com/enonic/lib-explorer). They are generated from the library's TypeScript source and published with every release, so the version matches the jar.

## Install

```bash
npm i --save-dev @enonic-types/lib-explorer
```

## Setup

Add lib-explorer to `paths` in the `tsconfig.json` file used for your application's server-side TypeScript code:

```json
{
  "compilerOptions": {
    "skipLibCheck": true,
    "types": ["@enonic-types/global"],
    "paths": {
      "/lib/explorer": ["./node_modules/@enonic-types/lib-explorer"],
      "/lib/explorer/*": ["./node_modules/@enonic-types/lib-explorer/*"],
      "/lib/xp/*": ["./node_modules/@enonic-types/lib-*"],
      "@enonic/js-utils/types": ["./node_modules/@enonic/js-utils/types"],
      "@enonic/js-utils/types/*": ["./node_modules/@enonic/js-utils/types/*"]
    }
  }
}
```

- The two `/lib/explorer` entries resolve `import ... from '/lib/explorer'` and deep imports such as `/lib/explorer/repo/connect`. The package mirrors the layout of the library, one declaration file per module.
- The `/lib/xp/*` and `@enonic/js-utils/types` entries let TypeScript resolve the types that the declarations borrow from [`@enonic/js-utils`](https://www.npmjs.com/package/@enonic/js-utils). Without them those types silently become `any`.
- `skipLibCheck` is required: the library is not written in strict mode, so its declarations do not pass a strict check.

The types that describe a collector's React form (`CollectorProps` and friends) need `@types/react`, which is an optional peer dependency.

## Use

```ts
import {Collector} from '/lib/explorer';
import type {CollectorTaskConfig} from '@enonic-types/lib-explorer';

type Config = {
    url: string
};

export function run({collectionId, collectorId, configJson, language}: CollectorTaskConfig) {
    const collector = new Collector<Config>({collectionId, collectorId, configJson, language});
    collector.start();

    const {url} = collector.config;
    collector.persistDocument({
        title: 'Example',
        url
    }, {
        documentTypeName: 'webpage'
    });
    collector.addSuccess({message: url});

    collector.stop();
}
```

Deep imports are typed the same way:

```ts
import {connect} from '/lib/explorer/repo/connect';
import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/model/2/constants';

const connection = connect({principals: [PRINCIPAL_EXPLORER_READ]});
```

The Collector API is documented in the [Explorer documentation](https://developer.enonic.com/docs/explorer).
