# lib-explorer TS types

## Install

```bash
npm i --save-dev @enonic-types/lib-explorer
```

## Use

Add the corresponding types to your `tsconfig.json` file that is used for application's server-side TypeScript code:

```json
{
  "compilerOptions": {
    "paths": {
      "/lib/explorer": ["./node_modules/@enonic-types/lib-explorer"],
    },
  }
}
```
