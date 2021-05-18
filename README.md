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
| 3.1[01].x | 7.5.0 |
| 3.[6-9].x | 7.4.1 |
| 3.[1-5].x | 7.3.2 |
| 3.0.7 | 7.3.1 |
| 3.0.6 | 7.3.0 |

## Changelog

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
