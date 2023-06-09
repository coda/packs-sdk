---
nav: {{name}}{{#if (isBeta this)}} 🚧{{/if}}
description: {{description}}
{{#if icon}}icon: {{icon}}{{/if}}
---

# {{pageTitle this}}

{{{content}}}

{{#if (isTopic this)}}
{{! Topic Sample }}

{{#if learnMoreLink}}
[Learn More](../../..{{learnMoreLink}}){ .md-button }
{{/if}}

{{#each exampleSnippets}}
## {{name}}{{#if (isBeta this)}} 🚧{{/if}}
{{content}}

```ts
{% raw %}
{{{code}}}
{% endraw %}
```
{{/each}}

{{else}}

{{! Full Sample }}
{{#each exampleSnippets}}
=== "{{name}}"
    ```ts
    {{{indent code 4}}}
    ```
{{/each}}

{{/if}}
