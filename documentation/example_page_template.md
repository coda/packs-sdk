---
title: {{name}}
---

# {{pageTitle this}}

{{{content}}}

{{#each exampleSnippets}}
=== "{{name}}"
    ```ts
    {{{indent code 4}}}
    ```
{{/each}}
