# lib-explorer

Server-side library for Enonic Explorer. It owns the data model, the collector API and the search (GraphQL) engine. It is consumed by two kinds of code:

- `app-explorer` (sibling repo `../app-explorer`), the admin application, which `include`s this jar and imports `/lib/explorer/*` at runtime.
- Custom collector applications, which `include "com.enonic.lib:lib-explorer:<version>"` and use the `Collector` class from `/lib/explorer`.

Published as Maven artifact `com.enonic.lib:lib-explorer` (`gradle.properties`: `version=5.0.0-SNAPSHOT`, `xpVersion=8.1.1`, `nodeVersion=24.18.0`). The 5.x line targets XP 8. The last release line for XP 7 is `4.x` (branch `4.x`, latest tag `v4.5.0`).

User documentation lives in `../doc-explorer/docs` (AsciiDoc). `lib-explorer.adoc` there documents the Collector API; `upgrade-collector.adoc` documents the 3.x→4.x collector migration.

## Repository layout

```
src/main/resources/
  lib/explorer/            the library (283 .ts source files, 22 *.test.ts, 40 *.d.ts)
  lib/@types/q-i/          local type stub for the `q-i` debug printer
  admin/extensions/interfaceSelector/   Content Studio CustomSelector extension (see Extensions)
  global.d.ts              declares module 'q-i'
  tsconfig.json            tsconfig for the library source (used by tsc and tsdown)
src/main/java/com/enonic/explorer/   three XP script beans (see Java)
src/jest/                  jest setup files (setupGlobalThis.ts, setupMockXp.ts, types.ts)
src/test/java, src/test/resources   JUnit test that runs bundled JS on Nashorn and GraalJS
test/                      shared test fixtures (testData.ts, fields.ts) plus dead legacy files (see Legacy)
tsdown.config.ts           the bundler config (see Build)
jest.config.mjs            jest config (@swc/jest transform; plain JS so no TS loader is needed)
.oxlintrc.json             oxlint config (not part of CI or Gradle)
build.gradle               Gradle: npm install/check/test/build + jar + publish
```

`lib/explorer` sub-directories, largest first:

| Dir | Purpose |
|---|---|
| `interface/` | Interface node CRUD and `interface/graphql/`, the generated search API |
| `document/` | Document create/update pipeline, validation, type casting, index config |
| `types/` | Shared `.d.ts` types, re-exported by `types/index.d.ts` |
| `model/` | Model 2: constants, node-type factories, repositories, roles, users; `getModel`, `setModel`, `isModelLessThan` |
| `documentType/` | Document type CRUD, cache, managed document types |
| `node/` | Thin wrappers over `/lib/xp/node` (`create`, `modify`, `createOrModify`, `semiAtomicUpdate`, `referencedBy`, `cleanPermissions`) |
| `synonym/`, `thesaurus/`, `stopWords/`, `stemming/` | Search tuning data and lookups |
| `collection/`, `collector/`, `journal/`, `task/`, `scheduler/` | Collections, the Collector API, journals, task state, scheduled jobs |
| `repo/` | `connect`, `multiConnect`, `connectToCollection`, `init`, `maybeCreate`, `copy`, `rename`, `list` |
| `query/`, `field/`, `string/`, `array/`, `object/`, `url/`, `util/`, `path/`, `time/`, `typeGuards/`, `number/` | Helpers |
| `http/client/smartRequest.ts` | http-client wrapper with retries (covered by the Java test) |
| `application/`, `locale/` | Wrappers over the Java beans |
| `nodeTypes/`, `indexing/templateToConfig.ts` | Legacy; `templateToConfig` is marked deprecated |

`lib/explorer/index.ts` re-exports the constants plus `create`, `update`, `register`, `unregister`, `Collector`, `getSites`, `ids`, `toStr`. Consumers mostly import deep paths (`/lib/explorer/repo/connect` etc.) rather than the index.

## Build

Gradle drives npm. `./gradlew build` runs, in order: `npmInstall`, `npmCheck` (`npm run check` = `tsc --noEmit -p src/main/resources/tsconfig.json`), `npmTest` (`npm test` = jest), `npmBuild` (`npm run build` = `npx tsdown`), `jar`, then the JUnit tests (`test` on Nashorn, `testGraalJS` on GraalJS). `./gradlew publishToMavenLocal` (alias `pTML`) publishes the snapshot for `app-explorer` to pick up via `mavenLocal()`.

`tsdown.config.ts` (tsdown 0.23 / rolldown):

- Entries: every `src/main/resources/**/*.ts` except `*.d.ts` and `*.{spec,test}.{ts,tsx}`; `root` is `src/main/resources`, so output paths mirror the source tree under `build/resources/main`. Each source file becomes its own entry; shared code goes to `lib/explorer/_chunks/`.
- Format CommonJS, `cjsDefault: false`, `esModule: true`, `fixedExtension: false` (plain `.js`), `clean: false`, `minify: false`, no sourcemaps.
- `platform: 'neutral'` is forced through `inputOptions.platform` because tsdown would otherwise switch cjs builds to `node` and externalize Node builtins. `mainFields` is `['browser', 'module', 'main']`.
- `alias: { util: node_modules/@jspm/core/nodelibs/browser/util.js }`: the Node `util` module (pulled in by `traverse` → `typedarray.prototype.slice` → `object-inspect`) must not resolve to the `util` npm package, whose init reads `process.env`. `@jspm/core` is pinned to exactly `2.0.1`; 2.1.0 reads `navigator` at load and breaks Nashorn.
- `deps.neverBundle`: `/lib/cache`, `/^\/lib\/explorer/`, `/lib/graphql`, `/lib/graphql-connection`, `/lib/http-client`, `/lib/router`, `/lib/vanilla`, `/lib/thymeleaf`, and every `/lib/xp/*` used. These are XP libraries resolved at runtime from the jar classpath (`/lib/explorer/*` resolves to this library's own files). Only add an external here if the Gradle dependencies actually ship it; a stale entry hides a missing module until runtime (that is how a leftover `/lib/guillotine` import survived into a release candidate). `/lib/vanilla` and `/lib/thymeleaf` are still listed although nothing imports them and `build.gradle` no longer ships them.
- `deps.alwaysBundle`: the `BUNDLED_PACKAGES` list (`@enonic/explorer-utils`, `@enonic/fnv-plus`, `@enonic/js-utils`, `core-js`, `d3-dsv`, `deep-object-diff`, `diff`, `fast-deep-equal`, `human-object-diff`, `set-value`, `traverse`, `uri-js`), matched by exact name or subpath. devDependencies are bundled by default anyway; the list exists so `dependencies` entries get bundled too.
- Rolldown cannot emit ES5, so a `renderChunk` plugin runs `@swc/core` with `jsc.target: 'es5'` on every chunk, after rolldown targets `es2020`. Nashorn needs ES5; GraalJS would accept more. Keep this plugin; the output must stay free of `const`, `let`, classes, arrow functions and template literals.
- `outputOptions.intro` injects `var globalThis = (1, eval)('this');` after `"use strict"` in every file. `generatedCode.symbols: false` keeps `Symbol.toStringTag` out of the output.
- `tsconfig: src/main/resources/tsconfig.json` supplies the `paths` (`/lib/explorer/*`, `/lib/xp/*` → `@enonic-types/lib-*`, `@enonic-types/lib-explorer` → `lib/explorer/types/index.d.ts`, `/*` → `./*`).

Gradle `processResources` excludes `**/*.ts`, `**/*.es` and `**/*.json` from the jar, so only tsdown output (and Java classes) ship. Checked output invariants after a build: no `require("...")` of a bare npm name, every relative `require` resolves, no `Symbol.toStringTag`, no bare `process` or `global` identifiers.

### Verification gates

| Command | What it proves |
|---|---|
| `npm run check` | tsc typecheck of `src/main/resources` (strict is off) |
| `npm test` | 22 jest suites, 542 tests, on `@enonic/mock-xp` |
| `npm run lint` | oxlint (`correctness` category plus `no-unused-vars`, `no-unused-expressions` with short-circuit allowed, `ban-ts-comment`, `triple-slash-reference`); clean; not run by Gradle or CI |
| `./gradlew clean build` | everything above plus the jar and the Java script-engine tests |

CI: `.github/workflows/enonic-gradle.yml` builds and publishes via `enonic/release-tools/build-and-publish` on every push, releasing from `master` and `4.x`; `coverage.yml` runs `npm run cov` with Node 20 and uploads to Codecov.

### TypeScript and jest

- TypeScript is 7.x (native). It has no JS API, so the tooling that needed one is gone: jest transforms with `@swc/jest` (types are not checked by the tests; `npm run check` does that) and lint is oxlint. `@swc/jest` only hoists `jest.mock()` calls when `jest` is the global, not when it is imported from `@jest/globals`; test files that mock XP libraries must therefore not import `jest`, or the module under test loads before its mocks are registered.
- `src/main/resources/tsconfig.json`: `target ES2015` (lowered to ES5 by swc at build time), `moduleResolution bundler`, `strict false`, `types: ["@enonic-types/global", "react"]`. `react` types are needed because `lib/explorer/types/Collector.d.ts` describes the React props of a collector form (`React.Dispatch`, `React.MutableRefObject`), even though the library has no React code.
- `test/tsconfig.json` is editor-only (`module ESNext`, `moduleResolution bundler`, `target ES2022`, explicit `types`, `typeRoots` including `src/main/resources/lib/@types`); nothing runs it.
- `jest.config.mjs`: `testMatch` only matches `*.{spec,test}.{ts,tsx}` under `src/main/resources` and `test/`. `moduleNameMapper` maps `/lib/explorer/(.*)` to the source. Setup files create a `@enonic/mock-xp` `Server` with the explorer repo and expose `globalThis.libNode` and `globalThis.log`; `setupGlobalThis.ts` mocks `Java.type` for `java.lang.System` and `java.util.Locale`. The `globals.app.version` in this file is `4.4.3` and is only test data.
- `src/test/java/.../SmartRequestTest.java` uses `com.enonic.xp.testing.ScriptRunnerSupport` to run `src/test/resources/test/smartRequest-test.js` against the bundled `lib/explorer/http/client/smartRequest.js`, once per engine. Mocks for `/lib/http-client` and `/lib/xp/task` live in `src/test/resources/lib`.

## Runtime model

Constants come from the npm package `@enonic/explorer-utils` and are re-exported by `lib/explorer/constants.ts` (legacy aliases) and `lib/explorer/model/2/constants.ts`. `app-explorer` imports the same package, so the two repos share one definition.

- App key `com.enonic.app.explorer`. Main repo `REPO_ID_EXPLORER = 'com.enonic.app.explorer'`, branch `master`. Journals repo `REPO_JOURNALS = 'com.enonic.app.explorer.journals'`.
- Each collection is its own repo: `COLLECTION_REPO_PREFIX + name` = `com.enonic.app.explorer.collection.<name>`. The collection node itself lives in the main repo at `/collections/<name>`. The collection repo's root node holds the collector task state (`task/modify.ts`).
- Folders in the main repo: `/api-keys`, `/collections`, `/collectors` (legacy), `/documentTypes`, `/fields`, `/interfaces`, `/notifications`, `/stopwords`, `/thesauri` (synonyms are children of a thesaurus node).
- Node types are `com.enonic.app.explorer:` + `api-key`, `collection`, `document`, `documentType`, `field`, `folder`, `interface`, `journal`, `stop-words`, `synonym`, `thesaurus`. `NT_COLLECTOR` and `NT_FIELD_VALUE` are legacy and marked "TODO Remove in lib-explorer-5.0.0?".
- Roles: `com.enonic.app.explorer.admin` (Explorer Administrator), `.read`, `.write`, plus `system.admin`. Service user `user:system:com.enonic.app.explorer` (`USER_EXPLORER_APP_KEY`), which scheduled collector jobs run as.
- Document metadata is stored under the field path `document_metadata` (`FIELD_PATH_META`): `collection`, `collector {id, version}`, `createdTime`, `documentType`, `language`, `stemmingLanguage`, `valid`. The GraphQL layer exposes these as `_collection`, `_documentType` and friends. `global` (`FIELD_PATH_GLOBAL`) is the other reserved path.
- Model version: `setModel`/`getModel` store an integer `model` on a repo's root node; `isModelLessThan` gates migrations. The migration steps themselves are in `app-explorer` (`tasks/migrate/model/9.ts` … `19.ts`), not here.
- Events `custom.explorer.documentType.created` and `.updated` are sent on document type changes and invalidate the cached GraphQL schema.

### Collector API (`lib/explorer/collector/`)

A collector is an XP application that ships a `src/main/resources/collectors.json` (entries `{displayName, taskName, formAssetPath, formLibraryName}`), a task named `<app>:<taskName>` receiving `{collectionId, collectorId, configJson, language}`, and a React form bundle exposed as `window[formLibraryName].Collector`. `collector/list.ts` discovers collectors by reading `collectors.json` from every started application. `register()` throws (removed in 4.0.0) and `unregister()` only warns.

`Collector<Config>`: constructor validates params and parses `configJson`; `start()` creates the collection repo if needed, marks the task running and opens a journal; `persistDocument(data, {documentTypeName, language?, boolRequireValid?})` delegates to `document/createOrUpdate`; `queryDocuments`, `getDocumentNode`, `deleteDocument`; `addSuccess/addInformation/addWarning/addError({message})`; `shouldStop()` polls the repo root for `should === 'STOP'`; `stop()` writes the journal node to the journals repo, sets the task to FINISHED or FAILED and emails the addresses stored under `/notifications`. `ExtractedData.ts` wraps the `BinaryExtractorProvider` bean for binary-to-text extraction.

### Documents and document types (`document/`, `documentType/`)

`document/create` pipeline: `cleanData` → `constrainPropertyNames` → `validate` (`validateTypes`, `validateOccurrences`) → `addExtraFieldsToDocumentType` → `typeCastToJava` → `buildIndexConfig`, with options `cleanExtraFields`, `addExtraFields`, `requireValid`, `validateOccurrences`, `validateTypes`. Document types are nodes under `/documentTypes` with `properties[]` (`name`, `valueType`, `min`, `max`, `enabled`, `fulltext`, `nGram`, `includeInAllText`, `path`, `stemmed`, `active`). Managed document types (`managedBy`, `version`) are upserted by `maybeUpdateManagedDocumentType` only when the incoming `version` is higher; collectors ship them in `documentTypes.json`, which `app-explorer` reads. `documentTypesCache` memoizes lookups.

### Interfaces and the search API (`interface/graphql/`)

`makeSchema()` builds the public schema with `/lib/graphql` (`newSchemaGenerator`) and `/lib/graphql-connection`. It exposes one query field, `interface(name)`, returning `search(...)`, `getSearchConnection(first, after, ...)` and `querySynonyms(searchString, languages, profiling)`. Search arguments: `searchString`, `query` (Query DSL input), `filters`, `aggregations`, `highlight`, `sort`, `languages`, `explain`, `profiling`, `count`, `start`. One GraphQL object type is generated per document type (`addDocumentTypeObjectTypes`), which is why deleting a document type or field is a breaking API change. `getCachedSchema()` caches the schema in `/lib/cache` (size 1, one hour) and clears it on the document type events.

Search path: `searchResolver` → `getInterfaceInfo` (collections, field boosts, term queries, stop words, thesauri, stemming languages) → `makeQueryParams` (`wash`, `removeStopWords`, filters/aggregations from the guillotine ports in `filters/guillotine/` and `aggregations/guillotine/`) → `makeQueryAndSynonyms` (`synonym/getSynonymsFromSearchString`, `stemming/javaLocaleToSupportedLanguage`, `query/boostedQuery`) → `multiConnect` across the selected collection repos → `washDocumentNode` + `applyDocumentTypeToDocumentNode` on the hits.

### Types

`lib/explorer/types/index.d.ts` re-exports all `.d.ts` files and references `lib-node.augment.d.ts`, which re-adds `RepoConnection.modify` removed from the public XP 8 types. There is no `@enonic-types/lib-explorer` npm package; the name is a `paths` alias in this repo's tsconfigs and in `app-explorer`, which reaches these files through the symlink `app-explorer/symlinks/lib-explorer -> ../../lib-explorer` (CI checks this repo out into that path). Changing a type here can break `app-explorer`'s `verify:types` even though no package is published, and app-explorer also compiles this library's `.ts` sources under its own tsconfig, so `npm run check` passing here is not sufficient; run `npm run verify:types` in app-explorer after type changes.

### Extensions

`admin/extensions/interfaceSelector` is an `AdminExtension` implementing `contentstudio.customselector` (allowed for `cms.admin`, `cms.cm.app`, `cms.expert`, `system.admin`, `system.admin.login`). Its `GET` returns `{hits: [{id, displayName, description}], count, total}` for interface nodes matching `ids` or `query`, so a site app that includes this library can offer an "Explorer interface" CustomSelector (`extension: "interfaceSelector"` in a form). `enonic/app-explorer-client-simple` is the known consumer; `app-explorer` does not use it. Until lib-explorer 5.0 it was a `services/interfaceSelector` service referenced as `service: "interfaceSelector"`, which XP 8 deprecates.

### Java

`src/main/java/com/enonic/explorer/`: `BinaryExtractorProvider` (XP `BinaryExtractor`, used by `collector/ExtractedData.ts`), `Locales` (`getLocales(query)`, used by `locale/getLocales.ts`), `ApplicationServiceBean` (installed applications, used by `application/`). All are `ScriptBean`s obtained with `__.newBean`.

## Dependencies

Runtime code is bundled into the jar; nothing is resolved from node_modules at runtime. The jar's runtime needs are the Gradle `implementation` XP libraries listed in `build.gradle` (`xplibs.*`, `libs.lib.graphql`, `libs.lib.cache`, `libs.lib.http.client`, `libs.lib.license`, `libs.lib.router`), which the consuming app must also `include`.

npm packages imported by library code (all bundled): `@enonic/js-utils` (everywhere), `@enonic/explorer-utils` (constants; declared as a devDependency but is runtime code), `@enonic/fnv-plus` (`string/hash.ts`), `traverse` (document pipeline), `fast-deep-equal`, `deep-object-diff`, `human-object-diff` (change detection in `documentUnchanged`, `updateDocumentType`, `semiAtomicUpdate`, `createOrModifyJob`), `set-value` and `core-js` (`interface/graphql/utils/mergeFields.ts`), `uri-js` (`url/`), `d3-dsv` (`parseCsv.ts`).

Type-only imports: `@enonic-types/core`, `@enonic-types/lib-{node,auth,common,event,repo,value}`, and `type-fest` (`types/IndexConfig.d.ts`), which is not declared in package.json and resolves only as a transitive install.

Build and test tooling actually referenced: `tsdown`, `@swc/core`, `glob`, `@jspm/core` (all `tsdown.config.ts`); `typescript`, `jest`, `@swc/jest`, `@jest/globals`, `@enonic/mock-xp`, `@enonic/test-data`, `@types/jest`, `@types/node`, `@types/react`, `@enonic-types/global`; `oxlint`; `rimraf` (`npm run clean`).

`@types/d3-dsv`, `@types/human-object-diff`, `@types/set-value` and `@types/traverse` have no explicit references but TypeScript picks them up for the matching runtime packages; `npm run check` fails without them. Everything else declared is referenced. The October 2026 clean-up removed `cross-env`, `parallel`, `path`, `ts-toolbelt`, `tsconfig-paths`, `ts-node`, `tslib`, `jest-environment-jsdom`, `@types/bluebird`, `@types/diff`, `cli-color`, `colors`, `assert` (tests use the Node built-in), `q-i`, and with the TypeScript 7 move `ts-jest`, `eslint`, `@eslint/js`, `globals` and `typescript-eslint`; the `q-i` type stubs and the dead `test/*.test.js` files that imported those packages are still in the tree.

When changing dependencies, re-run the full gate (`./gradlew clean build`) and then rebuild and republish so `app-explorer` can be exercised against the result; several past breakages (`traverse` 0.6.11 pulling in `util`, `@jspm/core` 2.1.0) only showed up when the bundle ran on Nashorn, not in jest.

## Legacy and known debt

- `test/*.test.js` (`wash`, `highlight`, `mapSynonyms`, `replaceSyntax`, `checkAndApplyTypes`, `checkOccurrencesAndBuildIndexConfig`) are `ava` tests importing `.es` files and packages (`ava`, `cli-color`, `colors`, `q-i`) that are not installed; jest does not match `.js` tests. `test/lib/**` and `test/dummies.ts` are only used by them.
- `.swcrc.json` at the root is unused by any script or config; its `paths` point at directories that do not exist.
- `lib/@types/q-i` and `global.d.ts` only serve the `q-i` debug printer, which is referenced solely in comments.
- Legacy aliases in `constants.ts`, `nodeTypes/`, `NT_COLLECTOR`, `NT_FIELD_VALUE`, the `name` constructor parameter of `Collector` and `register()` are all marked for removal in 5.0.0.
- Many modules use `import x = require('...')` to dodge default-export interop problems from the old bundler; rolldown handles both forms.
- `query/wash.ts`, `query/replaceNonLetters.ts` and `synonym/washSynonyms.ts` warn that Nashorn's Unicode regexp support is uncertain.
