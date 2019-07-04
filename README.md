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
$ enonic project gradle publishToMavenLocal publish
```


## Include in an app

```build.gradle
dependencies {
	include 'com.enonic.lib:lib-explorer:1.0.0-SNAPSHOT'
}
```
