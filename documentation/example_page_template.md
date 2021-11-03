---
title: {{name}}
---

# {{pageTitle this}}

{{{content}}}

{{#if (isTopic this)}}

{{! Have a header for each sample in a topic. }}
{{#each exampleSnippets}}
## {{name}}
{{content}}
```ts
{{{code}}}
```
{{/each}}

{{else}}

{{! For full samples, use a tabs instead. }}
{{#each exampleSnippets}}
=== "{{name}}"
    ```ts
    {{{indent code 4}}}
    ```
{{/each}}

{{/if}}
