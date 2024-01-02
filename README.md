# Explorer Library

## Getting the source

```sh
$ git clone git@github.com:enonic/lib-explorer.git && cd lib-explorer
```

or

```sh
$ git clone https://github.com/enonic/lib-explorer.git && cd lib-explorer
```

## Building

```sh
$ enonic project gradle clean build
```

## Testing

```sh
$ yarn run test
```

## Publishing

```sh
$ enonic project gradle clean build publishToMavenLocal --refresh-dependencies
```


## Include in an app

```build.gradle
dependencies {
	include 'com.enonic.lib:lib-explorer:4.x.x'
}
```
