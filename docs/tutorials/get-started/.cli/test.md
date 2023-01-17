One of the advantages of developing with the CLI is that you can test your Pack code without having to upload it to Coda's servers. Let's test the `Hello` formula in the Pack:

```shell
npx coda execute pack.ts Hello "World"
```

If everything works correctly this should output `Hello World!`.
