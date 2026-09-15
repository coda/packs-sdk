[![npm release](https://img.shields.io/npm/v/@codahq/packs-sdk?color=%23F8AD40&logo=coda&logoColor=%23EE5A29&style=flat-square)](https://www.npmjs.com/package/@codahq/packs-sdk)
[![Downloads](https://img.shields.io/npm/dt/@codahq/packs-sdk?color=%23F8AD40&label=npm%20downloads&style=flat-square)](https://coda.io/gallery?filter=Packs)
[![Community](https://img.shields.io/discourse/users?color=%23F8AD40&label=community&logo=coda&server=https%3A%2F%2Fcommunity.coda.io%2F&style=flat-square)](https://community.coda.io)

# Superhuman Packs SDK

Superhuman Packs allow you to extend the Superhuman suite, creating agents for Go and adding building blocks to Coda. To learn more, see [our SDK documentation](https://docs.superhuman.com/packs/build).

## Agent skill

This repo ships a [Claude Code skill](.claude/skills/create-agent-pack) that walks through building and
uploading an agent pack. Install it with the [`skills` CLI](https://github.com/vercel-labs/skills):

```bash
bunx skills add coda/packs-sdk --skill create-agent-pack --global
```

## Contributing

See our [Contributing guide](CONTRIBUTING.md) for more information on how to contribute to this project.
