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
	include 'com.enonic.lib:lib-explorer:3.20.3'
}
```

## Compatibility

| App version | XP version |
| ----------- | ---------- |
| 3.(19|20).x | 7.7.2 |
| 3.1[7-8].0 | 7.7.0 |
| 3.16.0 | 7.6.0 |
| 3.1[0-5].x | 7.5.0 |
| 3.[6-9].x | 7.4.1 |
| 3.[1-5].x | 7.3.2 |
| 3.0.7 | 7.3.1 |
| 3.0.6 | 7.3.0 |
