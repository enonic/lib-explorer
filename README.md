# Explorer Library

## Getting the source

```sh
$ git clone git@github.com:enonic/lib-explorer.git && cd lib-explorer
```

or

```sh
$ git clone https://github.com/enonic/lib-explorer.git && cd lib-explorer
```

## Buildling

```sh
$ enonic project gradle clean build
```

## Publishing

```sh
$ enonic project gradle -- clean build publishToMavenLocal publish --refresh-dependencies
```


## Include in an app

```build.gradle
dependencies {
	include 'com.enonic.lib:lib-explorer:3.10.0'
}
```

## Compatibility

| App version | XP version |
| ----------- | ---------- |
| 3.(19|20).0 | 7.7.2 |
| 3.1[7-8].0 | 7.7.0 |
| 3.16.0 | 7.6.0 |
| 3.1[0-5].x | 7.5.0 |
| 3.[6-9].x | 7.4.1 |
| 3.[1-5].x | 7.3.2 |
| 3.0.7 | 7.3.1 |
| 3.0.6 | 7.3.0 |

## Changelog

### 3.20.0

* Use http Authorization header: Explorer-Api-Key XXXX

### 3.19.0

* Require Enonic XP 7.7.2
* Start using @enonic/js-utils (0.0.1)
* Fix BUG Default fields title, text index byType does not include ngram!
* Fix BUG Change of language doesn't cause document update (by including _indexConfig when diffing)
* Add stemmed query expressions to Default interface
* Update calls to indexTemplateToConfig to avoid deprecation warnings
* BUGFIX Second argument to folder() should be optional
* Use collection name rather than collection id when scheduling
* Support stemmed queries

### 3.18.0

* Adding language when building _indexConfig to support stemmed queries

### 3.17.0

* Add getLocales()
* Require Enonic XP 7.7 and use internal scheduling instead of lib-cron

### 3.16.0

* Require Enonic XP 7.6 and use distributed tasks

### 3.15.2

* lib-util-3.0.0

### 3.15.1

* Colletors/Document API write both _nodeType and type (for backwards compatibility)
* Polyfill Array.flat

### 3.15.0

* Move function parameters that start with __ to second argument without __
* Make collector/register handle different versions of installed app-explorer
* Only run collector/register on master
* Document API: Skip empty arrays which cause problems during diff
* Build indexConfig for document_metadata.modifiedTime on document/update()
* Add isModelLessThan
* should filter _nodeType/type = document in interface code (not GUI)
* Polyfill Number.isInteger
* Remove filters on SYSTEM_FIELDS from default interface node
* Make system fields ready for removal from explorer repo
* Add getModel and setModel
* lib-http-client:2.3.0 (okhttp/4.9.1)
* Build system upgrades
  * Node 14.17.1
  * Babel modules 7.14.6
  * Core-js 3.14.0
  * Webpack 5.39.1


### 3.14.4

* Version returned from application/list({getVersion:true}) needed toString()
* Only show register deprecation warning when installed explorer version >=1.5.0 <2.0.0

### 3.14.3

* Use document/createOrUpdate in Collector.persist
* Add object/isObject function

### 3.14.2

* Fix import paths

### 3.14.1

* Temporary support for both old and new collectors
* Deprecate collector/register in favour of src/main/resources/collectors.json

### 3.14.0

* Add collector/list function

### 3.13.1

* Return application/list key as string

### 3.13.0

* Add application/list function

### 3.12.1

* Sort fields by key
* DEFAULT_INTERFACE_NAME
* INTERFACES_FOLDER

### 3.12.0

* Support should filters in interfaces
* Schema change: type -> _nodeType
* Nested validation
* Min/max occurrences validation
* Type validation
* Build system upgrades
  * Node 14.17.0
  * Babel modules 7.14.3
  * Core-js 3.12.1
  * Webpack 5.37.0

### 3.11.1

* Add requireValid param to document API
* Better ValidationError handling

### 3.11.0

* Added document/create and document/update

### 3.10.3

* Removed displayName from Collections
* Babel modules 7.13.14
* Core-js 3.10.0
* Webpack 5.30.0

### 3.10.2

* Upgrade to Node 14.6.0
* Babel modules 7.13.8
* Core-js 3.9.1
* Webpack 5.24.2

### 3.10.1

* Webpack 5

### 3.10.0

* Add componentPath to register function
* Require Enonic XP 7.5.0
* Upgrade to Node 14.15.5
* Upgrade node modules

### 3.9.1

* Remove showSynonyms from facet links

### 3.9.0

* search({showSynonyms:true}) adds synonymsObj with highlight for debugging

### 3.8.1

* Force search({facets}) property values to always be arrays

### 3.8.0

* getSynonyms will now filter on languages
* thesaurus/query({thesauri}) make it possible to filter on thesaurus name(s)

### 3.7.0

* Added languages field to thesaurus
* getFields({fields}) make it possible to only get some fields
* getFieldValues({field}) field can now be an array of fields
* hasValue(field, values) now applies forceArray to its second parameter

### 3.6.0

* Generate href for hit tags
* Require Enonic XP 7.4.1

### 3.5.2

* Remove explain and logQueryResults from URL query parameters

### 3.5.1

* Log stacktraces when catching

### 3.5.0

* Work around nashorn issue with trunc and toInt
* Improve debugging with explain and logQueryResults parameters
* Use highlight fragmenter, numberOfFragments, order, postTag and preTag when searching

### 3.4.1

* BUGFIX Use washedSearchString in pagination and params

### 3.4.0

* Expose field and tag in facets

### 3.3.0

* Expose page in params

### 3.2.0

* Expose page in pagination

### 3.1.0

* Use highlighter provided by Enonic API
* Require Enonic XP 7.3.2

### 3.0.7

* Require Enonic XP 7.3.1
* BUGFIX A collector application can't check the license of app-explorer
