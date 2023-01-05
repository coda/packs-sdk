---
nav: Migration
description: How to upgrade to a new SDK version and what to look out for.
---

# Migrating between SDK versions

While the Packs team strives to maintain backwards compatibility between SDK versions, there may occasionally be times where you need to change your code to work with a new SDK version. This page will include instructions on how to perform the migration. A detailed list of all changes in the SDK can be found in the [Changelog][changelog].


## Updating your SDK version

The Pack Studio web editor always uses the latest release of the SDK when building Packs. To update your Pack to a new version of the SDK simply press the **Build** button to rebuild your Pack.

If you use the Pack CLI you'll need to manually update the SDK when a new version is released. To do so, run the command:

```shell
npm install @codahq/packs-sdk@<version> --save
```

Where `<version>` is the version you want to upgrade to.

After updating the SDK locally you'll need to upload a new version of your Pack to Coda's servers:

```shell
npx coda upload pack.ts
```


## Deprecation warnings

To determine if you are using a deprecated SDK feature:

- If you build in the Pack Studio web editor, press the **Build** button to rebuild your Pack.
- If you build using the Pack CLI, run the `coda validate` command on your Pack:
    ```shell
    npx coda validate pack.ts
    ```

You'll then get warnings about any deprecated features your Pack is using. Consult a migration guide or the changelog for alternatives.


## Migration guides

The following sections walk you through the migration for specific versions of the SDK.

- [Version 0.11.0][v0.11.0]


[changelog]: ../changes.md
[v0.11.0]: v0.11.0.md
