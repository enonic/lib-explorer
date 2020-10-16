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
	include 'com.enonic.lib:lib-explorer:3.1.0'
}
```

## Compatibility

| App version | XP version |
| ----------- | ---------- |
| 3.[1-4].x | 7.3.2 |
| 3.0.7 | 7.3.1 |
| 3.0.6 | 7.3.0 |

## Changelog

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
